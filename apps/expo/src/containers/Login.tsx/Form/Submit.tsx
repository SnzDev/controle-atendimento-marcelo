import Button from "~/components/Button"
import type { FieldValues } from "./schema";
import { type SubmitErrorHandler, type SubmitHandler, useFormContext } from "react-hook-form";

const Submit = () => {
    const hookForm = useFormContext<FieldValues>();

    const onSubmit: SubmitHandler<FieldValues> = (data) => console.log(data);
    const onError: SubmitErrorHandler<FieldValues> = (data) => console.log(data);
    return (
        <Button onPress={hookForm.handleSubmit(onSubmit, onError)} variant="contained">
            Entrar
        </Button>
    );
}

export default Submit;