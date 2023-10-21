import LogoMini from "assets/icons/logo-mini";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import Button from "~/components/ui/button";
import { Page } from "~/components/ui/page";
import { Call, EmptyWallet, Location } from 'iconsax-react-native';



export default function Home() {


  return (
    <Page className="flex-1">
      <StatusBar backgroundColor="#1552A7" />
      <View className="bg-[#1552A7] p-4">
        <View className="flex-row items-center gap-4">
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=399&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
            width={70}
            height={70}
            className="rounded-full"
            alt="Picture of the author"
          />
          <View>
            <Text className="text-md text-white">Bom dia</Text>
            <Text className="text-lg font-bold text-white">Thálisson Moreira</Text>
          </View>
        </View>
      </View>

      <View className="p-2 gap-2">
        <View className="flex-col items-start ">
          <Text className="text-[#1552A7] font-bold">Última fatura - Fevereiro 2023</Text>
          <View className="border border-[#1552A7] w-full" />
        </View>

        <View className="flex-row border-2 border-[#E1E4E8] p-3 justify-between items-center bg-[#FFFFFF] shadow-lg">

          <View>
            <View><Text className="text-[#5B5B5B] font-bold text-3xl">R$ 99,90</Text></View>
            <View><Text className="text-[#5B5B5B] font-lg">Aguardando Pagamento</Text></View>
            <View><Text className="text-[#5B5B5B] text-xs font-bold">Vence dia 8 de fevereiro</Text></View>
          </View>

          <Pressable className="px-2 h-10 bg-[#1552A7] items-center justify-center rounded-md drop-shadow-lg">
            <Text className="text-white">Ver Fatura</Text>
          </Pressable>
        </View>

        <View className="flex-row p-2 justify-center">
          <View className="items-center mr-4">
            <Pressable className="p-5 bg-[#1552A7] items-center justify-center rounded-lg drop-shadow-lg">
              <Text className="text-white"><EmptyWallet size="32" color="white" variant="Bold" /></Text>
            </Pressable>
            <Text className="text-[#1552A7] font-bold">Faturas</Text>
          </View>
          <View className="items-center mr-4">
            <Pressable className="p-5 bg-[#1552A7] items-center justify-center rounded-lg drop-shadow-lg">
              <Text className="text-white"><Location size="32" color="white" variant="Bold" /></Text>
            </Pressable>
            <Text className="text-[#1552A7] font-bold">Conexões</Text>
          </View>
          <View className="items-center s">
            <Pressable className="p-5 bg-[#1552A7] items-center justify-center rounded-lg drop-shadow-lg">
              <Text className="text-white">
                <Call size="32" color="#ffffff" variant="Bold" />

              </Text>
            </Pressable>
            <Text className="text-[#1552A7] font-bold">Suporte</Text>
          </View>


        </View>

      </View>
      <View className="p-2 gap-2">
        <View className="flex-col items-start ">
          <Text className="text-[#1552A7] font-bold">Seu Plano</Text>
          <View className="border border-[#1552A7] w-full" />
        </View>
      </View>

    </Page>);
}