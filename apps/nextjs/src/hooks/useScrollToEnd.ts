import { useEffect, useRef } from 'react';

function useScrollToEnd() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [ref]);

  return { ref };
}

export default useScrollToEnd;