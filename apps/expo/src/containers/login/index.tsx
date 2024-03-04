import { Text, View } from "react-native";
import { Stack } from "expo-router";

import { openWhatsApp } from "~/utils/deep-link-whatsapp";
import BaseLayout from "~/components/layout/base";
import Button from "~/components/ui/button";
import Divisor from "~/components/ui/divisor";
import assets from "../../../assets";
import Form from "./form";

const LogoMedium = assets.icons.logoMedium;
const Login = () => {
  return (
    <BaseLayout>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View>
        <LogoMedium />
      </View>
      <View className="flex w-full flex-1 justify-start px-4">
        <Text className="my-5 text-center text-4xl font-bold text-gray-400">
          Fazer Login
        </Text>
        <Form />
        <Divisor label="OU" />
        <Text className="text-md mb-5 text-center font-bold text-gray-400">
          Precisando de internet?
        </Text>
        <Button onPress={() => openWhatsApp("Quero assinar")}>Assine Já</Button>
      </View>
    </BaseLayout>
  );
};
export default Login;
