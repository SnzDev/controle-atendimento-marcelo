

import { Clock } from "iconsax-react-native"
import moment from "moment"
import { Text, View } from "react-native"

type ActualInvoice = {
  invoice?: {
    codfatura: number;
    contas: string;
    contratos: string;
    data_vencimento: string;
    descricao: string;
    valor_total: number;
  }
  barNumber?: string;
}
export const ActualInvoice = ({ invoice, barNumber }: ActualInvoice) => {
  const validDate = moment(invoice?.data_vencimento, 'DD/MM/YYYY');
  const formattedDate = validDate.format('D [de] MMMM');
  const formattedDate2 = validDate.format('MMMM YYYY');
  const price = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice?.valor_total ?? 0);
  return (
    <>
      <View className="flex-col border-2 border-[#E1E4E8] py-5 px-3 m-2 mt-0 space-y-2 rounded-lg bg-[#FFFFFF] shadow-lg">
        <Text className="text-[#5B5B5B] font-bold text-lg">{formattedDate2}</Text>
        <View className="flex-row justify-between  items-center">
          <View className="space-y-2">
            <Text className="text-[#5B5B5B] font-bold text-3xl">{price}</Text>
            <Text className="text-gray-500 text-xs font-bold">Vence dia {formattedDate}</Text>
            <View className="flex-row gap-1 bg-yellow-100 p-2 bg-opacity-50 rounded-lg items-center">
              <Clock size="20" className="text-yellow-500 font-medium" variant="Bold" />
              <Text className="text-yellow-500 font-lg text-xs font-medium">Aguardando Pagamento</Text>
            </View>
          </View>
        </View>
        <Text className="text-[10px] text-[#5B5B5B]">
          {barNumber?.replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})/, '$1.$2 $3.$4 $5.$6 $7 $8')}
        </Text>
      </View >
    </>
  )
}