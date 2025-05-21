import { useEffect, useMemo, useState } from "react";

interface FormValidations {
  [key: string]: [(value: any) => boolean, string];
}

interface FormValidationState {
  [key: string]: string | null;
}

export const useForm = <T extends Record<string, any>>(
  initialForm: T = {} as T,
  formValidations: FormValidations = {}
) => {
  const [formState, setFormState] = useState<T>(initialForm);
  const [formValidation, setFormValidation] = useState<FormValidationState>({});

  useEffect(() => {
    createValidators();
  }, [formState]);

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

  const onResetForm = () => {
    setFormState(initialForm);
  };

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
