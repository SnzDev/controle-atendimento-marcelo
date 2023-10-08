import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues } from "./schema";
import Checkbox from "~/components/ui/checkbox";

const KeepConnected = () => {
    const hookform = useFormContext<FieldValues>();

    return (
        <Controller
            name="keepConnected"
            control={hookform.control}
            render={({ field }) => (
                <Checkbox
                    {...field}
                    label="Manter conectado"
                />
            )}

        />
    );

}

export default KeepConnected;