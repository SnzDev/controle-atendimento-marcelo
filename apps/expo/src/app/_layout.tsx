import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { RootSiblingParent } from 'react-native-root-siblings';

import { TRPCProvider } from "~/utils/api";
import { ContextProvider } from "~/hook/auth";

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  return (

    <TRPCProvider>
      <ContextProvider>
        <RootSiblingParent>
          <SafeAreaProvider>
            {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            // screenOptions={{
            //   headerStyle: {
            //     backgroundColor: "#1e40af",
            //   },
            //   headerTintColor: "#fff",
            //   headerTitleStyle: {
            //     fontWeight: "bold",
            //   },
            // }}
            />
            <StatusBar />
          </SafeAreaProvider>
        </RootSiblingParent>
      </ContextProvider>
    </TRPCProvider>
  );
};

export default RootLayout;
