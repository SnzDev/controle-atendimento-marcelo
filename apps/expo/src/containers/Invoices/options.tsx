import { Barcode, Copy } from "iconsax-react-native";
import { Text, TouchableOpacity, View } from "react-native";


export const Options = () => {

  return (
    <View className="p-2">
      <View className="flex-row p-2 justify-center">
        <TouchableOpacity className="items-center mr-4">
          <View className="p-5 bg-[#1552A7] items-center justify-center rounded-lg drop-shadow-lg">
            <Barcode size="32" color="white" variant="Bold" />
          </View>
          <Text className="text-[#1552A7] font-bold text-xs">Boleto</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center mr-4">
          <View className="p-5 bg-[#1552A7] items-center justify-center rounded-lg drop-shadow-lg">
            <Copy size="32" color="white" variant="Bold" />
          </View>
          <Text className="text-[#1552A7] font-bold text-xs">Codigo de Barras</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
