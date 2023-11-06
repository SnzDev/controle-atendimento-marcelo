import Toast from "react-native-root-toast";



export const useToast = () => {

  const showToast = (message: string,) => {
    return Toast.show(message, {
      position: Toast.positions.BOTTOM,
      duration: Toast.durations.SHORT,
      backgroundColor: '#1552A7',
      animation: true,
      opacity: 1,
      shadow: false,
      textColor: '#fff'
    });
  }

  return { showToast }
}