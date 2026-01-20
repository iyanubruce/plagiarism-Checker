import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import compression from "compression";
import v1Routes from "./api/routes/index.routes";
import config from "./config/env";
import adminRoutes from "./api/routes/admin/index.routes";
import customErrorMiddleware from "./api/middlewares/custom-error-middleware";
import { sessionConfig } from "./config/session";
const app = express();
const PORT = config.application.port;

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));
app.use(sessionConfig);

app.use("/public", express.static("public"));

// Routes
app.use("/api", v1Routes);
app.use("/admin", adminRoutes);
// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(customErrorMiddleware);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found", data: null, path: _req.url });
});

export default app;
