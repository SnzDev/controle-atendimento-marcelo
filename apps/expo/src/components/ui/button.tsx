import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";

type ButtonProps = {
  variant?: "contained" | "outlined";
  isLoading?: boolean;
} & TouchableOpacityProps;

const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      className={`w-full py-4 ${props.variant === "contained" ? "bg-blue-800 shadow-lg" : "border border-blue-800 bg-transparent hover:bg-blue-800 "}  rounded-xl`}
      disabled={props.isLoading || props.disabled}
      {...props}
    >
      {props.isLoading && <ActivityIndicator />}

      {!props.isLoading && (
        <Text
          className={`text-center font-bold ${props.variant === "contained" ? "text-white" : "text-blue-800 hover:text-white"}`}
        >
          {props.children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
