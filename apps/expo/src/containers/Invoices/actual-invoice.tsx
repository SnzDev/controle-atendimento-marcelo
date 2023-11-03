

import { Clock } from "iconsax-react-native"
import { Pressable, Text, View } from "react-native"
import { Section } from "../../components/section"

export const ActualInvoice = () => {

  const barNumber = '34191.79001 01043.510047 91020.150008 1 89980000000000';
  return (
    <>
      <View className="flex-col border-2 border-[#E1E4E8] py-5 px-3 m-2 mt-0 space-y-2 rounded-lg bg-[#FFFFFF] shadow-lg">
        <Text className="text-[#5B5B5B] font-bold text-lg">Ultima fatura - Fevereiro 2023</Text>
        <View className="flex-row justify-between  items-center">
          <View className="space-y-2">
            <Text className="text-[#5B5B5B] font-bold text-3xl">R$ 99,90</Text>
            <Text className="text-gray-500 text-xs font-bold">Vence dia 8 de fevereiro</Text>
            <View className="flex-row gap-1 bg-yellow-100 p-2 bg-opacity-50 rounded-lg items-center">
              <Clock size="20" className="text-yellow-500 font-medium" variant="Bold" />
              <Text className="text-yellow-500 font-lg text-xs font-medium">Aguardando Pagamento</Text>
            </View>
          </View>

          <Pressable className="px-2 h-10 bg-[#1552A7] items-center justify-center rounded-md drop-shadow-lg">
            <Text className="text-white text-md font-bold">Ver Fatura</Text>
          </Pressable>
        </View>
        <Text className="text-[10px] text-[#5B5B5B]">
          {barNumber?.replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})/, '$1.$2 $3.$4 $5.$6 $7 $8')}
        </Text>
      </View >
    </>
  )
}