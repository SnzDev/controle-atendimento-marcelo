import React from "react";
import { View, type TextInputProps, TextInput, Platform, Text, } from "react-native";
import type { StyledProps } from "nativewind";

// type InputProps = {
//   placeholder?: string;
//   onChange?: (text: string) => void;
//   value?: string;
//   secureTextEntry?: boolean;
//   keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
//   autoCapitalize?: "none" | "sentences" | "words" | "characters";
//   adornment?: React.ReactNode;

// } & Omit<StyledProps<TextInputProps>, 'ref'>;
// const Input = (props: InputProps, ref: React.Ref<TextInput>) => {
//   return (
//     <View>
//       <TextInput
//         {...props}
//         placeholder={props.placeholder}
//         onChange={(e) => props.onChange && props.onChange(e.nativeEvent.text)}
//         value={props.value}
//         secureTextEntry={props.secureTextEntry}
//         className="h-14 w-full rounded-md border border-gray-500 placeholder:p-2"
//         ref={ref}
//       />
//       {/* //put adornment here */}

//       {props.adornment && (
//         <View className="absolute inset-y-4 right-0 flex items-center pr-2">
//           {props.adornment}
//         </View>
//       )}


//     </View>
//   )
// }
// export default React.forwardRef(Input);



type InputProps = React.ComponentProps<typeof TextInput> & {
  label?: string;
  rightDecoration?: React.ReactNode;
  leftDecoration?: React.ReactNode;
  showPassword?: boolean;
  error?: string;
}

function Input({
  label,
  leftDecoration,
  rightDecoration,
  showPassword,
  error,
  onChange,
  ...props
}: InputProps, ref: React.Ref<TextInput>) {
  return (
    <View className="flex flex-col items-start justify-center w-full">
      {label && <Text className="flex py-2">{label}</Text>}

      <View
        className={`flex flex-row items-center px-5 h-14 w-full rounded-xl border border-slate-400 bg-white ${Platform.OS === "ios"
          ? "shadow-xl shadow-['#00000099']"
          : "shadow-lg shadow-dark "
          }
          `}
        style={{ elevation: 20 }}
      >
        {leftDecoration && <View className="h-full ml-[-20px]">
          {leftDecoration}
        </View>}
        <TextInput
          placeholderTextColor={"#575656"}
          cursorColor={"#EAA448"}
          className={`text-base w-full h-full flex items-center justify-center ${leftDecoration ? "pl-9" : ""} ${rightDecoration ? "pr-9" : ""}`}
          {...props}
          ref={ref}
        />

        {rightDecoration && <View className="ml-[-20px] h-full flex items-center justify-center">
          {rightDecoration}
        </View>}

      </View>

      {!!error && <Text className="text-red-800 py-2">{error}</Text>}
    </View>
  );
}
export default React.forwardRef(Input);
