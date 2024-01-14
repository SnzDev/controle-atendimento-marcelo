import { Header } from "~/components/header"
import { Page } from "~/components/ui/page"
import { ActualInvoice } from "./actual-invoice"
import { Options } from "./options"
import { Section } from "~/components/section"
import { PendingInvoices } from "./pending-invoices"
import { api } from "~/utils/api"
import { useContextHook } from "~/hook/auth"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ScrollView } from "react-native"
import { LegacyRef, useRef } from "react";


export const Invoice = () => {
  const invoiceId = Number(useLocalSearchParams().invoiceId as string);

  const authContext = useContextHook();
  const scrollViewRef = useRef<ScrollView>(null);

  const { data } = api.mk.getPendingInvoices.useQuery({ session: authContext.session });
  const pendingInvoices = data?.FaturasPendentes?.filter(
    (invoice) => invoice.contratos.includes(`Contrato: ${authContext.selectedConnection?.contract?.codcontrato}`)
  ).filter((invoice) => !invoiceId || (invoice.codfatura === invoiceId))[0];

  const invoiceBarNumber = api.mk.getInvoiceBarNumber.useQuery({
    session: authContext.session,
    cd_fatura: Number(pendingInvoices?.codfatura)
  }, {
    enabled: !!pendingInvoices?.codfatura,
  });
  const barNumber = invoiceBarNumber.data?.DadosFatura?.[0].ld;

  function scrollToTop() {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }
  return (
    <Page >
      <Header title="Faturas" />
      <ScrollView ref={scrollViewRef} className="mb-10">
        {pendingInvoices?.codfatura &&
          <>
            <ActualInvoice barNumber={barNumber} invoice={pendingInvoices} />
            <Options barNumber={barNumber} invoiceId={pendingInvoices?.codfatura} />
          </>
        }

        <Section title="Faturas Pendentes" />
        {data?.FaturasPendentes?.map((invoice) => {
          if (pendingInvoices?.codfatura === invoice.codfatura) return null;
          return <PendingInvoices onSelect={scrollToTop} key={invoice.codfatura} invoice={invoice} />
        })}
      </ScrollView>
    </Page>
  )
}

