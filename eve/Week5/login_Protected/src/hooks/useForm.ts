import { useState } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  validate: (values: T) => Partial<Record<keyof T, string>>;
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const errors = validate(values);

  const handleChange = (name: keyof T, value: string) => {
    setValues({ ...values, [name]: value });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({ ...touched, [name]: true });
  };

  const isValid =
    Object.keys(errors).length === 0 &&
    Object.values(values as any).every((v) => v !== "");

  return { values, errors, touched, handleChange, handleBlur, isValid };
}

export default useForm;