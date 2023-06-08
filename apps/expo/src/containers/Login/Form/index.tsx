import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import StyledView from "~/components/StyledView";
import KeepConnected from "./KeepConnected";
import Password from "./Password";
import Submit from "./Submit";
import Username from "./Username";
import { schemaValidation, type FieldValues } from "./schema";
import Link from "~/components/Link";

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
            <StyledView className="flex h-64 justify-around">
                <Username />
                <Password />
                <StyledView className="flex flex-row justify-between">
                    <KeepConnected />
                    <Link href="http://www.google.com.br" >Esqueci minha senha</Link>
                </StyledView>
                <Submit />
            </StyledView>

        </FormProvider>
    )
}

export default Form;