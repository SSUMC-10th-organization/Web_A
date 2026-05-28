import { axiosInstance } from "./axios";

// 이미지 업로드 
// 업로드 성공 시 imageUrl 을 반환, 이 URL을 LP thumbnail / user avatar 에 사용
export const uploadImage = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);

	const { data } = await axiosInstance.post("/v1/uploads", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});

	return data.data.imageUrl as string;
};