import { type StyledProps } from 'nativewind';
import { ActivityIndicator, Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';


type ButtonProps = {
  variant?: "contained" | "outlined";
  isLoading?: boolean;
} & TouchableOpacityProps;

const Button = (props: ButtonProps) => {

  return (
    <TouchableOpacity
      onPress={props.onPress}
      className={`py-4 w-full ${props.variant === "contained" ? "bg-blue-800 shadow-lg" : "bg-transparent border border-blue-800 hover:bg-blue-800 "}  rounded-xl`}
      disabled={props.isLoading || props.disabled}
    >

      {props.isLoading && <ActivityIndicator />}

      {!props.isLoading && <Text className={`text-center font-bold ${props.variant === "contained" ? "text-white" : "text-blue-800 hover:text-white"}`}>{props.children}</Text>}

    </TouchableOpacity >
  )
}

export default Button;