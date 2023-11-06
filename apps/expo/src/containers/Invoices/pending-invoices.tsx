import { useRouter } from "expo-router";
import { Barcode, Clock } from "iconsax-react-native"
import moment from "moment";
import { Text, TouchableOpacity, View } from "react-native"


type PendingInvoicesProps = {
  invoice?: {
    codfatura: number;
    contas: string;
    contratos: string;
    data_vencimento: string;
    descricao: string;
    valor_total: number;
  }
}
export const PendingInvoices = ({ invoice }: PendingInvoicesProps) => {
  const validDate = moment(invoice?.data_vencimento, 'DD/MM/YYYY');
  const formattedDate = validDate.format('MM/YYYY');
  const price = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice?.valor_total ?? 0);
  const { push } = useRouter();
  return (
    <View className="flex-row border-2 border-[#E1E4E8] py-5 px-3 mx-2 my-1 mt-0 justify-between items-center rounded-lg bg-[#FFFFFF] shadow-lg">

      <View className="flex-row items-center space-x-2">
        <View className="bg-[#1552A7] p-1 rounded-lg">
          <Barcode size="25" color="white" variant="Bold" />
        </View>
        <Text className="text-[#1552A7] font-bold text-md">Boleto</Text>
      </View>
      <View className="flex-row space-x-2">
        <Text className="text-gray-500 font-bold text-xs">{price}</Text>
        <Text className="text-gray-500 font-bold text-xs">ref: {formattedDate}</Text>
      </View>

      <TouchableOpacity onPress={() => push({ params: { invoiceId: invoice?.codfatura }, pathname: '/invoice' })}>
        <Text className="text-[#1552A7] font-bold text-md">Ver Fatura</Text>
      </TouchableOpacity>
    </View>
  )
}