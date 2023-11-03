import { Barcode, Clock } from "iconsax-react-native"
import { Text, TouchableOpacity, View } from "react-native"



export const PendingInvoices = () => {



  return (
    <View className="flex-row border-2 border-[#E1E4E8] py-5 px-3 mx-2 my-1 mt-0 justify-between items-center rounded-lg bg-[#FFFFFF] shadow-lg">

      <View className="flex-row items-center space-x-2">
        <View className="bg-[#1552A7] p-1 rounded-lg">
          <Barcode size="25" color="white" variant="Bold" />
        </View>
        <Text className="text-[#1552A7] font-bold text-md">Boleto</Text>
      </View>
      <View className="flex-row space-x-2">
        <Text className="text-gray-500 font-bold text-xs">R$ 99,90</Text>
        <Text className="text-gray-500 font-bold text-xs">ref: 10/2021</Text>
      </View>

      <TouchableOpacity>
        <Text className="text-[#1552A7] font-bold text-md">Ver Fatura</Text>
      </TouchableOpacity>
    </View>
  )
}