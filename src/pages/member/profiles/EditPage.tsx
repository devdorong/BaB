import { RiArrowRightSLine, RiImageLine } from 'react-icons/ri';
import { ButtonFillMd } from '../../../ui/button';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getProfile, removeAvatar, updateProfile, uploadAvatar } from '../../../lib/propile';
import type { Profile, ProfileUpdate } from '../../../types/bobType';

function EditPage() {
  const navigate = useNavigate();
  const { user, changePassword } = useAuth();

  // 로딩
  const [loading, setLoading] = useState<boolean>(true);
  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);
  // 에러메세지
  const [error, setError] = useState<string>('');
  // 사용자 닉네임
  const [nickName, setNickName] = useState<string>('');

  // 아바타 이미지를 위한 생태관리
  // 이미지 업로드 상태 표현
  const [uploading, setUploading] = useState<boolean>(false);
  // 미리보기 이미지 url (문자열)
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  // 실제 파일
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // 사용자가 새로운 이미지 선택시, 즉 편집 중인 경우 원본 URL 보관용
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState<string | null>(null);
  // 이미지 제거 요청 상태(그러나, 실제 file 제거는 수정확인 버튼 눌렀을 때 처리)
  const [imageRemovalRequest, setImageRemovalRequest] = useState<boolean>(false);
  // input type = "file" 태그 참조
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 비밀번호 변경 관련 상태
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [pwErr, setPwErr] = useState<{ current?: string; next?: string; confirm?: string }>({});

  const [intro, setIntro] = useState('');
  const nickMax = 20;
  const introMax = 150;

  // 사용자 프로필 정보
  const loadProfile = async () => {
    if (!user?.id) {
      setError('사용자정보 없음');
      setLoading(false);
      return;
    }
    try {
      // 사용자 정보 가져오기
      const tempData = await getProfile(user?.id);
      if (!tempData) {
        // null의 경우
        setError('사용자 프로필 정보 찾을 수 없음');
        return;
      }
      // 사용자 정보 유효함
      setNickName(tempData.nickname || '');
      setIntro(tempData.comment || '');
      setProfileData(tempData);
      setOriginalAvatarUrl(
        !tempData.avatar_url || tempData.avatar_url === 'guest_image' ? null : tempData.avatar_url,
      );
    } catch (error) {
      setError('프로필 호출 오류');
    } finally {
      setLoading(false);
    }
  };

  // id로 닉네임을 받아옴
  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  // 비밀번호 에러
  const PasswordErrorMsg = () => {
    // 전부 비우고 시작
    setPwErr({});
    if (!currentPassword.trim()) {
      setPwErr({ current: '현재 비밀번호를 입력해주세요' });
      return false;
    }
    if (!newPassword.trim()) {
      setPwErr({ next: '새 비밀번호를 입력해주세요' });
      return false;
    }
    if (currentPassword === newPassword) {
      setPwErr({ next: '현재 비밀번호와 동일한 비밀번호입니다' });
      return false;
    }
    if (newPassword.length < 6) {
      setPwErr({ next: '비밀번호는 최소 6자 이상 입력해주세요' });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPwErr({ confirm: '비밀번호가 일치하지 않습니다' });
      return false;
    }
    return true;
  };

  // 저장(수정하기)
  const handleSaveProfile = async () => {
    if (!user?.id || isUpdating) return;

    setIsUpdating(true);
    try {
      // 비밀번호 변경 요청이 있는지 체크
      const wantChangePw = currentPassword || newPassword || confirmPassword;
      if (wantChangePw) {
        if (!PasswordErrorMsg()) {
          setIsUpdating(false);
          return;
        }

        const result = await changePassword(currentPassword, newPassword);
        if (result?.error) {
          if (result.error.includes('현재 비밀번호') || result.error.includes('올바르지')) {
            setPwErr({ current: result.error });
          } else if (result.error.includes('6자') || result.error.includes('최소')) {
            setPwErr({ next: result.error });
          } else {
            setPwErr({ confirm: result.error });
          }
          setIsUpdating(false);
          return;
        }

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPwErr({});
      }

      let imgUrl = originalAvatarUrl; // 원본 이미지
      if (imageRemovalRequest) {
        // storage에 실제 이미지 제거
        const imgsuccess = await removeAvatar(user.id);
        if (imgsuccess) {
          imgUrl = null;
        }
      } else if (selectedFile) {
        setUploading(true);
        // 새로운 이미지 업로드 시
        const uploadedImageUrl = await uploadAvatar(selectedFile, user.id);
        setUploading(false);
        if (uploadedImageUrl) {
          // 실제로 업로드 완료 후 전달받은 URL 문자열 저장
          // profiles 테이블에 avatar_url에 넣어줄 문자열
          imgUrl = uploadedImageUrl;
        }
      }
      const payload: ProfileUpdate = {
        nickname: nickName,
        comment: intro,
        avatar_url: imgUrl ?? 'guest_image',
      };

      const success = await updateProfile(payload, user.id);
      if (!success) {
        return;
      }
      setProfileData(prev =>
        prev
          ? { ...prev, nickname: nickName, comment: intro, avatar_url: imgUrl ?? 'guest_image' }
          : prev,
      );
      setOriginalAvatarUrl(imgUrl ?? null);
      setPreviewImg(null);
      setSelectedFile(null);
      setImageRemovalRequest(false);
      navigate('/member/profile');
    } catch (err) {
      console.log(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // 이미지 선택 처리 (미리보기)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      // alert창 수정할것
      alert(`지원하지 않는 파일 형식`);
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`파일 크기 큼`);
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = e => {
      setPreviewImg(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
    // 새 이미지 선택 시 이미지 제거 요청 상태 초기화
    setImageRemovalRequest(false);
  };

  // 이미지 파일 선택 취소
  const handleCancelUpload = () => {
    setPreviewImg(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 제거 처리
  const handleRemoveImage = () => {
    const ok = confirm('프로필 이미지 제거?');
    if (!ok) {
      return;
    }
    // 즉시 제거하지 않음
    // 제거하려는 상태만 별도록 관리
    setImageRemovalRequest(true);
    setPreviewImg(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex bg-bg-bg ">
      {/* 프로필 헤더 링크 */}
      <div className="flex flex-col w-[1280px] m-auto">
        <div className="flex py-[15px]">
          <div
            onClick={() => navigate('/member/profile')}
            className="cursor-pointer hover:text-babgray-900 text-babgray-600 text-[17px]"
          >
            프로필
          </div>
          <div className="flex pt-[3px] items-center text-babgray-600 px-[5px] text-[17px]">
            <RiArrowRightSLine />
          </div>{' '}
          <div className="text-bab-500 text-[17px]">편집</div>
        </div>
        <div className="mt-[20px] mb-[60px]">
          <div className="flex gap-[40px] items-start">
            {/* 왼쪽 프로필 카드 */}
            <div className="flex flex-col gap-[20px] items-center justify-center">
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                {/* 프로필 및 설명 */}
                <div className="gap-[15px] flex flex-col justify-center items-center">
                  <div
                    onClick={handleRemoveImage}
                    className="w-[94px] h-[94px] overflow-hidden rounded-full"
                  >
                    <img
                      src={
                        previewImg ??
                        (imageRemovalRequest
                          ? 'https://www.gravatar.com/avatar/?d=mp&s=200'
                          : (originalAvatarUrl ?? 'https://www.gravatar.com/avatar/?d=mp&s=200'))
                      }
                      alt="아바타"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="font-medium flex justify-center items-center pt-[25px]">
                    <ButtonFillMd
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '20px 30px',
                        fontWeight: 500,
                        gap: 5,
                        alignItems: 'center',
                      }}
                    >
                      <RiImageLine />
                      <p>프로필 사진 변경</p>
                    </ButtonFillMd>

                    {/* 파일 입력 */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageSelect}
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <div className="text-center text-babgray-500 text-[14px]">
                      JPN, PNG 파일 (최대 5MB)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 오른쪽 프로필카드 */}
            <div className="flex flex-col w-full gap-[25px]">
              {/* 기본 정보 */}
              <div className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center">
                  <h2 className="text-babgray-900 text-[18px] font-bold">기본 정보</h2>
                </div>

                {/* 필드들 */}
                <div className="flex flex-col pt-6 gap-6">
                  {/* 닉네임 */}
                  <label className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 text-babgray-900">
                      닉네임 <span className="text-bab-500">*</span>
                    </div>
                    <div className="w-full h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-300 inline-flex items-center">
                      <input
                        type="text"
                        value={nickName}
                        onChange={e => setNickName(e.target.value.slice(0, nickMax))}
                        className="flex text-babgray-700 outline-none text-[16px] placeholder:text-babgray-400"
                        placeholder="닉네임을 입력하세요"
                      />
                    </div>
                    <div className="text-[12px] text-babgray-400">
                      {nickName.length}/{nickMax}
                    </div>
                  </label>

                  {/* 소개 */}
                  <label className="flex flex-col gap-2">
                    <div className="text-babgray-900">소개</div>
                    <textarea
                      value={intro}
                      onChange={e => setIntro(e.target.value.slice(0, introMax))}
                      rows={3}
                      className="w-full rounded-2xl outline outline-1 outline-offset-[-1px] outline-babgray-300 px-3.5 py-3 text-[14px] text-babgray-700 placeholder:text-babgray-400 resize-none"
                      placeholder="소개를 입력하세요"
                    />
                    <div className="text-[12px] text-babgray-400">
                      {intro.length}/{introMax}
                    </div>
                  </label>
                </div>
              </div>

              {/* 계정 정보 */}
              <div className="w-full px-[35px] py-[25px] pb-[40px] bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <h2 className="text-babgray-900 text-[18px] font-bold pb-[20px]">계정 정보</h2>

                <div className="mt-6 grid grid-cols-1 gap-[20px] items-center">
                  {/* 아이디 */}
                  <div className="flex flex-col gap-[50px]">
                    <div className="flex justify-between">
                      <div className="text-babgray-700">이름</div>
                      <div className="text-babgray-800">{profileData?.name}</div>
                    </div>

                    {/* 이메일 */}
                    <div className="flex justify-between">
                      <div className="text-babgray-700">이메일</div>
                      <div className="text-babgray-800">{user?.email}</div>
                    </div>

                    {/* 전화번호 */}
                    <div className="flex justify-between">
                      <div className="text-babgray-700">전화번호</div>
                      <div className="text-babgray-800">{profileData?.phone}</div>
                    </div>

                    {(!user?.app_metadata?.provider ||
                      user?.app_metadata?.provider === 'email') && (
                      <>
                        {/* 현재 비밀번호 */}
                        <div className="flex justify-between items-center">
                          <div className="text-babgray-700">현재 비밀번호</div>
                          <div className="relative w-[500px] h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-300 inline-flex items-center">
                            <input
                              type="password"
                              value={currentPassword}
                              onChange={e => {
                                setCurrentPassword(e.target.value);
                                setPwErr(prev => ({ ...prev, current: '' }));
                              }}
                              className="flex-1 text-babgray-700 outline-none text-[16px] placeholder:text-babgray-400"
                              placeholder="현재 비밀번호"
                            />
                            {/* 현재 비밀번호 */}
                            {pwErr.current && (
                              <div className="text-babbutton-red text-nowrap absolute left-[0%] top-[110%]">
                                {pwErr.current}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 새 비밀번호 */}
                        <div className="flex justify-between items-center">
                          <div className="text-babgray-700">새 비밀번호</div>
                          <div className="relative w-[500px] h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-300 inline-flex items-center">
                            <input
                              type="password"
                              value={newPassword}
                              onChange={e => {
                                setNewPassword(e.target.value);
                                setPwErr(prev => ({ ...prev, next: '' }));
                              }}
                              className="w-[500px] text-babgray-700 outline-none text-[16px] placeholder:text-babgray-400"
                              placeholder="새 비밀번호"
                            />
                            {/* 새 비밀번호 */}
                            {pwErr.next && (
                              <div className="text-babbutton-red text-nowrap absolute left-[0%] top-[110%]">
                                {pwErr.next}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 새 비밀번호 확인 */}
                        <div className="flex justify-between items-center">
                          <div className="text-babgray-700">새 비밀번호 확인</div>
                          <div className="relative w-[500px] h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-300 inline-flex items-center">
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={e => {
                                setConfirmPassword(e.target.value);
                                setPwErr(prev => ({ ...prev, confirm: '' }));
                              }}
                              className="flex-1 text-babgray-700 outline-none text-[16px] placeholder:text-babgray-400"
                              placeholder="새 비밀번호 확인"
                            />
                            {/* 새 비밀번호 확인 */}
                            {pwErr.confirm && (
                              <div className="text-babbutton-red text-nowrap absolute left-[0%] top-[110%]">
                                {pwErr.confirm}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 하단 저장 버튼 */}
              <div className="pt-2">
                <button
                  type="button"
                  className="w-full h-[46px] rounded-full bg-bab-500 text-white font-semibold shadow-[0_4px_4px_rgba(0,0,0,0.02)]"
                  onClick={handleSaveProfile}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
