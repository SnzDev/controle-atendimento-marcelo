


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
    <div>
      <input
        placeholder={props.placeholder}
        onChange={(e) => props.onChangeText(e.target.value)}
        value={props.value}
        type={props.secureTextEntry ? "password" : "text"}
        className="h-14 w-full rounded-md border-[2px] border-slate-500"
      />
      {/* //put adornment here */}

      {props.adornment && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {props.adornment}
        </div>
      )}



    </div>
  )
}

export default Input