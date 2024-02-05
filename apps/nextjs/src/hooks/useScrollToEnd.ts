import { useEffect, useRef, useState } from 'react';
import { set } from 'react-hook-form';

function useScrollToEnd() {
  const ref = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);

    if (ref.current) {
      // ref.current.scroll = ref.current.scrollHeight;
      //Scroll to the bottom of the chat
      ref.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
      setIsReady(true);
    }
  }, [ref, setIsReady]);

  return { ref, isReady };
}

export default useScrollToEnd;