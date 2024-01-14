import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import { Barcode, Copy } from "iconsax-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useContextHook } from "~/hook/auth";
import { useToast } from "~/hook/useToast";
import { api } from "~/utils/api";


type OptionsProps = {
  barNumber?: string;
  invoiceId: number;
}
export const Options = ({ barNumber, invoiceId }: OptionsProps) => {
  const authContext = useContextHook();
  const { showToast } = useToast();
  const copyToClipboard = async () => {
    if (barNumber) await Clipboard.setStringAsync(barNumber).then(() => {
      showToast("Código de barras copiado")
    });
  };
  const invoicePdf = api.mk.getInvoicePdf.useQuery({ session: authContext.session, cd_fatura: invoiceId }, {
    enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => WebBrowser.openBrowserAsync(data.PathDownload),
  });
  return (
    <View className="p-2">
      <View className="flex-row p-2 justify-center">
        <TouchableOpacity onPress={() => invoicePdf.refetch()} className="items-center mr-4">
          <View className="p-5 bg-[#1552A7] items-center justify-center rounded-lg drop-shadow-lg">
            <Barcode size="32" color="white" variant="Bold" />
          </View>
          <Text className="text-[#1552A7] font-bold text-xs">Boleto</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => copyToClipboard()} className="items-center mr-4">
          <View className="p-5 bg-[#1552A7] items-center justify-center rounded-lg drop-shadow-lg">
            <Copy size="32" color="white" variant="Bold" />
          </View>
          <Text className="text-[#1552A7] font-bold text-xs">Codigo de Barras</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
