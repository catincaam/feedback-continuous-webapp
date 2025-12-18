import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import DB_Init from "./entities/DB_Init.js";

import authRouter from "./routes/authRouter.js";
import teacherRouter from "./routes/TeacherRouter.js";
import activityRouter from "./routes/ActivityRouter.js";
import feedbackRouter from "./routes/FeedbackRouter.js";
import createDbRouter from "./routes/createDbRouter.js";

dotenv.config();

const app = express();

/** 1) Log la început ca să vezi preflight-ul (OPTIONS) și Origin */
app.use((req, res, next) => {
  console.log("REQ", req.method, req.url, "Origin:", req.headers.origin);
  next();
});

/** 2) CORS config unică */
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // păstrează true doar dacă folosești cookies/sesiuni
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/** 3) CORS înainte de routes */
app.use(cors(corsOptions));

/** 4) Preflight pentru toate rutele, CU aceleași opțiuni */
app.options(/.*/, cors(corsOptions));

/** 5) Body parsing după CORS (e ok și înainte, dar așa e curat) */
app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRouter);
app.use("/api/db", createDbRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/activities", activityRouter);
app.use("/api/feedback", feedbackRouter);

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({
    message: "Internal server error",
    detail: err?.message,
    stack: err?.stack,
  });
});

app.get("/", (req, res) => res.json({ message: "Backend works!" }));

/* INIT DATABASE */
DB_Init().catch((err) => console.error("Failed to initialize database", err));



const PORT = process.env.PORT || 9001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
