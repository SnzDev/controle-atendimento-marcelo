import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { withMask } from "use-mask-input";

import Input from "~/components/ui/input";
import MaskInput from "~/components/ui/mask-input";
import type { FieldValues } from "./schema";

const CPF_MASK = [
  "",
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];

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
          mask={CPF_MASK}
        />
      )}
    />
  );
};

export default Username;
