import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { correlation } from "./middleware/correlation.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";
import { searchRouter } from "./routes/search.routes.js";
import { reservationsRouter } from "./routes/reservations.routes.js";
import { openapi } from "./openapi.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(correlation);
app.use(pinoHttp());

app.get("/health", (_req, res) => res.json({ status: "ok", service: "lumastay-backend" }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapi));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", searchRouter);
app.use("/api/v1", reservationsRouter);

app.use(errorHandler);