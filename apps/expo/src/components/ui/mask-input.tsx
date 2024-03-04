import React from "react";
import { Platform, Text, TextInput, View } from "react-native";
import MaskInput, { type MaskInputProps } from "react-native-mask-input";

type InputProps = React.ComponentProps<typeof MaskInput> & {
  label?: string;
  rightDecoration?: React.ReactNode;
  leftDecoration?: React.ReactNode;
  showPassword?: boolean;
  error?: string;
};

function Input(
  {
    label,
    leftDecoration,
    rightDecoration,
    showPassword,
    error,
    onChange,
    ...props
  }: InputProps,
  ref: React.Ref<TextInput>,
) {
  return (
    <View className="flex w-full flex-col items-start justify-center">
      {label && <Text className="flex py-2">{label}</Text>}

      <View
        className={`flex h-14 w-full flex-row items-center rounded-xl border border-slate-400 bg-white px-5 ${
          Platform.OS === "ios"
            ? "shadow-xl shadow-['#00000099']"
            : "shadow-dark shadow-lg "
        }
          `}
        style={{ elevation: 20 }}
      >
        {leftDecoration && (
          <View className="ml-[-20px] h-full">{leftDecoration}</View>
        )}

        <MaskInput
          placeholderTextColor={"#575656"}
          cursorColor={"#EAA448"}
          className={`flex h-full w-full items-center justify-center text-base ${leftDecoration ? "pl-9" : ""} ${rightDecoration ? "pr-9" : ""}`}
          {...props}
          style={Platform.OS == "ios" ? { lineHeight: 20 } : {}}
          ref={ref}
        />

        {rightDecoration && (
          <View className="ml-[-20px] flex h-full items-center justify-center">
            {rightDecoration}
          </View>
        )}
      </View>

      {!!error && <Text className="py-2 text-red-800">{error}</Text>}
    </View>
  );
}
export default React.forwardRef(Input);
