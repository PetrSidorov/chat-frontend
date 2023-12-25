import { useState, useEffect, useRef, Dispatch } from "react";
import { SetStateAction } from "react";
export default function useStorage<T>({
  initialValue,
  key,
}: {
  initialValue: T;
  key: string;
}): [T, Dispatch<SetStateAction<T>>] {
  const keyRef = useRef(key);
  const getItemFromLocalStorage = () => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  const [state, setState] = useState<T>(
    getItemFromLocalStorage() || initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  useEffect(() => {
    if (keyRef.current != key) {
      localStorage.removeItem(keyRef.current);
      localStorage.setItem(key, JSON.stringify(state));
      keyRef.current = key;
    }
  }, [key, state]);

  return [state, setState];
}
