import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues } from "./schema";
import Input from "~/components/ui/input";

const Username = () => {
    const hookform = useFormContext<FieldValues>();

    return (
        <Controller
            name="username"
            control={hookform.control}
            render={({ field: { onChange, ...field }, fieldState }) => (
                <Input
                    {...field}
                    onChangeText={text => {
                        onChange(text.toLowerCase());
                    }}
                    placeholder="Usuário"
                    error={fieldState.error?.message}

                />
            )}
        />
    );

}

export default Username;