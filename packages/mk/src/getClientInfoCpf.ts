import { mk } from "./mk";

export interface ClientInfoRequest {
  cpfCnpj: string;
  token: string;

}

export type ClientInfoResponse = {
  CEP: string;
  CodigoPessoa: number;
  Email: string;
  Endereco: string;
  Fone: string;
  Latitude: string;
  Longitude: string;
  Nome: string;
  Situacao: string;
  status: string;
}


export interface ProvedorEmpresa {
  id: number;
  nome: string;
  cnpj: string;
  ie: string;
  endereco: string;
  municipio: string;
  uf: string;
  cep: string;
  fone: string;
}


export const getClientInfoCpf = async (params: ClientInfoRequest) => {
  const data = await mk.get<ClientInfoResponse>(
    `/mk/WSMKConsultaDoc.rule?sys=MK0&token=${params.token}&doc=${params.cpfCnpj}`,
  )
  return data.data;
};
