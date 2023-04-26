import { useRef, useEffect } from 'react';

export const useThrottleCallback = (delay = 100, cleaning = true) => {
    const timeoutRef = useRef();
    const callbackRef = useRef();
    useEffect(() => {
      	if (cleaning) {
            return () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }
    }, []);
    
    return (callback) => {
        callbackRef.current = callback;
        if (timeoutRef.current) {
            return;
        }
        const wrapper = () => {
            timeoutRef.current = null;
            if (callbackRef.current) {
                callbackRef.current();
            }
        };
        timeoutRef.current = setTimeout(wrapper, delay);
    };
};
