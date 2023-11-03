import { Text, View } from "react-native";


type SectionProps = {
  title: string;
}
export const Section = ({ title }: SectionProps) => {

  return (
    <View className="flex-col items-start space-y-1 p-2">
      <Text className="text-[#1552A7] font-bold">{title}</Text>
      <View className="border border-[#1552A7] w-full" />
    </View>
  );
}