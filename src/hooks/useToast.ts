import Toast from 'react-native-toast-message';

interface ToastParams {
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number; // react-native-toast-message uses visibilityTime
}

export function useToast() {
  const showToast = ({ type = 'success', title, description, duration = 4000 }: ToastParams) => {
    Toast.show({
      type: type,
      text1: title,
      text2: description,
      visibilityTime: duration,
      // position: 'bottom', // Example position
    });
  };

  return { toast: showToast };
}
