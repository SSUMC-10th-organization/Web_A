import { axiosInstance } from "./axios";

export interface RequestUpdateUserDto {
	name?: string;
	bio?: string;
	avatar?: string; 
}

// 내 정보 수정
export const patchUser = async (body: RequestUpdateUserDto) => {
	const { data } = await axiosInstance.patch("/v1/users", body);
	return data;
};

// 회원 탈퇴
export const deleteUser = async () => {
	const { data } = await axiosInstance.delete("/v1/users");
	return data;
};