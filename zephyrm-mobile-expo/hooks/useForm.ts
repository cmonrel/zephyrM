/**
 * useForm hook
 *
 * @module hooks/useForm
 */

import { useEffect, useMemo, useState } from "react";

interface FormValidations {
  [key: string]: [(value: any) => boolean, string];
}

interface FormValidationState {
  [key: string]: string | null;
}

/**
 * useForm hook
 *
 * A hook to handle form states and validations.
 * @param {T} initialForm - The initial state of the form.
 * @param {FormValidations} formValidations - An object where the keys are the form field names
 * and the values are an array of two functions. The first function must return a boolean
 * indicating whether the field is valid or not. The second function must return a string with
 * the error message to display if the field is not valid.
 * @returns An object with the form state, a function to update the form state, a function to
 * reset the form state, a function to set the form state, the form validation state, and a
 * boolean indicating whether the form is valid or not.
 */
export const useForm = <T extends Record<string, any>>(
  initialForm: T = {} as T,
  formValidations: FormValidations = {}
) => {
  const [formState, setFormState] = useState<T>(initialForm);
  const [formValidation, setFormValidation] = useState<FormValidationState>({});

  /**
   * Creates validators for the form fields.
   */
  useEffect(() => {
    createValidators();
  }, [formState]);

  /**
   * Updates the form state when the initial form changes.
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
   * Updates the form state with the new value for the specified form field.
   *
   * @param {Object} target - The target object containing the name and value of the form field.
   * @param {string} target.name - The name of the form field to update.
   * @param {any} target.value - The new value to set for the specified form field.
   */
  const onInputChange = ({
    target,
  }: {
    target: { name: string; value: any };
  }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  /**
   * Resets the form state to its initial values.
   *
   * @remarks
   * This function sets the form state to the initialForm values, effectively clearing any changes made to the form fields.
   */

  const onResetForm = () => {
    setFormState(initialForm);
  };

  /**
   * Creates validators for the form fields.
   *
   * This function iterates through the formValidations object and creates a new
   * object with the same keys but with the suffix "Valid" added to the end.
   * The value of each key is the result of calling the first function in the
   * array of validators for the corresponding form field with the current
   * form state value for that field. If the result of the function is true, the
   * value is set to null, otherwise the second function in the array is called
   * with the current form state value and the result is set as the value of the
   * key.
   *
   * @returns {void}
   */
  const createValidators = () => {
    const formCheckedValues: FormValidationState = {};

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
