import Button from "~/components/Button"
import type { FieldValues } from "./schema";
import { type SubmitErrorHandler, type SubmitHandler, useFormContext } from "react-hook-form";
import { api } from "~/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type TRPCError } from "@trpc/server";
import { Alert } from "react-native";
import { useContextHook } from "~/hook/Auth";
import { useRouter } from "expo-router";

const Submit = () => {
    const hookForm = useFormContext<FieldValues>();
    const loginMk = api.mk.loginSac.useMutation();
    const authContext = useContextHook();
    const router = useRouter();

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        loginMk.mutateAsync({ pass_sac: data.password, user_sac: data.username })
            .then(async (response) => {
                await AsyncStorage.setItem("_jid", response.id);
                await AsyncStorage.setItem("@keepConnected", data.keepConnected.toString());
                authContext.handleSetSessionId(response.id);
                router.push("/Home");
            })
            .catch((error: TRPCError) =>
                Alert.alert("Erro", `Erro ao realizar login. ${error.message}`),
            );
    };
    const onError: SubmitErrorHandler<FieldValues> = (data) => console.log(data);
    return (
        <Button onPress={hookForm.handleSubmit(onSubmit, onError)} variant="contained">
            Entrar
        </Button>
    );
}

export default Submit;