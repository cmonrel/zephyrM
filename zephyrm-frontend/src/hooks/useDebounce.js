/**
 * useDebounce custom hook.
 *
 * Custom hook that debounces a value.
 *
 * @module hooks/useDebounce
 */

import { useEffect, useState } from "react";

/**
 * This hook delays updating the debounced value until after the specified delay
 * has passed since the last time the input value was changed
 *
 * @param {any} value - The input value to be debounced.
 * @returns {Object} An object containing the debounced value.
 */

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  /**
   * Effect hook that updates the debounced value after the specified delay.
   *
   * @param {number} handler - The timeout handler returned by setTimeout.
   * @param {function} clearTimeout - The clearTimeout function to clear the timeout.
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
