require('dotenv').config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { createConnection } from "typeorm";
import router from "./routes";

createConnection().then(() => {
  const app = express();

  // 📦 אבטחה עם helmet
  app.use(helmet());

  // 🛡️ הגבלת קצב הבקשות – במיוחד ל־login ו־register
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 דקות
    max: 5,
    message: {
      message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });


  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  }));

  app.use("/api", router);

  app.listen(8000, () => {
    console.log("✅ Server is running on port 8000");
  });
});





