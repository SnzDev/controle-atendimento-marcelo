import { getInvoiceBarNumber } from "./getInvoiceBarNumber";
import { getInvoicePdf } from "./getInvoicePdf";

type GetInvoiceWithPdfAndBarProps = {
  cd_fatura: number;
  token: string;
}
export const getInvoiceWithPdfAndBar = async (props: GetInvoiceWithPdfAndBarProps) => {


  const data = await getInvoiceBarNumber(props);
  const pdf = await getInvoicePdf(props);


  if (data.status !== "OK" || pdf.status !== "OK") return;

  return {
    ...pdf,
    barCode: data.DadosFatura[0].ld
  }
}
