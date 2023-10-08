
import { Stack, Tabs, router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogoutButton } from "~/components/logout-button";
import { useContextHook } from "~/hook/auth";
import LogoMini from "../../../assets/icons/logo-mini";
import ActualInvoice from "./actual-invoice";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Button from "~/components/ui/button";
import { openWhatsApp } from "~/utils/deep-link-whatsapp";

const Home = () => {
    const safeArea = useSafeAreaInsets();
    const authContext = useContextHook();
    const name = authContext.clientInfo.data?.nome.split(" ")?.[0]?.toLocaleLowerCase();

    return (
        <View className="flex-1" style={{ paddingBottom: safeArea.bottom }}>
            <Stack.Screen
                options={{
                    title: "Início",
                    headerRight: LogoutButton,
                    headerStyle: { backgroundColor: "#1e40af" },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    // href: '/home',
                    // tabBarIcon: ({ color, size }) => (
                    //     <MaterialIcons name="home" size={size} color={color} />
                    // ),

                }}
            />
            <View className="flex flex-row items-center p-2">
                <LogoMini className="w-[140px] h-[90px]" />
                <View className="ml-2">
                    <Text className="text-xl text-blue-800 capitalize">Olá, {name}!</Text>
                    <Text className="text-sm text-gray-500">Como podemos ajudar?</Text>
                </View>
            </View>

            <ActualInvoice />


            <View className="flex flex-col items-center p-2 mt-10">
                {(authContext.connections.data?.Conexoes.length ?? 1) > 1 && <Button onPress={() => router.replace('select-plan')}>
                    Selecionar Ponto
                </Button>}

                <Button onPress={() => openWhatsApp('5586999135090', 'Preciso de suporte!')}>
                    <MaterialCommunityIcons name="whatsapp" size={20} /><Text>Suporte</Text>
                </Button>
            </View>

        </View>
    );
}

export default Home;