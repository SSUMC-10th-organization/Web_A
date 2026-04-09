// src/hooks/useForm.ts
import { useState, useEffect } from 'react';

function useForm(initialValues: any, validate: any) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    // 값이 바뀔 때마다 유효성 검사 실행
    setErrors(validate(values));
  }, [values, validate]);

  return { values, errors, handleChange };
}

export default useForm;