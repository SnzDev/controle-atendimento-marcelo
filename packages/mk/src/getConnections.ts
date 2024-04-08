import { mk, type MkCustomError } from "./mk";

export type GetConnectionsResponse = {
  CodigoPessoa: number;
  Conexoes: Connections[];
  Nome: string;
  status: string;
}

export type Connections = {
  bloqueada: string;
  cadastro: Date;
  cep: string;
  codconexao: number;
  contrato: number;
  endereco: string;
  esta_reduzida: string;
  latitude: string;
  longitude: string;
  mac_address: string;
  motivo_bloqueio: null;
  username: string;
}

type GetConnectionsRequest = {
  personCode: number;
  token: string;
}

export const getConnections = async (params: GetConnectionsRequest) => {
  const data = await mk.get<GetConnectionsResponse | MkCustomError>(
    `/mk/WSMKConexoesPorCliente.rule?sys=MK0&cd_cliente=${params.personCode}&token=${params.token}`,
  );
  return data.data;
};
