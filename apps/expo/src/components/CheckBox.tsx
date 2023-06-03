import { type ChangeEventHandler } from "react";

interface CheckBoxProps {
    isChecked: boolean;
    handleCheck?: ChangeEventHandler<HTMLInputElement>;
    label?: React.ReactNode;

}
const CheckBox = (props: CheckBoxProps) => {

    return (
        <label className="flex items-center">
            <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-500"
                checked={props.isChecked}
                onChange={props.handleCheck}
            />
            {/* <span className="ml-2 text-gray-700">Label text</span> */}
            {props.label && <span className="ml-2 text-gray-700">{props.label}</span>}
        </label>
    );
};

export default CheckBox;