import StyledTextInput from "./StyledTextInput";
import StyledView from "./StyledView";

interface InputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  adornment?: React.ReactNode;
}
const Input = (props: InputProps) => {
  return (
    <StyledView>
      <StyledTextInput
        placeholder={props.placeholder}
        onChange={(e) => props.onChangeText(e.nativeEvent.text)}
        value={props.value}
        secureTextEntry={props.secureTextEntry}
        className="h-14 w-full rounded-md border-[2px] border-slate-500"
      />
      {/* //put adornment here */}

      {props.adornment && (
        <StyledView className="absolute inset-y-0 right-0 flex items-center pr-2">
          {props.adornment}
        </StyledView>
      )}
    </StyledView>
  )
}

export default Input