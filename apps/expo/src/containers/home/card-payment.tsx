import { Clock } from "iconsax-react-native"
import { Pressable, Text, View } from "react-native"
import { Section } from "../../components/section"
import moment from "moment"
import { useRouter } from "expo-router"

type CardPaymentProps = {
  invoice?: {
    codfatura: number;
    contas: string;
    contratos: string;
    data_vencimento: string;
    descricao: string;
    valor_total: number;
  }
}
export const CardPayment = ({ invoice }: CardPaymentProps) => {

  const validDate = moment(invoice?.data_vencimento, 'DD/MM/YYYY');
  const formattedDate = validDate.format('D [de] MMMM');
  const formattedDate2 = validDate.format('MMMM YYYY');

  const price = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice?.valor_total ?? 0);
  const router = useRouter();
  return (
    <>
      <Section title={`Última fatura - ${formattedDate2}`} />
      <View className="flex-row border-2 border-[#E1E4E8] py-5 px-3 m-2 mt-0 justify-between items-center rounded-lg bg-[#FFFFFF] shadow-lg">

        <View className="space-y-2">
          <Text className="text-[#5B5B5B] font-bold text-3xl">{price}</Text>
          <Text className="text-gray-500 text-xs font-bold">Vence dia {formattedDate}</Text>
          <View className="flex-row gap-1 bg-yellow-100 p-2 bg-opacity-50 rounded-lg items-center">
            <Clock size="20" className="text-yellow-500 font-medium" variant="Bold" />
            <Text className="text-yellow-500 font-lg text-xs font-medium">Aguardando Pagamento</Text>
          </View>
        </View>

        <Pressable onPress={() => {
          router.push({ params: { invoiceId: invoice?.codfatura }, pathname: '/invoice' })
        }} className="px-2 h-10 bg-[#1552A7] items-center justify-center rounded-md drop-shadow-lg">
          <Text className="text-white text-md font-bold">Ver Fatura</Text>
        </Pressable>
      </View >
    </>
  )
}