import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "~/components/ui/input";
import type { FieldValues } from "./schema";
import { TouchableOpacity } from "react-native";

const Password = () => {
    const hookform = useFormContext<FieldValues>();
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <Controller
            name="password"
            control={hookform.control}
            render={({ field: { onChange, ...field }, fieldState }) => (
                <Input
                    {...field}
                    onChangeText={text => {
                        onChange(text.toLowerCase().replace(/\D/g, ''));
                    }}
                    placeholder="Senha"
                    secureTextEntry={!showPassword}
                    rightDecoration={
                        <TouchableOpacity onPress={() => setShowPassword(old => !old)}>
                            <Ionicons style={{ color: '#6b7280' }} name={showPassword ? "md-eye-off" : "md-eye"} size={22} color="black" />
                        </TouchableOpacity>
                    }
                    error={fieldState.error?.message}
                />
            )}

        />
    );

}

export default Password;