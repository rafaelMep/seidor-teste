import { CarRepository } from "./repositories/CarRepository";
import { DriverRepository } from "./repositories/DriverRepository";
import { UsageRepository } from "./repositories/UsageRepository";
import { CarService } from "./services/CarService";
import { DriverService } from "./services/DriverService";
import { UsageService } from "./services/UsageService";

export const carRepo = new CarRepository();
export const driverRepo = new DriverRepository();
export const usageRepo = new UsageRepository();

export const carService = new CarService(carRepo);
export const driverService = new DriverService(driverRepo);
export const usageService = new UsageService(usageRepo, carRepo, driverRepo);

export function resetAll() {
  carRepo.clear();
  driverRepo.clear();
  usageRepo.clear();
}
