import { Linking } from 'react-native';

export const openWhatsApp = async (number: string, message: string) => {
  const url = `https://wa.me/${number}?text=${message}`;

  await Linking.canOpenURL(url).then(async (supported) => {
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Unable to open URL: ${url}`);
    }
  });
};