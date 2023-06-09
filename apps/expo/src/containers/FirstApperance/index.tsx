import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '~/components/Button';
import Divisor from '~/components/Divisor';
import StyledText from '~/components/StyledText';
import StyledView from '~/components/StyledView';
import assets from '../../../assets/';
import Link from '~/components/Link';
import { Stack, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';

const UndrawOnlineConnection = assets.icons.undrawOnlineConnection;
const LogoMini = assets.icons.logoMini;
const FirstApperance = () => {

    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <StyledView
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            className={`flex-1 flex items-center justify-between bg-white px-2`}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                }} />

            <StyledView>
                <LogoMini className='w-[97px] h-[62px]' />
            </StyledView>
            <StyledView className="flex justify-center">
                <UndrawOnlineConnection className="w-20 h-20" />
            </StyledView>
            <StyledView>
                <StyledView>
                    <Link href="/">
                        <Button onPress={() => router.push("/Login")} variant='contained'>
                            Já sou Cliente
                        </Button>
                    </Link>
                    <Divisor label="OU" className='h-1' />
                    <Button
                        onPress={() => Linking.openURL("https://wa.me/86999135090?text=Olá+tudo+bem?")}
                        variant='outlined'>
                        Ainda não sou cliente
                    </Button>
                </StyledView>
                <StyledView className='mt-5 flex justify-center'>
                    <StyledText className='text-md px-10 text-center'>
                        Ao continuar você concorda com nossos
                    </StyledText>
                    <Link href="https://d2evkimvhatqav.cloudfront.net/documents/terms_and_conditions/testing_and_evaluation_services/testing-and-evaluation-terms-and-conditions-pt-v02.pdf?v=1666968453">Termos e condições</Link>
                </StyledView>
            </StyledView>
        </StyledView >
    );

}

export default FirstApperance;