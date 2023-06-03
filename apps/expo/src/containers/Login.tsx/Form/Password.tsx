import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "~/components/Input";
import StyledTouchableOpacity from "~/components/StyledTouchableOpacity";
import type { FieldValues } from "./schema";

const Password = () => {
    const hookform = useFormContext<FieldValues>();
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <Controller
            name="password"
            control={hookform.control}
            render={({ field }) => (
                <Input
                    {...field}
                    placeholder="Senha"
                    secureTextEntry={!showPassword}
                    adornment={
                        <StyledTouchableOpacity onPress={() => setShowPassword(old => !old)}>
                            <Ionicons style={{ color: '#6b7280' }} name={showPassword ? "md-eye-off" : "md-eye"} size={24} color="black" />
                        </StyledTouchableOpacity>
                    }
                />
            )}

        />
    );

}

export default Password;