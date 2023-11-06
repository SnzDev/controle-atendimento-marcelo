import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { LogoutButton } from "~/components/logout-button";
import { useContextHook } from "~/hook/auth";


export default function SelectPlan() {
  const router = useRouter();
  const authContext = useContextHook();
  console.log(authContext);

  return (
    <View className="flex flex-1 justify-center items-center p-5 gap-4">
      <Stack.Screen options={{
        headerShown: true,
        title: "Selecione a Conexão",
        headerRight: LogoutButton,
        headerStyle: {
          backgroundColor: "#1e40af",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
      />
      {authContext.connections.data?.Conexoes.map((connection) => {
        const contract = authContext.contracts.data?.ContratosAtivos.find((contract) => contract.codcontrato === connection.contrato);
        return (
          <TouchableOpacity
            onPress={async () => {
              authContext.handleSetSelectedConnection({
                connection: connection,
                contract: contract,
              });
              await AsyncStorage.setItem("@selectedConnection", JSON.stringify({
                connection: connection,
                contract: contract,
              }));
              router.replace('/home');
            }}
            className="border w-full rounded-lg bg-white p-2 shadow-lg" key={connection.codconexao}>

            <Text className="font-semibold text-lg">{contract?.plano_acesso}</Text>
            <Text >{connection.endereco}</Text>
          </TouchableOpacity>

        )
      })}
    </View>
  )
}