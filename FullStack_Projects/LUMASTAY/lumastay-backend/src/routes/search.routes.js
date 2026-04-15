import { Router } from "express";
import { pool } from "../db/pool.js";
import { searchSchema } from "../validators/schemas.js";
import { ApiError } from "../utils/apiError.js";

export const searchRouter = Router();

searchRouter.get("/destinations", async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT city, country, COUNT(*)::int AS "hotelCount"
      FROM hotels
      WHERE status = 'active'
      GROUP BY city, country
      ORDER BY city ASC
    `);

    res.json({ destinations: result.rows });
  } catch (error) {
    next(error);
  }
});

searchRouter.post("/search", async (req, res, next) => {
  try {
    const body = searchSchema.parse(req.body);
    const adults = body.adults ?? body.guests ?? 1;
    const children = body.children ?? 0;

    const filters = [];
    const values = [body.destination, body.checkIn, body.checkOut, body.rooms, adults, children];
    let param = 7;

    if (body.minPrice !== undefined) {
      filters.push(`COALESCE(i.rate_override, rt.base_rate) >= $${param++}`);
      values.push(body.minPrice);
    }

    if (body.maxPrice !== undefined) {
      filters.push(`COALESCE(i.rate_override, rt.base_rate) <= $${param++}`);
      values.push(body.maxPrice);
    }

    if (body.minRating !== undefined) {
      filters.push(`h.rating >= $${param++}`);
      values.push(body.minRating);
    }

    if (body.propertyType) {
      filters.push(`h.property_type ILIKE $${param++}`);
      values.push(body.propertyType);
    }

    if (body.amenity) {
      filters.push(`$${param++} = ANY(h.amenities)`);
      values.push(body.amenity);
    }

    let orderBy = `ORDER BY "minRate" ASC, h.rating DESC`;
    if (body.sortBy === "price_desc") orderBy = `ORDER BY "minRate" DESC, h.rating DESC`;
    if (body.sortBy === "rating_desc") orderBy = `ORDER BY h.rating DESC, "minRate" ASC`;

    const result = await pool.query(`
      SELECT
        h.id AS "hotelId",
        h.name AS "hotelName",
        h.city,
        h.country,
        h.zone,
        h.property_type AS "propertyType",
        h.description,
        h.stars,
        h.rating,
        h.review_count AS "reviewCount",
        h.image_url AS "imageUrl",
        h.amenities,
        rt.currency,
        MIN(COALESCE(i.rate_override, rt.base_rate)) AS "minRate",
        MIN(rt.rate_plan_code) AS "ratePlanCode",
        BOOL_OR(i.available_units >= $4) AS available
      FROM hotels h
      JOIN room_types rt ON rt.hotel_id = h.id
      JOIN inventories i ON i.room_type_id = rt.id
      WHERE h.status = 'active'
        AND h.city ILIKE $1
        AND i.inventory_date >= $2
        AND i.inventory_date < $3
        AND rt.capacity_adults >= $5
        AND rt.capacity_children >= $6
        ${filters.length ? `AND ${filters.join(" AND ")}` : ""}
      GROUP BY
        h.id, h.name, h.city, h.country, h.zone, h.property_type,
        h.description, h.stars, h.rating, h.review_count,
        h.image_url, h.amenities, rt.currency
      HAVING COUNT(DISTINCT i.inventory_date) = ($3::date - $2::date)
         AND BOOL_OR(i.available_units >= $4)
      ${orderBy}
    `, values);

    res.json({
      searchId: `src_${Date.now()}`,
      criteria: {
        destination: body.destination,
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        adults,
        children,
        rooms: body.rooms
      },
      results: result.rows
    });
  } catch (error) {
    next(error);
  }
});

searchRouter.get("/hotels/:hotelId/availability", async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { checkIn, checkOut, adults = 1, children = 0, rooms = 1 } = req.query;

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      throw new ApiError(400, "VAL-001", "Invalid date range");
    }

    const result = await pool.query(`
      SELECT
        rt.id AS "roomTypeId",
        rt.name,
        rt.bed_type AS "bedType",
        rt.board_plan AS "boardPlan",
        rt.cancellation_policy AS "cancellationPolicy",
        rt.capacity_adults AS "capacityAdults",
        rt.capacity_children AS "capacityChildren",
        MIN(i.available_units) AS "availableUnits",
        ROUND(AVG(COALESCE(i.rate_override, rt.base_rate)), 2) AS "nightlyRate",
        rt.currency,
        rt.rate_plan_code AS "ratePlanCode"
      FROM room_types rt
      JOIN inventories i ON i.room_type_id = rt.id
      WHERE rt.hotel_id = $1
        AND i.inventory_date >= $2
        AND i.inventory_date < $3
        AND rt.capacity_adults >= $5
        AND rt.capacity_children >= $6
      GROUP BY rt.id
      HAVING COUNT(DISTINCT i.inventory_date) = ($3::date - $2::date)
         AND MIN(i.available_units) >= $4
      ORDER BY "nightlyRate" ASC
    `, [hotelId, checkIn, checkOut, Number(rooms), Number(adults), Number(children)]);

    res.json({
      hotelId,
      criteria: {
        checkIn,
        checkOut,
        adults: Number(adults),
        children: Number(children),
        rooms: Number(rooms)
      },
      rooms: result.rows
    });
  } catch (error) {
    next(error);
  }
});