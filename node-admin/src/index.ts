import express from "express";
import cors from "cors";
import router from "./routes";

const app = express();

app.use(express.json()); // ❗ זה הכי חשוב
app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000"]
}));
app.use("/api", router); // <--- תן prefix 'api' כאן

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
