import express, { Request, Response } from "express";
import cors from "cors";

const app = express();


app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // Adjust this to your frontend's URL
  }));



app.use(cors());

app.get("/", (req : Request, res: Response) => {
  res.send("Hello from Node Admin!");
});
