import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import Constants from "expo-constants";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="w-full flex-1 items-center bg-white"
      >
        <View
          className="relative flex w-full max-w-xl flex-1 flex-col items-center justify-center"
          style={
            Platform.OS === "android" && {
              paddingTop: Constants.statusBarHeight,
            }
          }
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
