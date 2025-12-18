import { AppError } from "../errors/AppError";
import { CarRepository } from "../repositories/CarRepository";
import { DriverRepository } from "../repositories/DriverRepository";
import { UsageRepository } from "../repositories/UsageRepository";

function ensureValidIsoDate(value: string, fieldName: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new AppError(400, `${fieldName} inválida (use ISO 8601).`);
  return d;
}

export class UsageService {
  constructor(
    private usageRepo: UsageRepository,
    private carRepo: CarRepository,
    private driverRepo: DriverRepository
  ) {}

  create(data: { automovelId: string; motoristaId: string; dataInicio: string; motivo: string }) {
    const car = this.carRepo.getById(data.automovelId);
    if (!car) throw new AppError(404, "Automóvel não encontrado.");

    const driver = this.driverRepo.getById(data.motoristaId);
    if (!driver) throw new AppError(404, "Motorista não encontrado.");

    ensureValidIsoDate(data.dataInicio, "dataInicio");

    const activeCar = this.usageRepo.findActiveByCarId(data.automovelId);
    if (activeCar) throw new AppError(409, "Este automóvel já está em uso.");

    const activeDriver = this.usageRepo.findActiveByDriverId(data.motoristaId);
    if (activeDriver) throw new AppError(409, "Este motorista já está usando outro automóvel.");

    return this.usageRepo.create({
      automovelId: data.automovelId,
      motoristaId: data.motoristaId,
      dataInicio: data.dataInicio,
      dataTermino: null,
      motivo: data.motivo,
    });
  }

  finish(id: string, data: { dataTermino: string }) {
    const usage = this.usageRepo.getById(id);
    if (!usage) throw new AppError(404, "Utilização não encontrada.");
    if (usage.dataTermino !== null) throw new AppError(409, "Esta utilização já foi finalizada.");

    const inicio = ensureValidIsoDate(usage.dataInicio, "dataInicio");
    const termino = ensureValidIsoDate(data.dataTermino, "dataTermino");
    if (termino.getTime() < inicio.getTime()) throw new AppError(400, "dataTermino não pode ser menor que dataInicio.");

    const updated = this.usageRepo.update(id, { dataTermino: data.dataTermino });
    if (!updated) throw new AppError(404, "Utilização não encontrada.");
    return updated;
  }

  listJoined() {
    return this.usageRepo.list().map((u) => {
      const car = this.carRepo.getById(u.automovelId);
      const driver = this.driverRepo.getById(u.motoristaId);

      return {
        id: u.id,
        dataInicio: u.dataInicio,
        dataTermino: u.dataTermino,
        motivo: u.motivo,
        motorista: driver ? { id: driver.id, nome: driver.nome } : null,
        automovel: car ? { id: car.id, placa: car.placa, cor: car.cor, marca: car.marca } : null,
      };
    });
  }
}
