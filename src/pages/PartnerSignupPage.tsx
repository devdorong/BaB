import { useEffect, useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { RiCheckLine } from 'react-icons/ri';
import { InputField, InputFieldWithButton, TextAreaCustom } from '../components/InputField';

import CategorySelect from '../components/partner/CategorySelect';
import OperatingHours from '../components/partner/OperatingHours';
import { usePartnerSignup } from '../contexts/PartnerSignupContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Profile } from '../types/bobType';
import { getProfile } from '../lib/propile';
import { useAddressSearch } from '../components/partner/UseAddressSearch';

function PartnerSignupPage() {
  const navigate = useNavigate();
  const { formData, setFormData, saveDraft, submitApplication } = usePartnerSignup();
  const { address, latitude, longitude, openPostcode } = useAddressSearch();

  const { user } = useAuth();

  const [price, setPrice] = useState('');
  const [businessFile, setBusinessFile] = useState<File | null>(null);
  const [storeFile, setStoreFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);
  // 에러메세지
  const [error, setError] = useState<string>('');

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
      setNickname(tempData.nickname || '');
      setProfileData(tempData);
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

  // 이용 약관
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    approval: false,
    marketing: false, // 선택
  });
  useEffect(() => {
    if (address && latitude && longitude) {
      setFormData({
        ...formData,
        address,
        latitude: latitude,
        longitude: longitude,
      });
    }
  }, [address, latitude, longitude]);

  // 사업자 번호 양식 맞추기
  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setFormData({ businessNumber: value });
    } else if (value.length <= 5) {
      setFormData({ businessNumber: `${value.slice(0, 3)}-${value.slice(3)}` });
    } else {
      setFormData({
        businessNumber: `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5, 10)}`,
      });
    }
  };

  // 핸드폰 번호 양식 맞추기
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length < 4) {
      setFormData({ phone: value });
    } else if (value.length < 8) {
      setFormData({ phone: `${value.slice(0, 3)}-${value.slice(3)}` });
    } else {
      setFormData({ phone: `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}` });
    }
  };

  // 파일 변경 (단일)
  const handleSingleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    type: 'pdf' | 'image',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('파일 크기는 5MB 이하만 가능합니다.');
      return;
    }

    if (type === 'pdf' && file.type !== 'application/pdf') {
      alert('PDF 파일만 업로드 가능합니다.');
      return;
    }
    if (
      type === 'image' &&
      !['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)
    ) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setter(file);
    // 같은 파일 재선택 가능하도록 리셋
    e.currentTarget.value = '';
  };

  // 미리보기
  const renderPreview = (file: File) => {
    if (file.type === 'application/pdf') {
      return <p className="text-babgray-500">📄 {file.name}</p>;
    }
    const url = URL.createObjectURL(file);
    return (
      <img
        src={url}
        alt="preview"
        className="h-full object-cover"
        onLoad={() => URL.revokeObjectURL(url)}
      />
    );
  };

  const sanitizeFileName = (name: string) =>
    name
      .normalize('NFC')
      .replace(/\s+/g, '_')
      .replace(/[^\w.-]/g, '');

  const uploadSingleFile = async (bucket: string, file: File): Promise<string | null> => {
    const safeName = sanitizeFileName(file.name);
    const fileName = `${Date.now()}_${safeName}`;
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) {
      console.error(`${bucket} 업로드 실패:`, error.message);
      return null;
    }
    if (bucket === 'business_docs') return data.path;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData?.publicUrl ?? null;
  };

  const allChecked = Object.values(agreements).every(Boolean);
  const toggleAll = () => {
    const newValue = !allChecked;
    setAgreements({
      terms: newValue,
      privacy: newValue,
      approval: newValue,
      marketing: newValue,
    });
  };
  const toggleOne = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (submitting) return;

    // 약관 필수 체크
    if (!agreements.terms || !agreements.privacy || !agreements.approval) {
      alert('필수 약관에 모두 동의해야 신청이 가능합니다.');
      return;
    }

    // 필수 파일 체크
    if (!businessFile || !storeFile) {
      alert('필수 파일을 모두 업로드해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      // 3) 파일 업로드(병렬)
      const [businessUrl, thumbnailUrl] = await Promise.all([
        uploadSingleFile('business_docs', businessFile), // path 저장
        uploadSingleFile('store_photos', storeFile), // publicUrl 저장
      ]);

      if (!businessUrl || !thumbnailUrl) {
        alert('파일 업로드 중 오류가 발생했습니다.');
        return;
      }

      // 4) 식당 등록
      // const { error } = await supabase.from('restaurants').insert({
      //   name: formData.restaurantName,
      //   phone: formData.phone,
      //   address: formData.address,
      //   opentime: toTime(formData.openTime),
      //   closetime: toTime(formData.closeTime),
      //   closeday: formData.closedDays,
      //   storeintro: formData.storeIntro,
      //   business_number: formData.businessNumber,
      //   thumbnail_url: thumbnailUrl,
      //   profile_id: profileData?.id,
      //   latitude: formData.latitude,
      //   longitude: formData.longitude,
      // });

      // if (error) {
      //   console.error(error);
      //   alert('등록 실패');
      //   return;
      // }
      // // 프로필 업데이트 (role 을 patner 로)
      // const { error: updateError } = await supabase
      //   .from('profiles')
      //   .update({ role: 'partner' })
      //   .eq('id', profileData?.id);

      // if (updateError) {
      //   console.error(updateError);
      //   alert('프로필 업데이트 중 오류가 발생했습니다.');
      //   return;
      // }

      // alert('등록 완료! 프로필이 파트너로 전환되었습니다.');
      await submitApplication(thumbnailUrl);

      navigate('/partner');
    } finally {
      setSubmitting(false);
    }
  };

  // 확인용
  // useEffect(() => {
  //   console.log('formData 변경:', formData);
  //   console.log('주소:', address);
  //   console.log('위도:', latitude);
  //   console.log('경도:', longitude);
  // }, [formData]);

  useEffect(() => {
    if (!user) {
      alert('로그인 후 이용 가능한 서비스입니다.');
      navigate('/partner/login');
    }
  }, [user]);

  useEffect(() => {
    if (profileData && user) {
      setFormData({
        email: user.email || '',
        nickname: profileData.nickname || '',
        phone: profileData.phone || '',
        name: profileData.name || '',
      });
    }
  }, [profileData, user]);

  useEffect(() => {
    if (profileData?.role === 'partner') {
      navigate('/partner');
    }
  }, [profileData]);

  return (
    <div className="w-full py-24 bg-gray-50 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-sm w-[1185px] px-12 py-10 flex flex-col gap-14">
        {/* 제목 */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">파트너 신청서</h1>
          <p className="text-babgray-600">BaB 플랫폼의 파트너가 되어 더 많은 고객과 만나보세요.</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[30px]">
          <div className="flex flex-col gap-[37px]">
            {/* 기본 정보 */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">기본 정보</h2>
              <hr className="border-babgray-150" />

              <div className="flex gap-7">
                <InputField
                  label="닉네임"
                  type="text"
                  value={formData.nickname}
                  onChange={e => setFormData({ nickname: e.target.value })}
                  placeholder="닉네임을 입력해주세요"
                  required
                />

                <InputField
                  label="이메일"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ email: e.target.value })}
                  placeholder="이메일을 입력해주세요"
                  required
                />
              </div>

              <div className="flex gap-7">
                <InputField
                  label="대표자명"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ name: e.target.value })}
                  placeholder="대표자명 입력해주세요"
                  required
                />

                <InputField
                  label="휴대폰 번호"
                  type="text"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="번호를 입력해주세요"
                  required
                />
              </div>

              <div className="flex gap-7">
                <InputField
                  label="사업자 등록 번호"
                  type="text"
                  value={formData.businessNumber}
                  onChange={handleBusinessChange}
                  placeholder="사업자 등록 번호를 입력해주세요"
                  required
                />

                <InputField
                  label="업체명"
                  type="text"
                  value={formData.restaurantName}
                  onChange={e => setFormData({ restaurantName: e.target.value })}
                  placeholder="업체명을 입력해주세요"
                  required
                />
              </div>

              <InputFieldWithButton
                label="업체 주소"
                type="text"
                value={formData.address}
                onChange={e => setFormData({ address: e.target.value })}
                onButtonClick={openPostcode}
                placeholder="업체 주소 입력해주세요"
                required
                readOnly
              >
                주소 검색
              </InputFieldWithButton>
            </section>

            {/* 운영 정보 */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">운영 정보</h2>
              <hr className="border-babgray-150" />

              <div className="flex gap-7">
                <div className="relative flex flex-col w-[50%] justify-center gap-[9px]">
                  <div className="flex gap-1">
                    <label>카테고리</label>
                    <span className="text-bab-500">*</span>
                  </div>
                  <CategorySelect
                    value={formData.categoryId}
                    onChange={value => setFormData({ categoryId: value })}
                  />
                </div>

                <div className="flex flex-col w-[50%] gap-2">
                  <div className="flex gap-7">
                    <InputField
                      label="가격대"
                      type="text"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      placeholder="예 : 5,000원 ~ 15,000원"
                      required
                    />
                  </div>
                </div>
              </div>

              <OperatingHours
                openTime={formData.openTime}
                closeTime={formData.closeTime}
                closedDays={formData.closedDays}
                setOpenTime={v => setFormData({ openTime: v })}
                setCloseTime={v => setFormData({ closeTime: v })}
                setClosedDays={v => setFormData({ closedDays: v })}
              />

              {/* 매장 소개 */}
              <div className="flex flex-col w-full gap-2">
                <TextAreaCustom
                  label="매장 소개"
                  value={formData.storeIntro}
                  onChange={e => setFormData({ storeIntro: e.target.value })}
                  placeholder="대표 메뉴와 업체의 특징을 소개해주세요"
                  maxLength={500}
                  required
                />
                <p className="text-xs text-babgray-500 text-right">
                  {(formData.storeIntro ?? '').length}/500
                </p>
              </div>
            </section>

            {/* 서류 업로드 */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">서류 업로드</h2>
              <hr className="border-babgray-150" />

              <div className="grid grid-cols-2 gap-6">
                {/* 사업자등록증 (PDF, private) */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-1 text-gray-700 font-medium">
                    사업자 등록증 <span className="text-bab-500">*</span>
                  </label>
                  <label className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-babgray-200 rounded-2xl text-sm text-babgray-500 cursor-pointer overflow-hidden">
                    {businessFile
                      ? renderPreview(businessFile)
                      : '파일을 클릭하여 업로드 (PDF / 최대 5MB)'}
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={e => handleSingleFileChange(e, setBusinessFile, 'pdf')}
                    />
                  </label>
                </div>

                {/* 매장 대표 이미지 (공개 URL) */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-1 text-gray-700 font-medium">
                    매장 사진 <span className="text-bab-500">*</span>
                  </label>
                  <label className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-babgray-200 rounded-2xl text-sm text-babgray-500 cursor-pointer overflow-hidden">
                    {storeFile
                      ? renderPreview(storeFile)
                      : '파일을 클릭하여 업로드 (JPG, PNG, SVG, WEBP / 최대 5MB)'}
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.svg,.webp"
                      onChange={e => handleSingleFileChange(e, setStoreFile, 'image')}
                    />
                  </label>
                </div>
              </div>
            </section>

            {/* 약관 동의 */}
            <section className="w-80 flex flex-col gap-3">
              <p className="text-gray-700 text-sm font-medium">이용 약관</p>

              {/* 전체 동의 */}
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <span className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                     checked:border-[#FF5722] checked:bg-[#FF5722]
                     flex-shrink-0 transition-colors cursor-pointer"
                  />
                  <RiCheckLine className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm text-gray-700">전체 동의</span>
              </label>

              {/* 개별 동의들 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={() => toggleOne('terms')}
                    className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                     checked:border-[#FF5722] checked:bg-[#FF5722]
                     flex-shrink-0 transition-colors cursor-pointer"
                  />
                  <RiCheckLine className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm">
                  <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                  <span className="text-gray-700">서비스 이용약관에 동의합니다</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="relative">
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={() => toggleOne('privacy')}
                    className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                     checked:border-[#FF5722] checked:bg-[#FF5722]
                     flex-shrink-0 transition-colors cursor-pointer"
                  />
                  <RiCheckLine className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm">
                  <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                  <span className="text-gray-700">개인정보 처리방침에 동의합니다</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="relative">
                  <input
                    type="checkbox"
                    checked={agreements.approval}
                    onChange={() => toggleOne('approval')}
                    className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                     checked:border-[#FF5722] checked:bg-[#FF5722]
                     flex-shrink-0 transition-colors cursor-pointer"
                  />
                  <RiCheckLine className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm">
                  <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                  <span className="text-gray-700">신청 후 승인까지 2~3일 정도 소요됩니다</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="relative">
                  <input
                    type="checkbox"
                    checked={agreements.marketing}
                    onChange={() => toggleOne('marketing')}
                    className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                     checked:border-[#FF5722] checked:bg-[#FF5722]
                     flex-shrink-0 transition-colors cursor-pointer"
                  />
                  <RiCheckLine className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm text-gray-700">
                  <span className="text-gray-500">(선택)</span> 마케팅 정보 수신에 동의합니다
                </span>
              </label>
            </section>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 h-14 border border-babgray-300 rounded-lg font-bold text-babgray-600 disabled:opacity-60"
              onClick={saveDraft}
              disabled={submitting}
            >
              임시저장
            </button>
            <button
              type="submit"
              className="flex-1 h-14 bg-bab text-white rounded-lg font-bold disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? '신청 중...' : '신청하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PartnerSignupPage;
