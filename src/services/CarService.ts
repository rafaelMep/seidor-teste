import { AppError } from "../errors/AppError";
import { CarRepository } from "../repositories/CarRepository";

export class CarService {
  constructor(private repo: CarRepository) {}

  create(data: { placa: string; cor: string; marca: string }) {
    const existing = this.repo.findByPlaca(data.placa);
    if (existing) throw new AppError(409, "Já existe um automóvel com essa placa.");
    return this.repo.create(data);
  }

  getById(id: string) {
    const car = this.repo.getById(id);
    if (!car) throw new AppError(404, "Automóvel não encontrado.");
    return car;
  }

  update(id: string, data: Partial<{ placa: string; cor: string; marca: string }>) {
    if (data.placa) {
      const existing = this.repo.findByPlaca(data.placa);
      if (existing && existing.id !== id) throw new AppError(409, "Placa já está em uso.");
    }

    const updated = this.repo.update(id, data);
    if (!updated) throw new AppError(404, "Automóvel não encontrado.");
    return updated;
  }

  delete(id: string) {
    const ok = this.repo.delete(id);
    if (!ok) throw new AppError(404, "Automóvel não encontrado.");
  }

  list(filter?: { cor?: string; marca?: string }) {
    return this.repo.list(filter);
  }
}
