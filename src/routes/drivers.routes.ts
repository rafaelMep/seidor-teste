import { Router } from "express";
import { z } from "zod";
import { driverService } from "../container";

export const driversRouter = Router();

const driverCreateSchema = z.object({
  nome: z.string().min(1),
});

const driverUpdateSchema = driverCreateSchema.partial();

driversRouter.post("/", (req, res, next) => {
  try {
    const body = driverCreateSchema.parse(req.body);
    const driver = driverService.create(body);
    res.status(201).json(driver);
  } catch (err) {
    next(err);
  }
});

driversRouter.get("/", (req, res, next) => {
  try {
    const nome = typeof req.query.nome === "string" ? req.query.nome : undefined;
    res.json(driverService.list({ nome }));
  } catch (err) {
    next(err);
  }
});

driversRouter.get("/:id", (req, res, next) => {
  try {
    res.json(driverService.getById(req.params.id));
  } catch (err) {
    next(err);
  }
});

driversRouter.put("/:id", (req, res, next) => {
  try {
    const body = driverUpdateSchema.parse(req.body);
    res.json(driverService.update(req.params.id, body));
  } catch (err) {
    next(err);
  }
});

driversRouter.delete("/:id", (req, res, next) => {
  try {
    driverService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
