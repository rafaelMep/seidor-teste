import { randomUUID } from "crypto";
import { Usage } from "../models/Usage";

export class UsageRepository {
  private items = new Map<string, Usage>();

  clear() {
    this.items.clear();
  }

  create(data: Omit<Usage, "id">): Usage {
    const usage: Usage = { id: randomUUID(), ...data };
    this.items.set(usage.id, usage);
    return usage;
  }

  getById(id: string): Usage | null {
    return this.items.get(id) ?? null;
  }

  update(id: string, data: Partial<Omit<Usage, "id">>): Usage | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const updated: Usage = { ...existing, ...data };
    this.items.set(id, updated);
    return updated;
  }

  list(): Usage[] {
    return [...this.items.values()];
  }

  findActiveByCarId(automovelId: string): Usage | null {
    for (const u of this.items.values()) {
      if (u.automovelId === automovelId && u.dataTermino === null) return u;
    }
    return null;
  }

  findActiveByDriverId(motoristaId: string): Usage | null {
    for (const u of this.items.values()) {
      if (u.motoristaId === motoristaId && u.dataTermino === null) return u;
    }
    return null;
  }
}
