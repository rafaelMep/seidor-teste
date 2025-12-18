import { Router } from "express";
import { z } from "zod";
import { carService } from "../container";

export const carsRouter = Router();

const carCreateSchema = z.object({
  placa: z.string().min(1),
  cor: z.string().min(1),
  marca: z.string().min(1),
});

const carUpdateSchema = carCreateSchema.partial();

carsRouter.post("/", (req, res, next) => {
  try {
    const body = carCreateSchema.parse(req.body);
    const car = carService.create(body);
    res.status(201).json(car);
  } catch (err) {
    next(err);
  }
});

carsRouter.get("/", (req, res, next) => {
  try {
    const cor = typeof req.query.cor === "string" ? req.query.cor : undefined;
    const marca = typeof req.query.marca === "string" ? req.query.marca : undefined;
    res.json(carService.list({ cor, marca }));
  } catch (err) {
    next(err);
  }
});

carsRouter.get("/:id", (req, res, next) => {
  try {
    res.json(carService.getById(req.params.id));
  } catch (err) {
    next(err);
  }
});

carsRouter.put("/:id", (req, res, next) => {
  try {
    const body = carUpdateSchema.parse(req.body);
    res.json(carService.update(req.params.id, body));
  } catch (err) {
    next(err);
  }
});

carsRouter.delete("/:id", (req, res, next) => {
  try {
    carService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
