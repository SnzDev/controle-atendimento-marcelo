
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type TRPCError } from "@trpc/server";
import { useRouter } from "expo-router";
import { useFormContext, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form";
import { Alert } from "react-native";
import Button from "~/components/ui/button";
import { useContextHook } from "~/hook/auth";
import { api } from "~/utils/api";
import type { FieldValues } from "./schema";

const Submit = () => {
    const hookForm = useFormContext<FieldValues>();
    const loginMk = api.mk.loginSac.useMutation();
    const authContext = useContextHook();
    const navigation = useRouter(); // Get the navigation object

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        loginMk.mutateAsync({ pass_sac: data.password, user_sac: data.username })
            .then(async (response) => {
                await AsyncStorage.setItem("_jid", response.id);
                await AsyncStorage.setItem("@keepConnected", data.keepConnected.toString());
                authContext.handleSetSessionId(response.id);
                navigation.replace('select-plan')
            })
            .catch((error: TRPCError) =>
                Alert.alert("Erro", `Erro ao realizar login. ${error.message}`),
            );
    };
    const onError: SubmitErrorHandler<FieldValues> = (data) => console.log(data);
    return (
        <Button isLoading={loginMk.isLoading} onPress={hookForm.handleSubmit(onSubmit, onError)} variant="contained">
            Entrar
        </Button>
    );
}

export default Submit;