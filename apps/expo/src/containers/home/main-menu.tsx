import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Call, EmptyWallet, Location, Whatsapp } from "iconsax-react-native";

import { openWhatsApp } from "~/utils/deep-link-whatsapp";
import { useContextHook } from "~/hook/auth";
import { SelfUnblock } from "./self-unblock";

export const MainMenu = () => {
  const authContext = useContextHook();
  const { push } = useRouter();
  const selectedConnection = authContext.selectedConnection?.connection;
  const isConnectionBlocked = selectedConnection?.bloqueada === "Sim";

  return (
    <View className="gap-2 p-2">
      <View className="flex-row justify-center p-2">
        <TouchableOpacity
          onPress={() => push("/invoice")}
          className="mr-4 items-center"
        >
          <View className="items-center justify-center rounded-lg bg-[#1552A7] p-5 drop-shadow-lg">
            <EmptyWallet size="32" color="white" variant="Bold" />
          </View>
          <Text className="text-xs font-bold text-[#1552A7]">Faturas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => push("/select-plan")}
          className="mr-4 items-center"
        >
          <View className="items-center justify-center rounded-lg bg-[#1552A7] p-5 drop-shadow-lg">
            <Location size="32" color="white" variant="Bold" />
          </View>
          <Text className="text-xs font-bold text-[#1552A7]">Conexões</Text>
        </TouchableOpacity>
        {isConnectionBlocked && <SelfUnblock />}
        <TouchableOpacity
          onPress={() => openWhatsApp("Preciso de suporte!")}
          className="items-center"
        >
          <View className="items-center justify-center rounded-lg bg-[#1552A7] p-5 drop-shadow-lg">
            <Whatsapp size="32" color="#ffffff" variant="Bold" />
          </View>
          <Text className="text-xs font-bold text-[#1552A7]">Suporte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
