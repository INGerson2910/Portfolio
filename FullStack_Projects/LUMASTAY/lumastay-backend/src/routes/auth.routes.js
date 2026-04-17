import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { pool } from "../db/pool.js";
import { env } from "../config/env.js";
import { loginSchema, registerSchema } from "../validators/schemas.js";
import { ApiError } from "../utils/apiError.js";

export const authRouter = Router();

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    env.jwtSecret,
    { expiresIn: "8h" }
  );
}

authRouter.post("/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);

    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1 LIMIT 1`,
      [body.email]
    );

    if (existingUser.rows[0]) {
      throw new ApiError(409, "AUTH-409", "Email already registered");
    }

    const userId = randomUUID();
    const passwordHash = await bcrypt.hash(body.password, 10);

    await pool.query(`
      INSERT INTO users (id, name, email, password_hash, phone, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
    `, [userId, body.name, body.email, passwordHash, body.phone || null]);

    const user = {
      id: userId,
      name: body.name,
      email: body.email
    };

    const token = signToken(user);

    res.status(201).json({
      token,
      user
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);

    const result = await pool.query(
      `SELECT id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1`,
      [body.email]
    );

    const user = result.rows[0];
    if (!user) throw new ApiError(401, "AUTH-001", "Invalid credentials");

    const validPassword = await bcrypt.compare(body.password, user.password_hash);
    if (!validPassword) throw new ApiError(401, "AUTH-001", "Invalid credentials");

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});