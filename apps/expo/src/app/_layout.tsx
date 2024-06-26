import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ContextProvider } from "~/hook/auth";
import { TRPCProvider } from "~/utils/api";
import 'moment/locale/pt-br';
import moment from "moment";
moment.locale('pt-br');

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  return (

    <TRPCProvider>
      <ContextProvider>
        <RootSiblingParent >
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
