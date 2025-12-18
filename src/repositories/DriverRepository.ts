import { randomUUID } from "crypto";
import { Driver } from "../models/Driver";

export class DriverRepository {
  private items = new Map<string, Driver>();

  clear() {
    this.items.clear();
  }

  create(data: Omit<Driver, "id">): Driver {
    const driver: Driver = { id: randomUUID(), ...data };
    this.items.set(driver.id, driver);
    return driver;
  }

  getById(id: string): Driver | null {
    return this.items.get(id) ?? null;
  }

  update(id: string, data: Partial<Omit<Driver, "id">>): Driver | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const updated: Driver = { ...existing, ...data };
    this.items.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.items.delete(id);
  }

  list(filter?: { nome?: string }): Driver[] {
    const nome = filter?.nome?.trim().toLowerCase();
    return [...this.items.values()].filter((d) => {
      if (!nome) return true;
      return d.nome.trim().toLowerCase().includes(nome);
    });
  }
}
