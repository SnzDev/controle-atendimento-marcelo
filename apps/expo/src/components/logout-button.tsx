import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { useContextHook } from "~/hook/auth";
import { api } from "~/utils/api";

export const LogoutButton = () => {
  const authContext = useContextHook();
  const router = useRouter();
  const apiCtx = api.useContext();

  return (<TouchableOpacity
    className="bg-white rounded-lg py-2 px-4 shadow-lg"
    onPress={async () => {
      await AsyncStorage.clear();
      authContext.handleSetSessionId('');
      authContext.handleSetSelectedConnection();
      router.replace('/login');
      await apiCtx.mk.invalidate();
    }}
  >
    <Text className="font-semibold">Sair</Text>
  </TouchableOpacity>)
}