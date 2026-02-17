import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

// ✅ NEW: Import security packages
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import artifactRoutes from "./routes/artifact.routes.js";
import likes from "./routes/likes.routes.js";
import comment from "./routes/comment.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { testing } from "./cron/testing.js";
import webHookRoutes from "./webhook/webhook.js";

// Import error handling middleware
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

/* Ensure uploads folder exists */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ==========================================
// ✅ SECURITY MIDDLEWARE (MUST BE FIRST!)
// ==========================================

// 1. Helmet - Sets security headers
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
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false // Allow embedding images from other origins
}));

// 2. MongoDB Sanitization - Prevents NoSQL injection
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️ Sanitized key: ${key} from ${req.ip}`);
  }
}));

// 3. HPP - Prevents HTTP Parameter Pollution
app.use(hpp({
  whitelist: ['page', 'limit', 'sort', 'fields', 'status']
}));

// ==========================================
// CORS Configuration
// ==========================================
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// ==========================================
// General Middleware
// ==========================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

/* Serve uploaded files */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ==========================================
// Routes
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CMS Backend is running",
    security: {
      helmet: "✅ Enabled",
      mongoSanitize: "✅ Enabled",
      hpp: "✅ Enabled",
      cors: "✅ Configured"
    }
  });
});

testing();

app.use("/webhook", webHookRoutes);
app.use("/auth", authRoutes);
app.use("/artifacts", artifactRoutes);
app.use("/likes", likes);
app.use("/comments", comment);
app.use("/chat", chatRoutes);

// ==========================================
// Error Handling (MUST BE LAST!)
// ==========================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;