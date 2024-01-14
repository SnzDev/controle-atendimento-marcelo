import { useRouter } from "expo-router";
import { ArrowCircleLeft2 } from "iconsax-react-native";
import { Text, TouchableOpacity, View } from "react-native";

type HeaderProps = {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const canGoback = router.canGoBack();

  return (
    <View className="w-full flex-row justify-between p-2 items-center">
      <TouchableOpacity onPress={() => canGoback && router.back()} className="flex-row space-x-2 items-center">
        <ArrowCircleLeft2 size="30" color="#1552A7" variant="Bold" />
        <Text className="font-semibold text-lg text-[#1552A7]">Voltar</Text>
      </TouchableOpacity>
      <Text className="font-semibold text-lg text-[#1552A7]">{title}</Text>
    </View>
  );
}