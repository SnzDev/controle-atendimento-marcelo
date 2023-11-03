import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import { Page } from "~/components/ui/page";
import { CardPayment } from "~/containers/home/card-payment";
import { MainMenu } from "~/containers/home/main-menu";
import { YourPlan } from "~/containers/home/your-plan";



export default function Home() {


    return (
        <Page className="flex-1">
            <StatusBar backgroundColor="#1552A7" />
            <View className="bg-[#1552A7] p-4">
                <View className="flex-row items-center gap-4">
                    <Image
                        source={{ uri: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=399&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
                        width={70}
                        height={70}
                        className="rounded-full"
                        alt="Picture of the author"
                    />
                    <View>
                        <Text className="text-md text-white">Bom dia</Text>
                        <Text className="text-lg font-bold text-white">Thálisson Moreira</Text>
                    </View>
                </View>
            </View>

            <CardPayment />
            <MainMenu />

            <YourPlan />

        </Page>);
}