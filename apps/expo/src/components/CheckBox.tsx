import React from "react";
import StyledView from "./StyledView";
import ExpoCheckbox from "expo-checkbox";
import StyledText from "./StyledText";


interface CheckBoxProps {
    value: boolean;
    onChange?: (value: boolean) => void;
    label?: React.ReactNode;
}
const CheckBox = (props: CheckBoxProps, ref?: React.LegacyRef<ExpoCheckbox>) => {

    return (
        <StyledView onTouchEnd={() => props.onChange && props.onChange(!props.value)} className="flex items-center flex-row pl-1">
            <ExpoCheckbox
                value={props.value}
                ref={ref}
                style={{ borderColor: 'gray', borderRadius: 5, borderWidth: 1 }}
            />
            {/* <span className="ml-2 text-gray-700">Label text</span> */}
            {props.label && typeof props.label === 'string' ?
                <StyledView className="ml-2"><StyledText className="text-gray-500">{props.label}</StyledText></StyledView>
                : <StyledView className="ml-2">{props.label}</StyledView>}
        </StyledView>
    );
};

export default React.forwardRef(CheckBox);