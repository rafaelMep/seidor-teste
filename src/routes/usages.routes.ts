import { Router } from "express";
import { z } from "zod";
import { usageService } from "../container";

export const usagesRouter = Router();

const usageCreateSchema = z.object({
  dataInicio: z.string().min(1),
  motivo: z.string().min(1),
  motoristaId: z.string().min(1),
  automovelId: z.string().min(1),
});

const usageFinishSchema = z.object({
  dataTermino: z.string().min(1),
});

usagesRouter.post("/", (req, res, next) => {
  try {
    const body = usageCreateSchema.parse(req.body);
    const usage = usageService.create(body);
    res.status(201).json(usage);
  } catch (err) {
    next(err);
  }
});

usagesRouter.patch("/:id/finish", (req, res, next) => {
  try {
    const body = usageFinishSchema.parse(req.body);
    const updated = usageService.finish(req.params.id, body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

usagesRouter.get("/", (req, res, next) => {
  try {
    res.json(usageService.listJoined());
  } catch (err) {
    next(err);
  }
});
