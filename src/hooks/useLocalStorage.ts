import { useState, useEffect } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const storedValue = localStorage.getItem(key);

  let initial = initialValue;
  if (storedValue) {
    try {
      initial = JSON.parse(storedValue);
    } catch (error) {
      initial = storedValue as unknown as T;
    }
  }

  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
