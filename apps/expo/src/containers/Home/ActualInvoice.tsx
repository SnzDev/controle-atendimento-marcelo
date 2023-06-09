import Button from "~/components/Button";
import StyledText from "~/components/StyledText";
import StyledView from "~/components/StyledView"
import { useContextHook } from "~/hook/Auth";
import { api } from "~/utils/api";
import * as WebBrowser from 'expo-web-browser';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from "@expo/vector-icons";
import StyledPressable from "~/components/StyledPressable";
import Toast from "react-native-root-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ActualInvoice = () => {
    const authContext = useContextHook();
    const safeArea = useSafeAreaInsets();

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
        if (barNumber) await Clipboard.setStringAsync(barNumber).then(() => {
            Toast.show('Código copiado', {
                position: Toast.positions.BOTTOM - 90,
                duration: Toast.durations.LONG,
                backgroundColor: '#1e40af',
                textColor: '#fff'
            });
        });
    };


    return (
        <StyledView className="border border-gray-400 mx-2 p-4 rounded-lg" >
            <StyledView className="flex mb-2 flex-row justify-between">
                <StyledText className="text-sm">Última Conta</StyledText>
                <StyledView className="flex flex-row ">
                    <MaterialIcons name="info-outline" style={{ color: 'orange' }} size={18} color="black" />
                    <StyledText className="ml-2 text-orange-400">Pendente</StyledText>
                </StyledView>
            </StyledView>
            <StyledView className="flex flex-row justify-between">
                <StyledView>
                    <StyledText className="text-slate-700 text-xl">{
                        Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lastInvoice?.valor_total ?? 0)
                    }</StyledText>
                    <StyledText>{lastInvoice?.data_vencimento}</StyledText>
                </StyledView>
                <StyledView className="w-36">
                    <Button
                        variant="contained"
                        isLoading={invoicePdf.isFetching}
                        onPress={() => invoicePdf.refetch()}>
                        Ver Boleto
                    </Button>
                </StyledView>
            </StyledView>
            <StyledView className="flex flex-row justify-between items-center mt-2">
                <StyledText className="w-44 text-[8px] text-gray-500">{
                    //put string on this format 34191.75124 34567.871230 41234.560005 2 93670000026035
                    barNumber?.replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})/, '$1.$2 $3.$4 $5.$6 $7 $8')
                }</StyledText>
                <StyledPressable onPress={copyToClipboard} className="flex flex-row w-36 items-center">
                    <MaterialIcons name="content-copy" style={{ color: "rgb(30 64 175) / 1" }} size={24} color="black" />
                    <StyledText className="text-blue-800 text-xs ml-2 font-bold">
                        Copiar código de barras
                    </StyledText>
                </StyledPressable>
            </StyledView>
        </StyledView >
    );
}

export default ActualInvoice;