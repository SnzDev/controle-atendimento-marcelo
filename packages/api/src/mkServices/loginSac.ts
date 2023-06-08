import { mk, type MkCustomError } from "./mk";

export interface LoginParams {
  user_sac: string;
  pass_sac: string;
}

export type LoginResponse =
  | {
    AcessoSAC: string;
    CodigoPessoa: number;
    Nome: string;
    status: "OK";
  }
  | MkCustomError;

export const loginSac = async (params: LoginParams) => {
  const data = await mk.post<LoginResponse | MkCustomError>(
    `/mk/WSMKUserSenhaSAC.rule?sys=MK0&user_sac=${params.user_sac}&pass_sac=${params.pass_sac}`,
  );
  return data.data;
};
