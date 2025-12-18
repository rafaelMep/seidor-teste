# Seidor – Teste Técnico Prático (Backend)

API REST em **Node.js (Express)** + **TypeScript**, com **persistência em memória**, para gerenciar:

* **Automóveis**
* **Motoristas**
* **Utilizações** (alocação de automóvel por motorista)

Inclui **regras de negócio** e **testes automatizados**.

---

## Stack

* Node.js + Express
* TypeScript
* Validação: Zod
* Testes: Jest + Supertest
* Persistência: em memória (sem banco)

---

## Requisitos

* Node.js (LTS recomendado)
* npm

---

## Como rodar

Instalar dependências:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

A API sobe em:

* `http://localhost:3000`

Healthcheck:

* `GET /health`

---

## Scripts

* `npm run dev` – sobe a API em modo desenvolvimento
* `npm test` – executa os testes
* `npm run build` – gera build em `dist/`
* `npm start` – executa a API a partir do `dist/`

> Nota: em ambientes com Node mais recente (ex.: Node 25+), o script de testes pode incluir `node --no-experimental-webstorage` apenas para evitar warnings no console.

---

## Testes

Rodar testes:

```bash
npm test
```

---

## Endpoints

### Automóveis (`/cars`)

Criar automóvel:

* `POST /cars`

```json
{ "placa": "ABC-1234", "cor": "preto", "marca": "Fiat" }
```

Listar automóveis (com filtros opcionais):

* `GET /cars?cor=preto&marca=Fiat`

Buscar por id:

* `GET /cars/:id`

Atualizar:

* `PUT /cars/:id`

```json
{ "cor": "branco" }
```

Excluir:

* `DELETE /cars/:id`

---

### Motoristas (`/drivers`)

Criar motorista:

* `POST /drivers`

```json
{ "nome": "João" }
```

Listar motoristas (com filtro opcional):

* `GET /drivers?nome=jo`

Buscar por id:

* `GET /drivers/:id`

Atualizar:

* `PUT /drivers/:id`

```json
{ "nome": "João da Silva" }
```

Excluir:

* `DELETE /drivers/:id`

---

### Utilizações (`/usages`)

Criar utilização (iniciar uso):

* `POST /usages`

```json
{
  "dataInicio": "2025-12-18T12:00:00.000Z",
  "motivo": "Viagem",
  "motoristaId": "UUID",
  "automovelId": "UUID"
}
```

Finalizar utilização:

* `PATCH /usages/:id/finish`

```json
{ "dataTermino": "2025-12-18T13:00:00.000Z" }
```

Listar utilizações (retorna com motorista e automóvel):

* `GET /usages`

---

## Regras de negócio

* Um automóvel **não pode** estar em uso por mais de um motorista ao mesmo tempo.
* Um motorista **não pode** usar dois automóveis ao mesmo tempo.

---

## Observações

* A persistência é feita **em memória** (sem banco), conforme permitido no enunciado.
* Ao reiniciar a aplicação, os dados em memória são reinicializados.

---

## Exemplo rápido (PowerShell)

```powershell
$base = "http://localhost:3000"

$car = Invoke-RestMethod -Method Post -Uri "$base/cars" -ContentType "application/json" -Body (@{
  placa = "ABC-1234"; cor = "preto"; marca = "Fiat"
} | ConvertTo-Json)

$driver = Invoke-RestMethod -Method Post -Uri "$base/drivers" -ContentType "application/json" -Body (@{
  nome = "João"
} | ConvertTo-Json)

$usage = Invoke-RestMethod -Method Post -Uri "$base/usages" -ContentType "application/json" -Body (@{
  automovelId = $car.id
  motoristaId = $driver.id
  dataInicio  = (Get-Date).ToString("o")
  motivo      = "Viagem"
} | ConvertTo-Json)

Invoke-RestMethod -Method Get -Uri "$base/usages"

Invoke-RestMethod -Method Patch -Uri "$base/usages/$($usage.id)/finish" -ContentType "application/json" -Body (@{
  dataTermino = (Get-Date).AddMinutes(1).ToString("o")
} | ConvertTo-Json)
```
