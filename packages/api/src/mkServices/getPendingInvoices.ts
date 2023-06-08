import { mk, type MkCustomError } from "./mk";

export interface PendingInvoicesRequest {
  cd_cliente: number;
}
export type PendingInvoicesResponse =
  | {
    CodigoPessoa: number;
    FaturasPendentes: [{
      codfatura: number;
      contas: string;
      contratos: string;
      data_vencimento: string;
      descricao: string;
      valor_total: number;
    }];
    Nome: string;
    status: "OK";
  }
  | MkCustomError;




export const getPendingInvoices = async (params: PendingInvoicesRequest) => {
  const data = await mk.get<PendingInvoicesResponse | MkCustomError>(
    `/mk/WSMKFaturasPendentes.rule?sys=MK0&cd_cliente=${params.cd_cliente}`,
  );
  return data.data;
};
