import { useEffect, useState } from "react";

interface UseFormProps<T> {
  initialValues: T; // { email: "", password: "" } 
  
  //값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>();
  const [errors, setErrors] = useState<Record<string, string>>();


  // 사용자가 입력값을 바꿀 때 실행되는 함수
  const handleChange = (name: keyof T, value: string) => {
    setValues({ 
      ...values,  // 불변성 유지(기존 값 유지)
      [name]: value,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  // 이메일 인풋, 패스워드 인풋 속성들을 가져오기
  const getInputProps = (name: keyof T) => {
    const value : T[keyof T] = values[name];
    // HTMLTextAreaElement도 추가해 확장성 높임
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleChange(name, e.target.value);
    };

    const onBlur = () => handleBlur(name);

    return {
      value,
      onChange,
      onBlur,
    };
  };

  // values가 변경될 때마다 에러 검증 로직이 실행됨.
  useEffect( () => {
    const newErrors = validate(values);
    setErrors(newErrors); // 오류 메세지 업뎃
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
};

export default useForm;