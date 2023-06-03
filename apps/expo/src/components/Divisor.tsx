import type { StyledProps } from "nativewind";
import StyledText from "./StyledText";
import StyledView from "./StyledView";
import type { ViewProps } from "react-native";

type DivisorProps = StyledProps<ViewProps> & {
    label: string;
}
const Divisor = (props: DivisorProps) => {

    return (
        props.label ? (
            <StyledView className={`flex flex-row items-center justify-center my-8 ${props.className}`}>
                <StyledView className="border flex-1 border-slate-400 mx-2 rounded-lg" />
                <StyledText className="text-center text-slate-400">{props.label}</StyledText>
                <StyledView className="border flex-1 border-slate-400 mx-2 rounded-lg" />
            </StyledView>
        )
            : <StyledView className={`border border-slate-400 rounded-lg my-8 ${props.className}`} />

    )
}


export default Divisor;
