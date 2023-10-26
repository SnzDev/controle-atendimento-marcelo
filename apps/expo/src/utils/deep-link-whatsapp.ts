import { Linking } from 'react-native';

export const openWhatsApp = async (message: string) => {
  const number = "+558631421710";
  const url = `https://wa.me/${number}?text=${message}`;
  await Linking.openURL(url);
};