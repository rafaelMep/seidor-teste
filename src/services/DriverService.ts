import { AppError } from "../errors/AppError";
import { DriverRepository } from "../repositories/DriverRepository";

export class DriverService {
  constructor(private repo: DriverRepository) {}

  create(data: { nome: string }) {
    return this.repo.create(data);
  }

  getById(id: string) {
    const driver = this.repo.getById(id);
    if (!driver) throw new AppError(404, "Motorista não encontrado.");
    return driver;
  }

  update(id: string, data: Partial<{ nome: string }>) {
    const updated = this.repo.update(id, data);
    if (!updated) throw new AppError(404, "Motorista não encontrado.");
    return updated;
  }

  delete(id: string) {
    const ok = this.repo.delete(id);
    if (!ok) throw new AppError(404, "Motorista não encontrado.");
  }

  list(filter?: { nome?: string }) {
    return this.repo.list(filter);
  }
}
