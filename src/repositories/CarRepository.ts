import { randomUUID } from "crypto";
import { Car } from "../models/Car";

export class CarRepository {
  private items = new Map<string, Car>();

  clear() {
    this.items.clear();
  }

  findByPlaca(placa: string): Car | null {
    const p = placa.trim().toLowerCase();
    for (const car of this.items.values()) {
      if (car.placa.trim().toLowerCase() === p) return car;
    }
    return null;
  }

  create(data: Omit<Car, "id">): Car {
    const car: Car = { id: randomUUID(), ...data };
    this.items.set(car.id, car);
    return car;
  }

  getById(id: string): Car | null {
    return this.items.get(id) ?? null;
  }

  update(id: string, data: Partial<Omit<Car, "id">>): Car | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const updated: Car = { ...existing, ...data };
    this.items.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.items.delete(id);
  }

  list(filter?: { cor?: string; marca?: string }): Car[] {
    const cor = filter?.cor?.trim().toLowerCase();
    const marca = filter?.marca?.trim().toLowerCase();

    return [...this.items.values()].filter((c) => {
      if (cor && c.cor.trim().toLowerCase() !== cor) return false;
      if (marca && c.marca.trim().toLowerCase() !== marca) return false;
      return true;
    });
  }
}
