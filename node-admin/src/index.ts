import express, { Request, Response } from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();


app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // Adjust this to your frontend's URL
}));




routes(app);
app.listen(8000) ,() => {
    console.log("Server is running on port 8000");
}



