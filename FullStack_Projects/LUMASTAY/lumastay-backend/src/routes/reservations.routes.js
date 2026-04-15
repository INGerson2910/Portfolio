import { Router } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { pool } from "../db/pool.js";
import { env } from "../config/env.js";
import { reservationSchema, cancelSchema } from "../validators/schemas.js";
import { ApiError } from "../utils/apiError.js";

export const reservationsRouter = Router();

function authenticate(req) {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");
  if (!token) throw new ApiError(401, "AUTH-002", "Missing token");

  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "AUTH-003", "Invalid token");
  }
}

reservationsRouter.post("/reservations", async (req, res, next) => {
  const client = await pool.connect();

  try {
    const user = authenticate(req);
    const body = reservationSchema.parse(req.body);

    const roomResult = await client.query(`
      SELECT
        rt.id,
        rt.hotel_id,
        rt.rate_plan_code,
        rt.currency,
        ROUND(AVG(COALESCE(i.rate_override, rt.base_rate)), 2) AS nightly_rate,
        MIN(i.available_units) AS min_units
      FROM room_types rt
      JOIN inventories i ON i.room_type_id = rt.id
      WHERE rt.id = $1
        AND rt.hotel_id = $2
        AND i.inventory_date >= $3
        AND i.inventory_date < $4
      GROUP BY rt.id
      HAVING COUNT(DISTINCT i.inventory_date) = ($4::date - $3::date)
    `, [body.roomTypeId, body.hotelId, body.checkIn, body.checkOut]);

    const room = roomResult.rows[0];
    if (!room) throw new ApiError(400, "INV-001", "Room not available for selected dates");
    if (Number(room.min_units) < body.rooms) throw new ApiError(400, "INV-002", "Not enough inventory");

    const nights = Math.max(
      1,
      Math.round((new Date(body.checkOut) - new Date(body.checkIn)) / 86400000)
    );

    const subtotal = Number(room.nightly_rate) * nights * body.rooms;
    const taxes = Math.round(subtotal * env.taxRate * 100) / 100;
    const total = subtotal + taxes;

    const reservationId = randomUUID();
    const paymentId = randomUUID();
    const locator = `LUMA-${String(Date.now()).slice(-8)}`;

    const paymentStatus =
      body.paymentMethod === "sandbox_declined" ? "declined" :
      body.paymentMethod === "sandbox_pending" ? "pending" :
      "approved";

    const reservationStatus =
      paymentStatus === "declined" ? "failed" :
      paymentStatus === "pending" ? "pending" :
      "confirmed";

    await client.query("BEGIN");

    await client.query(`
      INSERT INTO reservations (
        id, locator, user_id, hotel_id, room_type_id, check_in, check_out,
        adults, children, rooms, status, rate_plan_code, total_amount, taxes, currency, refund_amount,
        reservation_holder, buyer_name, buyer_email, buyer_phone,
        billing_street, billing_city, billing_state, billing_postal_code, billing_country
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,$14,$15,$16,
        $17,$18,$19,$20,
        $21,$22,$23,$24,$25
      )
    `, [
      reservationId,
      locator,
      user.sub,
      body.hotelId,
      body.roomTypeId,
      body.checkIn,
      body.checkOut,
      body.adults,
      body.children,
      body.rooms,
      reservationStatus,
      room.rate_plan_code,
      total,
      taxes,
      room.currency,
      reservationStatus === "confirmed" ? total : 0,
      body.buyer.reservationHolder,
      body.buyer.buyerName,
      body.buyer.email,
      body.buyer.phone,
      body.buyer.street,
      body.buyer.city,
      body.buyer.state,
      body.buyer.postalCode,
      body.buyer.country
    ]);

    await client.query(`
      INSERT INTO payments (id, reservation_id, amount, provider, status)
      VALUES ($1, $2, $3, 'sandbox', $4)
    `, [paymentId, reservationId, total, paymentStatus]);

    await client.query(`
      INSERT INTO reservation_events (reservation_id, event_type, payload_json)
      VALUES ($1, $2, $3::jsonb)
    `, [reservationId, "reservation_created", JSON.stringify({ paymentMethod: body.paymentMethod })]);

    if (reservationStatus === "confirmed" || reservationStatus === "pending") {
      await client.query(`
        UPDATE inventories
        SET available_units = GREATEST(0, available_units - $1)
        WHERE room_type_id = $2
          AND inventory_date >= $3
          AND inventory_date < $4
      `, [body.rooms, body.roomTypeId, body.checkIn, body.checkOut]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      reservationId,
      locator,
      status: reservationStatus,
      paymentStatus,
      totalAmount: total,
      currency: room.currency
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    next(error);
  } finally {
    client.release();
  }
});

reservationsRouter.get("/reservations", async (req, res, next) => {
  try {
    const user = authenticate(req);

    const result = await pool.query(`
      SELECT
        r.id AS "reservationId",
        r.locator,
        r.status,
        r.check_in AS "checkIn",
        r.check_out AS "checkOut",
        r.adults,
        r.children,
        r.rooms,
        r.total_amount AS "totalAmount",
        r.currency,
        h.name AS "hotelName",
        rt.name AS "roomName"
      FROM reservations r
      JOIN hotels h ON h.id = r.hotel_id
      JOIN room_types rt ON rt.id = r.room_type_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [user.sub]);

    res.json({ reservations: result.rows });
  } catch (error) {
    next(error);
  }
});

reservationsRouter.get("/reservations/:reservationId", async (req, res, next) => {
  try {
    const user = authenticate(req);

    const result = await pool.query(`
      SELECT
        r.id AS "reservationId",
        r.locator,
        r.status,
        r.check_in AS "checkIn",
        r.check_out AS "checkOut",
        r.adults,
        r.children,
        r.rooms,
        r.total_amount AS "totalAmount",
        r.currency,
        h.name AS "hotelName",
        rt.name AS "roomName"
      FROM reservations r
      JOIN hotels h ON h.id = r.hotel_id
      JOIN room_types rt ON rt.id = r.room_type_id
      WHERE r.id = $1 AND r.user_id = $2
      LIMIT 1
    `, [req.params.reservationId, user.sub]);

    const reservation = result.rows[0];
    if (!reservation) throw new ApiError(404, "RES-404", "Reservation not found");

    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

reservationsRouter.post("/reservations/:reservationId/cancel", async (req, res, next) => {
  const client = await pool.connect();

  try {
    const user = authenticate(req);
    const body = cancelSchema.parse(req.body);

    const reservationResult = await client.query(`
      SELECT *
      FROM reservations
      WHERE id = $1 AND user_id = $2
      LIMIT 1
    `, [req.params.reservationId, user.sub]);

    const reservation = reservationResult.rows[0];
    if (!reservation) throw new ApiError(404, "RES-404", "Reservation not found");
    if (reservation.status === "cancelled") throw new ApiError(400, "RES-409", "Reservation already cancelled");

    const refundAmount =
      reservation.status === "confirmed"
        ? Number(reservation.total_amount)
        : 0;

    await client.query("BEGIN");

    await client.query(`
      UPDATE reservations
      SET status = 'cancelled',
          refund_amount = $2
      WHERE id = $1
    `, [reservation.id, refundAmount]);

    await client.query(`
      INSERT INTO reservation_events (reservation_id, event_type, payload_json)
      VALUES ($1, $2, $3::jsonb)
    `, [reservation.id, "reservation_cancelled", JSON.stringify({ reason: body.reason })]);

    await client.query(`
      UPDATE inventories
      SET available_units = available_units + $1
      WHERE room_type_id = $2
        AND inventory_date >= $3
        AND inventory_date < $4
    `, [reservation.rooms, reservation.room_type_id, reservation.check_in, reservation.check_out]);

    await client.query("COMMIT");

    res.json({
      reservationId: reservation.id,
      status: "cancelled",
      refundAmount
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    next(error);
  } finally {
    client.release();
  }
});