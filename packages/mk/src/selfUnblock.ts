import { mk, type MkCustomError } from "./mk";

export interface SelfUnblockParams {
  token: string;
  cod_conexao: string;
}

export type SelfUnblockResponse =
  | {
      AcessoSAC: string;
      CodigoPessoa: number;
      Nome: string;
      status: "OK";
    }
  | MkCustomError;

export const selfUnblock = async (params: SelfUnblockParams) => {
  const data = await mk.post<SelfUnblockResponse | MkCustomError>(
    `/mk/WSMKAutoDesbloqueio.rule?sys=MK0&cd_conexao=${params.cod_conexao}&token=${params.token}`,
  );
  return data.data;
};
