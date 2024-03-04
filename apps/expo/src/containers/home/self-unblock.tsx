import { useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import { Unlock } from "iconsax-react-native";

import { api } from "~/utils/api";
import Button from "~/components/ui/button";
import { useContextHook } from "~/hook/auth";

export const SelfUnblock = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const auth = useContextHook();
  const selectedConnection = auth.selectedConnection?.connection;
  const selfUnblock = api.mk.selfUnblock.useMutation();
  const queryClient = api.useContext();

  if (!selectedConnection?.codconexao) return null;
  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="mr-4 items-center"
      >
        <View className="items-center justify-center rounded-lg bg-[#1552A7] p-5 drop-shadow-lg">
          <Unlock size="32" color="white" variant="Bold" />
        </View>
        <Text className="text-xs font-bold text-[#1552A7]">Desbloqueio</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/60 backdrop-blur">
          <View className="w-[90%] rounded bg-white p-5">
            <Text className="text-lg">Tem certeza?</Text>
            <Text className="text-md">
              Essa ação só pode ser feita uma vez por mês
            </Text>

            <View className="mt-2 flex h-fit w-[50%] flex-row space-x-2">
              <Button
                variant="contained"
                isLoading={selfUnblock.isLoading}
                onPress={() =>
                  selfUnblock.mutate(
                    {
                      selectedConnection:
                        selectedConnection.codconexao.toString(),
                      session: auth.session,
                    },
                    {
                      onSuccess: () =>
                        Alert.alert("Parabéns!", "Desbloqueado com sucesso", [
                          { text: "Ok", onPress: () => setModalVisible(false) },
                        ]),
                      onError: (error) =>
                        Alert.alert(
                          "Opss...",
                          error?.message ??
                            "Algo deu errado, tente novamente mais tarde",
                        ),
                      onSettled: async () => {
                        await queryClient.mk.getConnections.invalidate();
                        await queryClient.mk.getContracts.invalidate();
                      },
                    },
                  )
                }
              >
                Desbloquear
              </Button>
              <Button onPress={() => setModalVisible(false)} variant="outlined">
                Sair
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
