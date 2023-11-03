import { Header } from "~/components/header"
import { Page } from "~/components/ui/page"
import { ActualInvoice } from "./actual-invoice"
import { Options } from "./options"
import { Section } from "~/components/section"
import { PendingInvoices } from "./pending-invoices"

export const Invoice = () => {



  return (
    <Page >
      <Header title="Faturas" />
      <ActualInvoice />
      <Options />
      <Section title="Faturas Pendentes" />

      <PendingInvoices />
      <PendingInvoices />
      <PendingInvoices />
      <PendingInvoices />
    </Page>
  )
}

