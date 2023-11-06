import { useRouter } from "expo-router";
import { Call, EmptyWallet, Location, Whatsapp } from "iconsax-react-native"
import { TouchableOpacity, Text, View } from "react-native"
import { openWhatsApp } from "~/utils/deep-link-whatsapp";


export const MainMenu = () => {

  const { push } = useRouter();

  return (
    <View className="p-2 gap-2">
      <View className="flex-row p-2 justify-center">
        <TouchableOpacity onPress={() => push('/invoice')} className="items-center mr-4">
          <View className="p-5 bg-[#1552A7] items-center justify-center rounded-lg drop-shadow-lg">
            <EmptyWallet size="32" color="white" variant="Bold" />
          </View>
          <Text className="text-[#1552A7] font-bold text-xs">Faturas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => push('/select-plan')} className="items-center mr-4">
          <View className="p-5 bg-[#1552A7] items-center justify-center rounded-lg drop-shadow-lg">
            <Location size="32" color="white" variant="Bold" />
          </View>
          <Text className="text-[#1552A7] font-bold text-xs">Conexões</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openWhatsApp('Preciso de suporte!')} className="items-center">
          <View className="p-5 bg-[#1552A7] items-center justify-center rounded-lg drop-shadow-lg">
            <Whatsapp size="32" color="#ffffff" variant="Bold" />
          </View>
          <Text className="text-[#1552A7] font-bold text-xs">Suporte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
