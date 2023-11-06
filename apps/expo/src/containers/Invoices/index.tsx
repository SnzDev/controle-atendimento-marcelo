import { Header } from "~/components/header"
import { Page } from "~/components/ui/page"
import { ActualInvoice } from "./actual-invoice"
import { Options } from "./options"
import { Section } from "~/components/section"
import { PendingInvoices } from "./pending-invoices"
import { api } from "~/utils/api"
import { useContextHook } from "~/hook/auth"
import { useLocalSearchParams, useRouter } from "expo-router"


export const Invoice = () => {
  const invoiceId = Number(useLocalSearchParams().invoiceId as string ?? 0);

  const authContext = useContextHook();
  const pendingInvoices = api.mk.getPendingInvoices.useQuery({ session: authContext.session });
  const actualInvoice = pendingInvoices.data?.FaturasPendentes?.filter((invoice) => invoice.codfatura == invoiceId)?.[0];
  const invoiceBarNumber = api.mk.getInvoiceBarNumber.useQuery({
    session: authContext.session,
    cd_fatura: Number(actualInvoice?.codfatura ?? '')
  }, {
    enabled: !!actualInvoice?.codfatura,
  });
  const barNumber = invoiceBarNumber.data?.DadosFatura?.[0].ld;
  return (
    <Page >
      <Header title="Faturas" />
      {actualInvoice?.codfatura &&
        <>
          <ActualInvoice barNumber={barNumber} invoice={actualInvoice} />
          <Options barNumber={barNumber} invoiceId={actualInvoice?.codfatura} />
        </>
      }

      <Section title="Faturas Pendentes" />
      {pendingInvoices.data?.FaturasPendentes?.map((invoice) => (

        <PendingInvoices key={invoice.codfatura} invoice={invoice} />
      ))}
    </Page>
  )
}

