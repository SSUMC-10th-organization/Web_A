import { useMemo, useState } from 'react';

interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

export default function useForm<T extends Record<string, string>>({
  initialValue,
  validate,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValue);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialValue).reduce(
      (acc, key) => {
        acc[key as keyof T] = false;
        return acc;
      },
      {} as Record<keyof T, boolean>
    )
  );

  const errors = useMemo(() => validate(values), [validate, values]);

  const handleChange = (name: keyof T, text: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: text,
    }));
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const getInputProps = (name: keyof T) => {
    return {
      value: values[name],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleChange(name, e.target.value),
      onBlur: () => handleBlur(name),
    };
  };

  return {
    values,
    errors,
    touched,
    getInputProps,
  };
}