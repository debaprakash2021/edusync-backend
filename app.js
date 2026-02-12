import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.routes.js";
import artifactRoutes from "./routes/artifact.routes.js";
import likes from "./routes/likes.routes.js";
import comment from "./routes/comment.routes.js";
import { testing } from "./cron/testing.js";
import webHookRoutes from "./webhook/webhook.js";
import chatRoutes from "./routes/chat.routes.js"


const app = express();

/* Ensure uploads folder exists */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* Middlewares */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

/* Serve uploaded files */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* Routes */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CMS Backend is running"
  });
});


testing();

app.use("/webhook", webHookRoutes); 
app.use("/auth", authRoutes);
app.use("/artifacts", artifactRoutes);
app.use("/likes", likes);
app.use("/comments", comment);
app.use("/chat",chatRoutes);

export default app;
