import session from "express-session";
import env from "./env";

export const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: env.application.env === "production", // HTTPS only in production
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: "strict",
  },
  name: "admin.sid", // Custom session name
});
