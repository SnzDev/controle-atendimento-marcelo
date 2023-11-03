import { WifiSquare } from "iconsax-react-native"
import { Pressable, Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
import { Section } from "~/components/section"


export const YourPlan = () => {


  return (
    <>
      <Section title="Seu Plano" />

      <View className="bg-white rounded-lg flex-row justify-between p-2 m-2 mt-0 items-center">
        <View className="flex-row space-x-2 items-center">
          <WifiSquare size="32" color="#1552a7" variant="Bold" />
          <Text className="text-gray-500 font-medium text-sm">
            Plano 500Mbps - R$ 99,90
          </Text>
        </View>

        <TouchableOpacity className="p-2">
          <Text className="text-[#1552A7] font-bold">Detalhes</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}