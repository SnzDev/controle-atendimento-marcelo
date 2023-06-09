
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoMini from "../../../assets/icons/LogoMini";
import React from "react";
import StyledText from "~/components/StyledText";
import StyledView from "~/components/StyledView";
import { useContextHook } from "~/hook/Auth";
import ActualInvoice from "./ActualInvoice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs, useRouter } from "expo-router";
import { Button } from "react-native";

const Home = () => {
    const safeArea = useSafeAreaInsets();
    const authContext = useContextHook();
    const name = authContext.clientInfo.data?.nome.split(" ")?.[0]?.toLocaleLowerCase();
    const router = useRouter();

    return (
        <StyledView className="flex-1" style={{ paddingBottom: safeArea.bottom }}>
            <Tabs.Screen
                options={{
                    title: "Home",
                    headerRight: () => (
                        <Button
                            onPress={() => {
                                AsyncStorage.setItem('token', '');
                                authContext.handleSetSessionId('');
                                router.replace('/Login');
                            }}
                            color="#fff"
                            title="Sair"
                        />
                    ),
                    headerStyle: { backgroundColor: "#1e40af" },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    href: '/Home'

                }}
            />
            <StyledView className="flex flex-row items-center p-2">
                <LogoMini className="w-[140px] h-[90px]" />
                <StyledView className="ml-2">
                    <StyledText className="text-xl text-blue-800 capitalize">Olá, {name}!</StyledText>
                    <StyledText className="text-sm text-gray-500">Como podemos ajudar?</StyledText>
                </StyledView>
            </StyledView>

            <ActualInvoice />
        </StyledView>
    );
}

export default Home;