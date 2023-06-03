import ExpoCheckbox from "expo-checkbox/build/ExpoCheckbox";
import { styled } from 'nativewind';
import View from "./StyledView";

const StyledCheckBox = styled(ExpoCheckbox);

interface CheckBoxProps {
    isChecked: boolean;
    onChange?: (value: boolean) => void;
    label?: React.ReactNode;
}
const CheckBox = (props: CheckBoxProps) => {

    return (
        <View className="flex items-center">
            <StyledCheckBox
                className="form-checkbox h-5 w-5 text-blue-500"
                value={props.isChecked}
                onValueChange={props.onChange}
            />
            {/* <span className="ml-2 text-gray-700">Label text</span> */}
            {props.label && <View className="ml-2 text-gray-700">{props.label}</View>}
        </View>
    );
};

export default CheckBox;