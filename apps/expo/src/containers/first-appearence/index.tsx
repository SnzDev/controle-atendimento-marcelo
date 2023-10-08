import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '~/components/ui/button';
import Divisor from '~/components/ui/divisor';
import assets from '../../../assets';
import Link from '~/components/ui/link';
import { Stack, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { View, Text } from 'react-native';
import { openWhatsApp } from '~/utils/deep-link-whatsapp';

const UndrawOnlineConnection = assets.icons.undrawOnlineConnection;
const LogoMini = assets.icons.logoMini;
const FirstApperance = () => {

    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            className={`flex-1 flex items-center justify-between bg-white px-2`}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                }} />

            <View>
                <LogoMini className='w-[97px] h-[62px]' />
            </View>
            <View className="flex justify-center">
                <UndrawOnlineConnection className="w-20 h-20" />
            </View>
            <View>
                <View>
                    <Link href="/">
                        <Button onPress={() => router.replace("/login")} variant='contained'>
                            Já sou Cliente
                        </Button>
                    </Link>
                    <Divisor label="OU" className='h-1' />
                    <Button
                        onPress={() => openWhatsApp("86999135090", "Teste 123")}
                        variant='outlined'>
                        Ainda não sou cliente
                    </Button>
                </View>
                <View className='mt-5 flex justify-center'>
                    <Text className='text-md px-10 text-center'>
                        Ao continuar você concorda com nossos
                    </Text>
                    <Link href="https://d2evkimvhatqav.cloudfront.net/documents/terms_and_conditions/testing_and_evaluation_services/testing-and-evaluation-terms-and-conditions-pt-v02.pdf?v=1666968453">Termos e condições</Link>
                </View>
            </View>
        </View >
    );

}

export default FirstApperance;