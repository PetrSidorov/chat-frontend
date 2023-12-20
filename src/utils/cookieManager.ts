import { useState, useEffect, useRef } from "react";
export default function useCookie({
  initialValue,
  key,
  value,
}: {
  initialValue: string;
  key: string;
  value: string;
}) {
  const keyRef = useRef(key);
  const [state, setState] = useState(
    () => localStorage.getItem(JSON.parse(key)) || initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  if (keyRef.current != key) {
    localStorage.removeItem(keyRef.current);
    localStorage.setItem(key, JSON.stringify(state));
  }

  return [state, setState];
}
