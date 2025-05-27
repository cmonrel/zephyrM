/**
 * useForm custom hook
 *
 * Custom hook to manage a form with client-side validation.
 *
 * @module hooks/useForm
 */

import { useEffect, useMemo, useState } from "react";

/**
 * @param {Object} [initialForm={}] - The initial state of the form.
 * @param {Object} [formValidations={}] - An object with function validators
 * for each field in the form.
 *
 * Returns an object with the following properties:
 *
 * - `formState`: The state of the form, an object with the same keys as the
 *   `initialForm` object.
 * - `formValidation`: An object with the validation results for each field in
 *   the form, where each key is the field name with the suffix `Valid` and the
 *   value is `null` if the field is valid or an error message if it's not.
 * - `onInputChange`: A function to be called when an input element in the form
 *   changes, with the event object as an argument.
 * - `onResetForm`: A function to be called when the form should be reset to its
 *   initial state.
 * - `setFormState`: A function to be called when the form state should be
 *   updated, with the new state as an argument.
 * - `isFormValid`: A boolean value indicating whether the form is valid or not.
 */
export const useForm = (initialForm = {}, formValidations = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const [formValidation, setFormValidation] = useState({});

  /**
   * Effect hook that creates validators for each field in the form when the form
   * state changes.
   *
   * @param {Object} formState - The current state of the form.
   */
  useEffect(() => {
    createValidators();
  }, [formState]);

  /**
   * Effect hook that updates the form state when the initial form changes.
   *
   * @param {Object} initialForm - The initial state of the form.
   */
  useEffect(() => {
    if (JSON.stringify(initialForm) !== JSON.stringify(formState)) {
      setFormState(initialForm);
    }
  }, [initialForm]);

  const isFormValid = useMemo(() => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }

    return true;
  }, [formValidation]);

  /**
   * Handles an input element change event in the form.
   *
   * Updates the form state with the value of the input element that changed.
   *
   * @param {Object} event - The event object associated with the input element change.
   * @param {Object} event.target - The input element that changed.
   * @param {string} event.target.name - The name of the input element that changed.
   * @param {string} event.target.value - The new value of the input element that changed.
   */
  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  /**
   * Resets the form state to its initial values.
   *
   * This function sets the form state to the initial form values,
   * effectively clearing any changes made by the user.
   */

  const onResetForm = () => {
    setFormState(initialForm);
  };

  /**
   * Creates an object of validation results for the form state.
   *
   * Iterates through each form field and its associated validation function
   * and error message. Calls each validation function with the current form
   * state value for the field and sets the result to either the error message
   * or null in the formCheckedValues object. Finally, sets the formValidation
   * state to the formCheckedValues object.
   */
  const createValidators = () => {
    const formCheckedValues = {};

    for (const formField of Object.keys(formValidations)) {
      const [fn, errorMessage] = formValidations[formField];

      formCheckedValues[`${formField}Valid`] = fn(formState[formField])
        ? null
        : errorMessage;
    }

    setFormValidation(formCheckedValues);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    setFormState,

    ...formValidation,
    isFormValid,
  };
};
