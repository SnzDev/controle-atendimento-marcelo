import React from "react";
import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { api, type RouterOutputs } from "~/utils/api";

function Index() {
  return (
    <SafeAreaView className="flex-1 items-center justify-around ">
      <View className="items-center justify-center ">
        <Image source={require("../../assets/icon.png")} />
        <Text className="text-4xl">AccesseNet Telecom</Text>
      </View>
      <View className="mb-2 w-full px-10">
        <View className="mb-6">
          <Text>Login</Text>
          <TextInput className="h-14 w-full rounded-md border-[2px] border-slate-500" />
        </View>
        <View>
          <Text>Senha</Text>
          <TextInput className="h-14 w-full rounded-md border-[2px] border-slate-500" />
        </View>
      </View>

      <View className="w-full  px-10 ">
        <TouchableOpacity className="h-14 w-full items-center justify-center rounded-md bg-blue-800">
          <Text className="text-center text-white">Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default Index;
