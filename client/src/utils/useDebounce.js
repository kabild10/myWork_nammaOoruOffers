// utils/useDebounce.js
import { useState, useEffect } from "react";

export default function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay || 500);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
