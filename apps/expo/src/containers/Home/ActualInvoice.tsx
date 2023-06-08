import Button from "~/components/Button";
import StyledText from "~/components/StyledText";
import StyledView from "~/components/StyledView"
import { useContextHook } from "~/hook/Auth";
import { api } from "~/utils/api";
import * as WebBrowser from 'expo-web-browser';
import * as Clipboard from 'expo-clipboard';

const ActualInvoice = () => {
    const authContext = useContextHook();
    const pendingInvoices = api.mk.getPendingInvoices.useQuery({ session: authContext.session });
    const lastInvoice = pendingInvoices.data?.FaturasPendentes?.[0];
    const invoicePdf = api.mk.getInvoicePdf.useQuery({ session: authContext.session, cd_fatura: Number(lastInvoice?.codfatura ?? '') }, {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: (data) => WebBrowser.openBrowserAsync(data.PathDownload),
    });

    const invoiceBarNumber = api.mk.getInvoiceBarNumber.useQuery({
        session: authContext.session,
        cd_fatura: Number(lastInvoice?.codfatura ?? '')
    }, {
        enabled: !!lastInvoice?.codfatura,
    });
    const barNumber = invoiceBarNumber.data?.DadosFatura?.[0].ld;
    const copyToClipboard = async () => {
        if (barNumber) await Clipboard.setStringAsync(barNumber).then(() => alert('Código de barras copiado!'));
    };

    return (
        <StyledView className="border border-gray-400 mx-2 p-4 rounded-lg" >
            <StyledView className="flex  flex-row justify-between">
                <StyledText>Última Conta</StyledText>
                <StyledText>Pendente</StyledText>
            </StyledView>
            <StyledView className="flex justify-between">
                <StyledView>
                    <StyledText className="text-gray-500 text-xl">{
                        Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lastInvoice?.valor_total ?? 0)
                    }</StyledText>
                    <StyledText>{
                        //convert to format MAY. dd/mm from format DD/MM/YYYY
                        lastInvoice?.data_vencimento


                    }</StyledText>
                </StyledView>
                <Button
                    isLoading={invoicePdf.isLoading}
                    onPress={() => invoicePdf.refetch()}>
                    Ver Boleto
                </Button>
            </StyledView>
            <StyledView className="flex justify-between">
                <StyledText>{
                    //put string on this format 34191.75124 34567.871230 41234.560005 2 93670000026035
                    barNumber?.replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})/, '$1.$2 $3.$4 $5.$6 $7 $8')
                }</StyledText>
                <StyledText onPress={copyToClipboard}>Copiar código de barras</StyledText>

            </StyledView>
        </StyledView >
    );
}

export default ActualInvoice;