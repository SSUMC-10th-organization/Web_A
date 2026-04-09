import { useEffect, useState } from "react";

// any 대신 unknown을 사용하여 Biome의 경고를 회피하고 안정성을 높임
function useForm<T extends Record<string, unknown>>(
	initialValues: T,
	validate: (values: T) => Record<string, string>,
) {
	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value } as T);
	};

	useEffect(() => {
		setErrors(validate(values));
	}, [values, validate]);

	return { values, errors, handleChange };
}

export default useForm;
