import express from "express";
import { carsRouter } from "./routes/cars.routes";
import { driversRouter } from "./routes/drivers.routes";
import { usagesRouter } from "./routes/usages.routes";
import { AppError } from "./errors/AppError";

export const app = express();

app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/cars", carsRouter);
app.use("/drivers", driversRouter);
app.use("/usages", usagesRouter);

app.use((err: any, req: any, res: any, next: any) => {
  if (err?.name === "ZodError") {
    return res.status(400).json({ error: "Payload inválido", details: err.errors });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Erro interno." });
});
