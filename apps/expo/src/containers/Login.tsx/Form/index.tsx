import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { type FieldValues, schemaValidation } from "./schema";
import Password from "./Password";
import Username from "./Username";
import Submit from "./Submit";

const Form = () => {
    const hookform = useForm<FieldValues>({
        resolver: zodResolver(schemaValidation),
    });

    return (
        <FormProvider {...hookform}>
            <Username />
            <Password />
            <Submit />
        </FormProvider>
    )
}

export default Form;