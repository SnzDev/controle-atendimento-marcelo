import { useSafeAreaInsets } from "react-native-safe-area-context";

import assets from "../../../assets";
import Form from "./form";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import Divisor from "~/components/ui/divisor";
import Button from "~/components/ui/button";


const LogoMedium = assets.icons.logoMedium;
const Login = () => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            className={`flex-1 flex items-center justify-between bg-white px-2`}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                }} />
            <View >
                <LogoMedium />
            </View>
            <View className="flex-1 w-full flex justify-start px-4">
                <Text className="text-center text-gray-400 font-bold text-4xl my-5">Fazer Login</Text>
                <Form />
                <Divisor label="OU" />
                <Text className="text-center text-gray-400 font-bold text-md mb-5">Precisando de internet?</Text>
                <Button>Assine Já</Button>
            </View>

        </View>);
}

export default Login;