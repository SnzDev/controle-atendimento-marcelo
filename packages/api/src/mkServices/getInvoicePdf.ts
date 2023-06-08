import { mk, type MkCustomError } from "./mk";

export interface InvoicePdfRequest {
  cd_fatura: number;
}
export type InvoicePdfResponse =
  | {
    CodigoPessoa: number;
    Fatura: string;
    PathDownload: string;
    Valor: string;
    Vcto: string;
    status: "OK";
  }
  | MkCustomError;


export const getInvoicePdf = async (params: InvoicePdfRequest) => {
  const data = await mk.get<InvoicePdfResponse | MkCustomError>(
    `/mk/WSMKSegundaViaCobranca.rule?sys=MK0&cd_fatura=${params.cd_fatura}`,
  );
  return data.data;
};
