import type { StyledProps } from 'nativewind';
import { Image, useWindowDimensions, type ImageProps, type ImageSourcePropType } from 'react-native';

const UndrawOnlineConnection = (props: Omit<StyledProps<ImageProps>, 'alt' | 'source'>) => {
    const UndrawOnlineConnectionImage = require('../images/undraw-online-connection.png') as ImageSourcePropType;
    const { width, height } = useWindowDimensions();

    const aspectRatio = 283 / 214; // Calcula a proporção de aspecto do componente

    const componentWidth = width * 0.8; // Define a largura do componente como 80% da largura da tela
    const componentHeight = componentWidth / aspectRatio; // Calcula a altura do componente com base na proporção de aspecto

    return (
        <Image {...props} style={{ height: componentHeight, width: componentWidth }} alt='conexão' source={UndrawOnlineConnectionImage} />
    );
}

export default UndrawOnlineConnection;