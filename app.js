import express from "express";
import "dotenv/config";
import "./config/redis.js";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://nearby-friends-client.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Server is up and running." }));
app.use("/api", routes);

export default app;
