import React from "react";
import ExpoCheckbox from "expo-checkbox";
import { Text, View } from "react-native";


interface CheckBoxProps {
    value: boolean;
    onChange?: (value: boolean) => void;
    label?: React.ReactNode;
}
const CheckBox = (props: CheckBoxProps, ref?: React.LegacyRef<ExpoCheckbox>) => {

    return (
        <View onTouchEnd={() => props.onChange && props.onChange(!props.value)} className="flex items-center flex-row pl-1">
            <ExpoCheckbox
                value={props.value}
                ref={ref}
                style={{ borderColor: 'gray', borderRadius: 5, borderWidth: 1 }}
            />
            {/* <span className="ml-2 text-gray-700">Label text</span> */}
            {props.label && typeof props.label === 'string' ?
                <View className="ml-2"><Text className="text-gray-500">{props.label}</Text></View>
                : <View className="ml-2">{props.label}</View>}
        </View>
    );
};

export default React.forwardRef(CheckBox);