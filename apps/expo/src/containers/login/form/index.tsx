import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import KeepConnected from "./keep-connected";
import Password from "./password";
import Submit from "./submit";
import Username from "./username";
import { schemaValidation, type FieldValues } from "./schema";
import Link from "~/components/ui/link";
import { View } from "react-native";

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
                <View className="flex flex-row justify-between">
                    <KeepConnected />
                    <Link href="http://www.google.com.br" >Esqueci minha senha</Link>
                </View>
                <Submit />
            </View>

        </FormProvider>
    )
}

export default Form;