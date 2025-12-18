export interface Usage {
  id: string;
  dataInicio: string;      // ISO string
  dataTermino: string | null;
  motoristaId: string;
  automovelId: string;
  motivo: string;
}
