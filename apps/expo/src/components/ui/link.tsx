import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Text, TouchableOpacity } from "react-native";



interface LinkProps {
    href: string;
    children: React.ReactNode;
    target?: "_blank" | "_self" | "_parent" | "_top";
    isExternal?: boolean;
}

const Link = (props: LinkProps) => {
    return (
        <TouchableOpacity onPress={
            () => props.isExternal
                ? Linking.openURL(props.href)
                : WebBrowser.openBrowserAsync(props.href)}>
            {
                typeof props.children === 'string' ? (
                    <Text className="text-blue-800 font-bold text-center">
                        {props.children}
                    </Text>
                )
                    : props.children
            }
        </TouchableOpacity >
    );
}

export default Link