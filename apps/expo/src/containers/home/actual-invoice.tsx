import Button from "~/components/ui/button";
import { useContextHook } from "~/hook/auth";
import { api } from "~/utils/api";
import * as WebBrowser from 'expo-web-browser';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, Text, View } from "react-native";

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
        <View className="border border-gray-400 mx-2 p-4 rounded-lg" >
            <View className="flex mb-2 flex-row justify-between">
                <Text className="text-sm">Última Conta</Text>
                <View className="flex flex-row ">
                    <MaterialIcons name="info-outline" style={{ color: 'orange' }} size={18} color="black" />
                    <Text className="ml-2 text-orange-400">Pendente</Text>
                </View>
            </View>
            <View className="flex flex-row justify-between">
                <View>
                    <Text className="text-slate-700 text-xl">{
                        Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lastInvoice?.valor_total ?? 0)
                    }</Text>
                    <Text>{lastInvoice?.data_vencimento}</Text>
                </View>
                <View className="w-36">
                    <Button
                        variant="contained"
                        isLoading={invoicePdf.isFetching}
                        onPress={() => invoicePdf.refetch()}>
                        Ver Boleto
                    </Button>
                </View>
            </View>
            <View className="flex flex-row justify-between items-center mt-2">
                <Text className="w-44 text-[8px] text-gray-500">{
                    //put string on this format 34191.75124 34567.871230 41234.560005 2 93670000026035
                    barNumber?.replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})/, '$1.$2 $3.$4 $5.$6 $7 $8')
                }</Text>
                <Pressable onPress={copyToClipboard} className="flex flex-row w-36 items-center">
                    <MaterialIcons name="content-copy" style={{ color: "rgb(30 64 175) / 1" }} size={24} color="black" />
                    <Text className="text-blue-800 text-xs ml-2 font-bold">
                        Copiar código de barras
                    </Text>
                </Pressable>
            </View>
        </View >
    );
}

export default ActualInvoice;