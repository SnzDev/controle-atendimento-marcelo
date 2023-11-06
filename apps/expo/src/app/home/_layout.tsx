import { Stack } from "expo-router";
import React from "react";

export default function TabsLayout() {

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#1e40af",
                },
                headerShown: false,
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        />

    );
};

