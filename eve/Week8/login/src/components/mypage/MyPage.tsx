import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { fetchUserProfile, updateUserProfile } from '../../api/user';

const MyPage = () => {
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  
 
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editProfileImg, setEditProfileImg] = useState('');

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const user = profileData?.data || { name: "사용자", bio: "", profileImg: "" };

  useEffect(() => {
    if (profileData?.data) {
      setEditName(user.name);
      setEditBio(user.bio || '');
      setEditProfileImg(user.profileImg || '');
    }
  }, [profileData]);

  const updateProfileMutation = useMutation({
    mutationFn: (variables: { name: string; bio: string; profileImg: string }) => {
      return updateUserProfile({
        name: variables.name,
        bio: variables.bio.trim(),        
        profileImg: variables.profileImg,   
      });
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      alert("프로필이 성공적으로 수정되었습니다.");
    },
    onError: (error) => {
      console.error("❌ 프로필 수정 실패:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert("이름은 필수 항목입니다.");
      return;
    }
    updateProfileMutation.mutate({
      name: editName.trim(),
      bio: editBio,
      profileImg: editProfileImg
    });
  };

  if (isLoading) return <LoadingText>프로필 로딩 중...</LoadingText>;

  return (
    <Container>
      <ProfileCard>
        <HeaderRow>
          <PageTitle>마이 페이지</PageTitle>
          {!isEditing && (
            <EditModeBtn onClick={() => setIsEditing(true)}>프로필 설정</EditModeBtn>
          )}
        </HeaderRow>

        {!isEditing ? (
          <ProfileInfoArea>
            <AvatarWrapper>
              {user.profileImg ? (
                <ProfileImg src={user.profileImg} alt="프로필" />
              ) : (
                <DefaultAvatar viewBox="0 0 24 24">
                  <path fill="#aaa" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </DefaultAvatar>
              )}
            </AvatarWrapper>
            
            <InfoContent>
              <UserName>{user.name}</UserName>
              <UserBio>{user.bio || "등록된 소개글이 없습니다."}</UserBio>
            </InfoContent>
          </ProfileInfoArea>
        ) : (
          <EditForm onSubmit={handleSave}>
            <AvatarWrapper>
              {editProfileImg ? (
                <ProfileImg src={editProfileImg} alt="미리보기" />
              ) : (
                <DefaultAvatar viewBox="0 0 24 24">
                  <path fill="#aaa" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </DefaultAvatar>
              )}
            </AvatarWrapper>

            <InputGroup>
              <Label>사용자 이름 *</Label>
              <Input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="이름을 입력해주세요 (필수)"
                maxLength={20}
              />
            </InputGroup>

            <InputGroup>
              <Label>소개글 (Bio)</Label>
              <Textarea 
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="자신을 소개해보세요 (선택)"
                maxLength={100}
              />
            </InputGroup>

            <InputGroup>
              <Label>프로필 이미지 URL</Label>
              <Input 
                type="text" 
                value={editProfileImg}
                onChange={(e) => setEditProfileImg(e.target.value)}
                placeholder="이미지 링크 주소를 입력해주세요 (선택)"
              />
            </InputGroup>

            <ActionRow>
              <CancelBtn type="button" onClick={() => setIsEditing(false)}>취소</CancelBtn>
              <SaveBtn type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? '저장 중...' : '저장하기'}
              </SaveBtn>
            </ActionRow>
          </EditForm>
        )}
      </ProfileCard>
    </Container>
  );
};

export default MyPage;

const Container = styled.div` display: flex; justify-content: center; padding: 50px 20px; background: #161719; min-height: 100vh; color: #fff; box-sizing: border-box; `;
const ProfileCard = styled.div` background: #25262b; border-radius: 20px; padding: 40px; width: 100%; max-width: 600px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); height: fit-content; `;
const HeaderRow = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid #3e4045; padding-bottom: 15px; `;
const PageTitle = styled.h2` font-size: 1.4rem; font-weight: 600; margin: 0; `;
const EditModeBtn = styled.button` background: #3e4045; color: #fff; border: 1px solid #5f6267; border-radius: 6px; padding: 8px 16px; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; &:hover { background: #4e5156; } `;
const ProfileInfoArea = styled.div` display: flex; gap: 24px; align-items: center; `;
const AvatarWrapper = styled.div` width: 100px; height: 100px; background: #1c1d20; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid #3e4045; margin: 0 auto 20px auto; `;
const ProfileImg = styled.img` width: 100%; height: 100%; object-fit: cover; `;
const DefaultAvatar = styled.svg` width: 60px; height: 60px; `;
const InfoContent = styled.div` display: flex; flex-direction: column; gap: 8px; flex: 1; `;
const UserName = styled.h3` font-size: 1.5rem; font-weight: bold; margin: 0; color: #fff; `;
const UserBio = styled.p` font-size: 1rem; color: #b2b5ba; margin: 0; line-height: 1.5; `;
const EditForm = styled.form` display: flex; flex-direction: column; gap: 20px; width: 100%; `;
const InputGroup = styled.div` display: flex; flex-direction: column; gap: 8px; `;
const Label = styled.label` font-size: 0.9rem; color: #8a8d93; font-weight: 500; `;
const Input = styled.input` background: #1c1d20; border: 1px solid #3e4045; border-radius: 6px; padding: 12px; color: #fff; font-size: 0.95rem; outline: none; &:focus { border-color: #8996a6; } `;
const Textarea = styled.textarea` background: #1c1d20; border: 1px solid #3e4045; border-radius: 6px; padding: 12px; color: #fff; font-size: 0.95rem; outline: none; resize: none; height: 8px; &:focus { border-color: #8996a6; } `;
const ActionRow = styled.div` display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; `;
const CancelBtn = styled.button` background: #3e4045; color: #fff; border: none; border-radius: 6px; padding: 10px 20px; font-size: 0.95rem; cursor: pointer; `;
const SaveBtn = styled.button` background: #8996a6; color: #fff; border: none; border-radius: 6px; padding: 10px 24px; font-size: 0.95rem; cursor: pointer; font-weight: bold; &:disabled { background: #5f6267; cursor: not-allowed; } `;
const LoadingText = styled.div` text-align: center; color: #8a8d93; padding: 50px; font-size: 1.1rem; `;