import { type StyledProps } from 'nativewind';
import StyledText from './StyledText';
import StyledTouchableOpacity from './StyledTouchableOpacity';
import type { TouchableOpacityProps } from 'react-native';


type ButtonProps = {
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: "contained" | "outlined";
  isLoading?: boolean;
  isDisabled?: boolean;
} & Pick<StyledProps<TouchableOpacityProps>, 'className'>;

const Button = (props: ButtonProps) => {

  return (
    <StyledTouchableOpacity
      onPress={props.onPress}
      className={`py-5 w-full ${props.variant === "contained" ? "bg-blue-800 shadow-lg" : "bg-transparent border border-blue-800 hover:bg-blue-800 "}  rounded-xl`}
      disabled={props.isLoading || props.isDisabled}
    >

      {props.isLoading && <StyledText>Carregando...</StyledText>}

      {!props.isLoading && <StyledText className={`text-center font-bold ${props.variant === "contained" ? "text-white" : "text-blue-800 hover:text-white"}`}>{props.children}</StyledText>}

    </StyledTouchableOpacity >
  )
}

export default Button;