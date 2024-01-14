import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { openWhatsApp } from "~/utils/deep-link-whatsapp";
import Password from "./password";
import { schemaValidation, type FieldValues } from "./schema";
import Submit from "./submit";
import Username from "./username";

const Form = () => {
    const hookform = useForm<FieldValues>({
        resolver: zodResolver(schemaValidation),
        defaultValues: {
            username: "",
            password: "",
            keepConnected: false
        }
    });

    return (
        <FormProvider {...hookform}>
            <View className="flex h-64 justify-around">
                <Username />
                <Password />
                <View className="flex flex-row justify-end">
                    <TouchableOpacity onPress={() => openWhatsApp("Esqueci minha senha SAC!")}>
                        <Text className="text-blue-500">
                            Esqueci minha senha
                        </Text></TouchableOpacity>
                </View>
                <Submit />
            </View>

        </FormProvider>
    )
}

export default Form;