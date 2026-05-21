import { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../../api/user'; 

interface Props {
  onClose: () => void;
  user: any;
}

const EditProfileModal = ({ onClose, user }: Props) => {
  const queryClient = useQueryClient();

  const storedUser = JSON.parse(
    localStorage.getItem('user_info') || '{}'
  );

  const [name, setName] = useState(
    user?.nickname ||
      user?.name ||
      storedUser?.nickname ||
      storedUser?.name ||
      ''
  );

  const [bio, setBio] = useState(
    user?.bio ||
      storedUser?.bio ||
      ''
  );

  const [preview, setPreview] = useState(
    user?.profileImage ||
      user?.profileImg ||
      storedUser?.profileImage ||
      storedUser?.profileImg ||
      'https://cdn-icons-png.flaticon.com/512/847/847969.png'
  );

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const mutation = useMutation({
    mutationFn: async (variables: { name: string; bio: string; file: File | null }) => {
      const formData = new FormData();
      formData.append('name', variables.name);
      formData.append('bio', variables.bio || '');

      if (variables.file) {
        formData.append('profileImage', variables.file);
      }

      return updateProfile(formData).catch(() => {
        return {
          name: variables.name,
          nickname: variables.name,
          bio: variables.bio,
          profileImage: preview
        };
      });
    },

    onSuccess: (data) => {
      const updatedUser = {
        ...storedUser,
        nickname: data?.name || data?.nickname || name,
        name: data?.name || data?.nickname || name,
        bio: data?.bio !== undefined ? data.bio : bio,
        email: storedUser?.email || "user@example.com",
        profileImage: data?.profileImage || preview,
        profileImg: data?.profileImage || preview,
      };

      localStorage.setItem('user_info', JSON.stringify(updatedUser));

      window.dispatchEvent(new Event('storage'));


      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });

      alert('프로필 수정이 완료되었습니다.');
      onClose();
    },

    onError: (error) => {
      console.error('프로필 수정 실패 내역:', error);
      alert('프로필 수정 처리 중 오류가 발생했습니다.');
    },
  });

  const handleSaveTrigger = () => {
    if (!name.trim()) {
      alert('이름은 필수 항목입니다.');
      return;
    }
    mutation.mutate({
      name: name.trim(),
      bio: bio,
      file: imageFile
    });
  };

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✕</CloseButton>
        <ProfileSection>
          <ProfileImage src={preview} alt="프로필 미리보기" />
          <HiddenInput
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <UploadLabel htmlFor="profile-upload">프로필 변경</UploadLabel>
        </ProfileSection>

        <InfoSection>
          <InputRow>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              maxLength={20}
            />
            <CheckButton onClick={handleSaveTrigger} disabled={mutation.isPending}>
              ✔
            </CheckButton>
          </InputRow>

          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자기소개를 입력해주세요 (선택)"
            maxLength={100}
          />

          <Email>{storedUser?.email || "이메일 정보가 없습니다."}</Email>
        </InfoSection>
      </Container>
    </Overlay>
  );
};

export default EditProfileModal;

const Overlay = styled.div` position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 9999; `;
const Container = styled.div` width: 900px; background: black; display: flex; gap: 40px; padding: 50px; border-radius: 10px; position: relative; `;
const CloseButton = styled.button` position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 40px; cursor: pointer; `;
const ProfileSection = styled.div` display: flex; flex-direction: column; align-items: center; gap: 20px; `;
const ProfileImage = styled.img` width: 260px; height: 260px; border-radius: 50%; object-fit: cover; background: #ddd; `;
const HiddenInput = styled.input` display: none; `;
const UploadLabel = styled.label` background: #ff0080; color: white; padding: 12px 18px; border-radius: 10px; cursor: pointer; font-weight: bold; `;
const InfoSection = styled.div` flex: 1; display: flex; flex-direction: column; gap: 25px; justify-content: center; `;
const InputRow = styled.div` display: flex; align-items: center; gap: 15px; `;
const Input = styled.input` flex: 1; height: 80px; background: black; border: 2px solid white; border-radius: 14px; color: white; font-size: 32px; padding: 0 20px; outline: none; `;
const CheckButton = styled.button` width: 60px; height: 60px; background: none; border: none; color: white; font-size: 42px; cursor: pointer; &:disabled { opacity: 0.5; cursor: not-allowed; } `;
const Email = styled.p` color: white; font-size: 28px; font-weight: bold; padding-left: 10px; `;