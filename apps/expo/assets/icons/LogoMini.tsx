import type { StyledProps } from 'nativewind';
import { Image, type ImageProps, type ImageSourcePropType } from 'react-native';
import StyledImage from '~/components/StyledImage';

const LogoMini = (props: Omit<StyledProps<ImageProps>, 'alt' | 'source'>) => {
    const logoMiniImage = require('../images/logo-mini.png') as ImageSourcePropType;

    return (
        <StyledImage {...props} alt='logo-mini' source={logoMiniImage} />
    );
}

export default LogoMini;