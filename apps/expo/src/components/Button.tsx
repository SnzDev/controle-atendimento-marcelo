import { FaSpinner } from 'react-icons/fa';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: "contained" | "outlined";
  isLoading?: boolean;
  isDisabled?: boolean;
}

const Button = (props: ButtonProps) => {

  return (
    <button
      onClick={props.onClick}
      className={`py-7 w-full ${props.variant === "contained" ? "bg-blue-500 hover:bg-blue-700 text-white" : "bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white"} shadow-lg rounded-sm `}
      disabled={props.isLoading || props.isDisabled}
    >

      {props.isLoading && <FaSpinner className="animate-spin mr-2" />}

      {props.isLoading ? 'Carregando...' : props.children}

    </button>
  )
}

export default Button;