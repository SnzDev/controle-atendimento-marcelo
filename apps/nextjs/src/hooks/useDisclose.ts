import { useState } from "react";


export interface Disclose {
  isVisible: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
}
function useDisclose(initialIsVisible?: boolean) {
  const [isVisible, setIsVisible] = useState(initialIsVisible ?? false);

  const onClose = () => setIsVisible(false);
  const onOpen = () => setIsVisible(true);
  const toggle = () => setIsVisible((old) => !old);

  return { isVisible, onOpen, onClose, toggle };
}

export default useDisclose;
