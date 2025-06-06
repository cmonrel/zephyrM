/**
 * useDebounce hook
 *
 * @module hooks/useDebounce
 */

import { useEffect, useState } from "react";

/**
 * A hook that debounces a value.
 *
 * @param {string} value - The value to be debounced.
 * @param {number} delay - The number of milliseconds to wait before updating
 * the debounced value.
 *
 * @returns {Object} An object containing the debounced value.
 */
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  /**
   * Sets the debounced value after a delay.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue };
};
