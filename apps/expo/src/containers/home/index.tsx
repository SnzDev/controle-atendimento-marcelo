import { StatusBar } from "expo-status-bar";
import moment from "moment";
import { Image, Text, View } from "react-native";
import { LogoutButton } from "~/components/logout-button";
import { Page } from "~/components/ui/page";
import { CardPayment } from "~/containers/home/card-payment";
import { MainMenu } from "~/containers/home/main-menu";
import { YourPlan } from "~/containers/home/your-plan";
import { useContextHook } from "~/hook/auth";
import { api } from "~/utils/api";



export default function Home() {
    const isDay = Number(moment().format("HH")) < 12;
    const isAfternoon = Number(moment().format("HH")) >= 12;
    const isNight = Number(moment().format("HH")) >= 18;
    const authContext = useContextHook();
    const pendingInvoices = api.mk.getPendingInvoices.useQuery({ session: authContext.session });
    const lastInvoice = pendingInvoices.data?.FaturasPendentes?.filter((invoice) => invoice.contratos.includes(`Contrato: ${authContext.selectedConnection?.contract?.codcontrato}`))?.[0];
    const dateFormat = moment(lastInvoice?.data_vencimento, 'DD/MM/YYYY');
    return (
        <Page className="flex-1">
            <StatusBar backgroundColor="#1552A7" />
            <View className="bg-[#1552A7] p-4">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-md text-white">
                            {isDay && "Bom dia"}
                            {isAfternoon && "Boa tarde"}
                            {isNight && "Boa noite"}
                        </Text>
                        <Text className="text-lg font-bold text-white">{authContext.clientInfo.data?.nome}</Text>
                    </View>
                    <LogoutButton />

                </View>
            </View>

            <CardPayment invoice={lastInvoice} />
            <MainMenu />

            <YourPlan />

        </Page>);
}