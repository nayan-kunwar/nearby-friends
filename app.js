import express from "express";
import "dotenv/config";
import "./config/redis.js";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import { requestIdMiddleware } from "./middlewares/requestId.middleware.js";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { register } from "./metrics.js";
import { cpuTask } from "./helpers/cpuIntensiveTask.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://nearby-friends-client.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(morgan("dev"));

app.get("/", (req, res) => res.json({ message: "Server is up and running." }));
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.get("/heavy", (req, res) => {
  const rand = Math.random();

  // simulate logical failure
  if (rand < 0.2) {
    return res.status(500).json({ error: "Random failure" });
  }

  const start = Date.now();
  const result = cpuTask(4000);
  const duration = Date.now() - start;

  // simulate crash AFTER cpu work
  if (rand < 0.1) {
    console.error("💥 Simulated crash");
    process.exit(1);
  }

  res.json({
    status: "ok",
    durationMs: duration,
    result,
  });
});

app.use("/api", routes);

app.use(errorHandler);

export default app;
