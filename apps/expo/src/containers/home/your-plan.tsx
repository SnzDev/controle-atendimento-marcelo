import { useRouter } from "expo-router"
import { WifiSquare } from "iconsax-react-native"
import { Text, TouchableOpacity, View } from "react-native"
import { Section } from "~/components/section"
import { useContextHook } from "~/hook/auth"


export const YourPlan = () => {

  const authContext = useContextHook();

  const myPlan = authContext.selectedConnection?.contract?.plano_acesso;
  const truncatedText = myPlan?.substring(0, 20) + (myPlan && myPlan.length > 20 ? '...' : '');
  const { push } = useRouter();
  return (
    <>
      <Section title="Seu Plano" />

      <View className="bg-white rounded-lg flex-row justify-between p-2 m-2 mt-0 items-center">
        <View className="flex-row space-x-2 items-center">
          <WifiSquare size="32" color="#1552a7" variant="Bold" />
          <Text className="text-gray-500 font-medium text-sm text-ellipsis  whitespace-nowrap">
            {truncatedText}
          </Text>
        </View>

        <TouchableOpacity onPress={() => push('/select-plan')} className="p-2">
          <Text className="text-[#1552A7] font-bold">Detalhes</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}