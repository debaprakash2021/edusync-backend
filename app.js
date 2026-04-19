import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import authRoutes from "./routes/auth.routes.js";
import artifactRoutes from "./routes/artifact.routes.js";
import likes from "./routes/likes.routes.js";
import comment from "./routes/comment.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import courseRoutes from "./routes/course.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import noteRoutes from "./routes/note.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import searchRoutes from "./routes/search.routes.js";
import { testing } from "./cron/testing.js";
import webHookRoutes from "./webhook/webhook.js";
import paymentRoutes from "./routes/payment.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(mongoSanitize({ replaceWith: "_" }));
app.use(hpp({ whitelist: ["page", "limit", "sort", "fields", "status"] }));

const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use("/payments/webhook", express.raw({ type: "application/json" }));
app.use((req, res, next) => {
  if (req.originalUrl === "/payments/webhook") {
    req.rawBody = req.body;
  }
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "EduSync backend running" });
});

testing();

app.use("/webhook", webHookRoutes);
app.use("/auth", authRoutes);
app.use("/artifacts", artifactRoutes);
app.use("/likes", likes);
app.use("/comments", comment);
app.use("/chat", chatRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/quizzes", quizRoutes);
app.use("/reviews", reviewRoutes);
app.use("/notes", noteRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/search", searchRoutes);
app.use("/payments", paymentRoutes);
app.use("/invoices", invoiceRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;