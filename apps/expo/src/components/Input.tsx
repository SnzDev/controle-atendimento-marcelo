import React from "react";
import StyledTextInput from "./StyledTextInput";
import StyledView from "./StyledView";
import type { TextInputProps } from "react-native";
import type { StyledProps } from "nativewind";

type InputProps = {
  placeholder?: string;
  onChange?: (text: string) => void;
  value?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  adornment?: React.ReactNode;

} & Omit<StyledProps<TextInputProps>, 'ref'>;
const Input = (props: InputProps, ref: React.Ref<TextInputProps>) => {
  return (
    <StyledView>
      <StyledTextInput
        {...props}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange && props.onChange(e.nativeEvent.text)}
        value={props.value}
        secureTextEntry={props.secureTextEntry}
        className="h-14 w-full rounded-md border border-gray-500 placeholder:p-2"
        ref={ref}
      />
      {/* //put adornment here */}

      {props.adornment && (
        <StyledView className="absolute inset-y-4 right-0 flex items-center pr-2">
          {props.adornment}
        </StyledView>
      )}
    </StyledView>
  )
}
export default React.forwardRef(Input);