import { TouchableOpacity } from "react-native";
import StyledText from "./StyledText";
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

import StyledTouchableOpacity from "./StyledTouchableOpacity";


interface LinkProps {
    href: string;
    children: React.ReactNode;
    target?: "_blank" | "_self" | "_parent" | "_top";
    isExternal?: boolean;
}

const Link = (props: LinkProps) => {
    return (
        <StyledTouchableOpacity onPress={
            () => props.isExternal
                ? Linking.openURL(props.href)
                : WebBrowser.openBrowserAsync(props.href)}>
            {
                typeof props.children === 'string' ? (
                    <StyledText className="text-blue-500 hover:text-blue-700 text-center">
                        {props.children}
                    </StyledText>
                )
                    : props.children
            }
        </StyledTouchableOpacity >
    );
}

export default Link