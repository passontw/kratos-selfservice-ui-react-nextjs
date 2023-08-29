import { useEffect, useState } from 'react';

const useDebounceEffect = (val: unknown, delay: number, deps: unknown[]) => {
  const [debounceVal, setDebounceVal] = useState(val);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceVal(val);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return debounceVal;
};

export default useDebounceEffect;
