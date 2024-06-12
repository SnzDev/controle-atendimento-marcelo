import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { withMask } from "use-mask-input";

import Input from "~/components/ui/input";
import MaskInput from "~/components/ui/mask-input";
import type { FieldValues } from "./schema";
import { Masks } from 'react-native-mask-input';



const Username = () => {
  const hookform = useFormContext<FieldValues>();

  return (
    <Controller
      name="username"
      control={hookform.control}
      render={({ field: { onChange, ...field }, fieldState }) => (
        <MaskInput
          {...field}
          onChangeText={(text) => {
            onChange(text.toLowerCase());
          }}
          placeholder="Usuário"
          error={fieldState.error?.message}
          mask={Masks.BRL_CPF_CNPJ}
        />
      )}
    />
  );
};

export default Username;
