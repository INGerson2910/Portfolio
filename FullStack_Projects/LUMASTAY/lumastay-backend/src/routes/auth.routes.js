import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { env } from "../config/env.js";
import { loginSchema } from "../validators/schemas.js";
import { ApiError } from "../utils/apiError.js";

export const authRouter = Router();

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

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      env.jwtSecret,
      { expiresIn: "8h" }
    );

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