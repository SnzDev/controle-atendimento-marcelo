import { useEffect, useRef, useState } from "react";

export interface DiscloseSelect {
  ref: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
}

function useDiscloseSelect(initialIsVisible?: boolean) {
  const [isVisible, setIsVisible] = useState(initialIsVisible ?? false);
  const ref = useRef<HTMLDivElement>(null);
  const onClose = () => setIsVisible(false);
  const onOpen = () => setIsVisible(true);
  const toggle = () => setIsVisible((old) => !old);

  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isVisible, onOpen, onClose, toggle };
}

export default useDiscloseSelect;
