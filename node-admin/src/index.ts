import express from "express";
import cors from "cors";
import router from "./routes";
import { createConnection } from "typeorm";
import { Connection } from "mysql2/typings/mysql/lib/Connection";


createConnection().then(connection => {

  const app = express();
  // שימוש ב־express.json() כדי לפרש בקשות JSON – חובה ל־req.body לעבוד
  app.use(express.json());
  // הגדרת CORS: מאפשר לשלוח בקשות מהקליינט (בד"כ מ־localhost:3000 או מהפקת production)
  app.use(cors({
    credentials: true, // מאפשר שליחת cookies או headers כמו Authorization
    origin: ["http://localhost:3000"] //process.env.CLIENT_URL || אם מוגדר ב־.env ישתמש בו, אחרת localhost
  }));
  // כל הנתיבים מתחילים ב־/api – למשל /api/register, /api/login וכו’
  app.use("/api", router);
  // הפעלת השרת על פורט 8000
  app.listen(8000, () => {
    console.log("✅ Server is running on port 8000");
  });


})


