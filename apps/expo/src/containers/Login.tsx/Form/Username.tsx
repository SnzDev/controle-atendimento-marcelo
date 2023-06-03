import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "~/components/Input";
import type { FieldValues } from "./schema";

const Username = () => {
    const hookform = useFormContext<FieldValues>();

    return (
        <Controller
            name="username"
            control={hookform.control}
            render={({ field }) => (
                <Input
                    {...field}
                    placeholder="Usuário"
                />
            )}
        />
    );

}

export default Username;