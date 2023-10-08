import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
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

