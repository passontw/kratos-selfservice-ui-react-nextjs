import { useState } from 'react';
/**
* Accesses a specific localStorage value in a nextjs environment (e.g. checks if
* the DOM is available) and stores it in a react state, returning access to
* the state version of the localStorage value and a function to update both the
* state and localStorage.
* @param keyName - name of the localStorage key
* @param defaultValue - initial default value if creating a NEW localStorage value
* @returns
*/
export const useLocalStorage = (keyName: string, defaultValue?: unknown) => {
  const [storedValue, setStoredValue] = useState(() => {
    const value =
      typeof window !== 'undefined' && window.localStorage.getItem(keyName);
    try {
      if (value) {
        // parse into json from string stored in loca storage
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      // console.log('error of "' + keyName + '" was: ' + err);
      return value; // return unparsed string
    }
  });
  const setValue = (newValue: unknown) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};