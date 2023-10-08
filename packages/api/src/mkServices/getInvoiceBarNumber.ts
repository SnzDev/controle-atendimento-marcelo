import { mk, type MkCustomError } from "./mk";

export interface InvoiceBarNumberRequest {
  cd_fatura: number;
  token: string;
}
export type InvoiceBarNumberResponse =
  | {
    DadosFatura: [
      {
        celular: string,
        codfatura: number,
        codigopessoa: number,
        data_vencimento: string;
        descricao: string;
        ld: string;
        nome: string;
        situacao: string;
        valor_nominal: number;
      }
    ],
    status: "OK"
  }
  | MkCustomError;

export const getInvoiceBarNumber = async (params: InvoiceBarNumberRequest) => {
  const data = await mk.get<InvoiceBarNumberResponse | MkCustomError>(
    `/mk/WSMKLDViaSMS.rule?sys=MK0&cd_fatura=${params.cd_fatura}&token=${params.token}`,
  );
  return data.data;
};
