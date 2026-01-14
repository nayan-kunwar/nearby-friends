import express from "express";
import "dotenv/config";
import "./config/redis.js";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(cors("*"));
app.use(express.json());

app.use("/api", routes);

export default app;
