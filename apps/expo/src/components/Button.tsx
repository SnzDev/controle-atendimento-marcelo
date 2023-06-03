import { FaSpinner } from 'react-icons/fa';
import StyledText from './StyledText';
import StyledTouchableOpacity from './StyledTouchableOpacity';


interface ButtonProps {
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: "contained" | "outlined";
  isLoading?: boolean;
  isDisabled?: boolean;
}

const Button = (props: ButtonProps) => {

  return (
    <StyledTouchableOpacity
      onPress={props.onPress}
      className={`py-5 w-full ${props.variant === "contained" ? "bg-blue-800 shadow-lg" : "bg-transparent border border-blue-800 hover:bg-blue-800 "}  rounded-xl `}
      disabled={props.isLoading || props.isDisabled}
    >

      {props.isLoading && <FaSpinner className="animate-spin mr-2" />}

      {props.isLoading && <StyledText>Carregando...</StyledText>}

      {!props.isLoading && <StyledText className={`text-center font-bold ${props.variant === "contained" ? "text-white" : "text-blue-800 hover:text-white"}`}>{props.children}</StyledText>}

    </StyledTouchableOpacity>
  )
}

export default Button;