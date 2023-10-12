import React from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type TRPCError } from "@trpc/server";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";

export default function Index() {
  const schemaValidation = z.object({
    user_sac: z.string().min(3).max(20),
    pass_sac: z.string().min(3).max(20),
  });
  type FieldValues = z.infer<typeof schemaValidation>;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schemaValidation),
  });
  const loginSac = api.mk.loginSac.useMutation();
  const onSubmit: SubmitHandler<FieldValues> = (data) =>
    loginSac
      .mutateAsync(data)
      .then((response) => AsyncStorage.setItem("_jid", response.id))
      .catch((error: TRPCError) =>
        Alert.alert("Erro", `Erro ao realizar login. ${error.message}`),
      );

  return (
    <SafeAreaView className="flex-1 items-center justify-around ">
      <View className="items-center justify-center ">
        <Image alt="logo" source={require("../../assets/icon.png")} />
        <Text className="text-4xl">AccesseNet Telecom</Text>
      </View>
      <View className="mb-2 w-full px-10">
        <View className="mb-6">
          <Text>Login</Text>
          <Controller
            control={control}
            name="user_sac"
            render={({ field: { onChange, ...field } }) => (
              <TextInput
                onChangeText={onChange}
                {...field}
                className="h-14 w-full rounded-md border-[2px] border-slate-500"
              />
            )}
          />
          {errors.user_sac && (
            <Text className="text-red-500">Campo obrigatório</Text>
          )}
        </View>
        <View>
          <Text>Senha</Text>
          <Controller
            control={control}
            name="pass_sac"
            render={({ field: { onChange, ...field } }) => (
              <TextInput
                onChangeText={onChange}
                {...field}
                className="h-14 w-full rounded-md border-[2px] border-slate-500"
              />
            )}
          />
          {errors.pass_sac && (
            <Text className="text-red-500">Campo obrigatório</Text>
          )}
        </View>
      </View>

      <View className="w-full  px-10 ">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="h-14 w-full items-center justify-center rounded-md bg-blue-800"
        >
          <Text className="text-center text-white">Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

