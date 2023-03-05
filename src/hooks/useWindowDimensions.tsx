import { useState, useEffect } from "react";

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    function handleResize() {
      const { innerWidth: width, innerHeight: height } = window;
      setWindowDimensions({ width, height });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
