import { mk, type MkCustomError } from "./mk";

export type GetContractsResponse = {
  CodigoPessoa: number;
  ContratosAtivos: Contracts[];
  Nome: string;
  status: string;
}

export type Contracts = {
  adesao: Date;
  cd_empresa: number;
  codcontrato: number;
  nome_empresa: string;
  plano_acesso: string;
  previsao_vencimento: Date;
}


type GetContractsRequest = {
  personCode: number;
  token: string;
}

export const getContracts = async (params: GetContractsRequest) => {
  const data = await mk.get<GetContractsResponse | MkCustomError>(
    `/mk/WSMKContratosPorCliente.rule?sys=MK0&cd_cliente=${params.personCode}&token=${params.token}`,
  );
  return data.data;
};
