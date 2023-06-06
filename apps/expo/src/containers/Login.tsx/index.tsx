import { Ionicons } from "@expo/vector-icons";
import assets from "../../../assets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Input from "~/components/Input";
import StyledText from "~/components/StyledText";
import StyledView from "~/components/StyledView"
import Form from "./Form";
import Divisor from "~/components/Divisor";
import Button from "~/components/Button";


const LogoMedium = assets.icons.logoMedium;
const Login = () => {
    const insets = useSafeAreaInsets();

    return (
        <StyledView
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            className={`flex-1 flex items-center justify-between bg-white px-2`}
        >
            <StyledView >
                <LogoMedium />
            </StyledView>
            <StyledView className="flex-1 w-full flex justify-start px-4">
                <StyledText className="text-center text-gray-400 font-bold text-4xl my-5">Fazer Login</StyledText>
                <Form />
                <Divisor label="OU" />
                <StyledText className="text-center text-gray-400 font-bold text-md mb-5">Precisando de internet?</StyledText>
                <Button>Assine Já</Button>
            </StyledView>

            <StyledView>
                <StyledText className="font-bold text-sm text-gray-400">V 1.0.0</StyledText>
            </StyledView>
        </StyledView>);
}

export default Login;