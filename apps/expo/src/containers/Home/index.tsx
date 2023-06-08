
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoMini from "../../../assets/icons/LogoMini";
import React from "react";
import StyledText from "~/components/StyledText";
import StyledView from "~/components/StyledView";
import { useContextHook } from "~/hook/Auth";
import ActualInvoice from "./ActualInvoice";

const Home = () => {
    const authContext = useContextHook();
    const user = authContext.clientInfo.data;


    return (
        <StyledView>
            <StyledView className="flex gap-5">
                <LogoMini />
                <StyledView>
                    <StyledText>Olá {user?.nome}</StyledText>
                    <StyledText>Como podemos ajudar?</StyledText>
                </StyledView>
            </StyledView>

            <ActualInvoice></ActualInvoice>
        </StyledView>
    );
}

export default Home;