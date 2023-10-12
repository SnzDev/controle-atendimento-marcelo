import type { StyledProps } from "nativewind";
import { Text, View, type ViewProps } from "react-native";

type DivisorProps = StyledProps<ViewProps> & {
    label: string;
}
const Divisor = (props: DivisorProps) => {

    return (
        props.label ? (
            <View className={`flex flex-row items-center justify-center my-8 ${props.className}`}>
                <View className="border flex-1 border-slate-400 mx-2 rounded-lg" />
                <Text className="text-center text-slate-400">{props.label}</Text>
                <View className="border flex-1 border-slate-400 mx-2 rounded-lg" />
            </View>
        )
            : <View className={`border border-slate-400 rounded-lg my-8 ${props.className}`} />

    )
}


export default Divisor;
