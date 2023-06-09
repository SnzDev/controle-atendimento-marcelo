import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { RootSiblingParent } from 'react-native-root-siblings';

import { TRPCProvider } from "~/utils/api";
import { ContextProvider } from "~/hook/Auth";

// This is the main layout of the app
// It wraps your pages with the providers they need
const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#1e40af",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        />

    );
};

export default TabsLayout;
