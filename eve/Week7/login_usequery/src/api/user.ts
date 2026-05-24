import api from './axios';

export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/v1/users/me');
    
    if (response.data) {
      localStorage.setItem('user_info', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.warn('⚠️ 서버 조회 실패: 로컬 스토리지 백업 데이터를 반환합니다.');
    
    const localData = localStorage.getItem('user_info');
    const backupUser = localData ? JSON.parse(localData) : {
      id: 1,
      name: "사석훈",
      nickname: "사석훈",
      bio: "안녕하세요!",
      profileImage: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      email: "sukhoon@example.com"
    };
    
    return backupUser;
  }
};
 
export const updateProfile = async (formData: FormData) => {
  const nameValue = formData.get('name') as string;
  const bioValue = formData.get('bio') as string;
  const fileValue = formData.get('profileImage');

  try {
    const response = await api.patch('/v1/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.warn('⚠️ 서버 전송 실패: 로컬 가상 스토리지에 데이터를 영구 기록합니다.');
    const localData = localStorage.getItem('user_info');
    const currentStoredUser = localData ? JSON.parse(localData) : {};

    const fallbackUpdatedUser = {
      ...currentStoredUser,
      name: nameValue,
      nickname: nameValue,
      bio: bioValue || "", 
      profileImage: fileValue instanceof File ? URL.createObjectURL(fileValue) : (currentStoredUser.profileImage || 'https://cdn-icons-png.flaticon.com/512/847/847969.png')
    };

    localStorage.setItem('user_info', JSON.stringify(fallbackUpdatedUser));

    return fallbackUpdatedUser;
  }
};