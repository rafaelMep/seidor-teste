import request from "supertest";
import { app } from "../src/app";
import { resetAll } from "../src/container";

describe("Regras de utilização", () => {
  beforeEach(() => resetAll());

  it("não permite 2 utilizações ativas para o mesmo carro", async () => {
    const car = await request(app).post("/cars").send({ placa: "ABC-1234", cor: "preto", marca: "Fiat" });
    const d1 = await request(app).post("/drivers").send({ nome: "João" });
    const d2 = await request(app).post("/drivers").send({ nome: "Maria" });

    await request(app).post("/usages").send({
      automovelId: car.body.id,
      motoristaId: d1.body.id,
      dataInicio: new Date().toISOString(),
      motivo: "Viagem",
    }).expect(201);

    await request(app).post("/usages").send({
      automovelId: car.body.id,
      motoristaId: d2.body.id,
      dataInicio: new Date().toISOString(),
      motivo: "Outra viagem",
    }).expect(409);
  });

  it("não permite motorista usar 2 carros ao mesmo tempo, mas permite após finalizar", async () => {
    const car1 = await request(app).post("/cars").send({ placa: "AAA-0001", cor: "azul", marca: "VW" });
    const car2 = await request(app).post("/cars").send({ placa: "BBB-0002", cor: "branco", marca: "GM" });
    const driver = await request(app).post("/drivers").send({ nome: "Bruce" });

    const uso = await request(app).post("/usages").send({
      automovelId: car1.body.id,
      motoristaId: driver.body.id,
      dataInicio: new Date().toISOString(),
      motivo: "Entrega",
    }).expect(201);

    await request(app).post("/usages").send({
      automovelId: car2.body.id,
      motoristaId: driver.body.id,
      dataInicio: new Date().toISOString(),
      motivo: "Outra entrega",
    }).expect(409);

    await request(app).patch(`/usages/${uso.body.id}/finish`).send({
      dataTermino: new Date(Date.now() + 60_000).toISOString(),
    }).expect(200);

    await request(app).post("/usages").send({
      automovelId: car2.body.id,
      motoristaId: driver.body.id,
      dataInicio: new Date().toISOString(),
      motivo: "Agora pode",
    }).expect(201);
  });
});
