import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import CheckBox from "~/components/CheckBox";
import type { FieldValues } from "./schema";

const KeepConnected = () => {
    const hookform = useFormContext<FieldValues>();

    return (
        <Controller
            name="keepConnected"
            control={hookform.control}
            render={({ field }) => (
                <CheckBox
                    {...field}
                    label="Manter conectado"
                />
            )}

        />
    );

}

export default KeepConnected;