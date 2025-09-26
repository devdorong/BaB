import { useState } from 'react';
import { InputField, InputFieldWithButton, TextAreaCustom } from '../components/InputField';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { RiArrowDownSLine, RiCheckLine } from 'react-icons/ri';

const categorys = ['한식', '양식', '일식', '중식', '아시안', '인도', '멕시칸'];

function PartnerSignupPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [email, setEmail] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [restaurantname, setRestaurantname] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [storeIntro, setStoreIntro] = useState('');
  const handleSubmit = () => {};
  const [businessFile, setBusinessFile] = useState<File | null>(null);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [storeFiles, setStoreFiles] = useState<File[]>([]);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    approval: false,
    marketing: false,
  });
  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // 숫자만 남기기

    if (value.length <= 3) {
      // 3자리 이하
      setBusinessNumber(value);
    } else if (value.length <= 5) {
      // 3-2
      setBusinessNumber(`${value.slice(0, 3)}-${value.slice(3)}`);
    } else {
      // 3-2-5
      setBusinessNumber(`${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5, 10)}`);
    }
  };

  // Daum Post 팝업
  const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(scriptUrl);

  const handleCompletedZip = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '')
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setAddress(fullAddress);
  };

  const handleClickZipCode = () => {
    open({ onComplete: handleCompletedZip });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // 숫자만 남기기

    if (value.length < 4) {
      // 3자리 이하
      setPhone(value);
    } else if (value.length < 8) {
      // 3-3~4
      setPhone(`${value.slice(0, 3)}-${value.slice(3)}`);
    } else {
      // 3-4-4
      setPhone(`${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`);
    }
  };

  const validateFile = (file: File, type: 'pdf' | 'image') => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (type === 'pdf' && file.type !== 'application/pdf') {
      alert('사업자등록증은 PDF 파일만 업로드 가능합니다.');
      return false;
    }
    if (type === 'image' && !imageTypes.includes(file.type)) {
      alert('허용된 이미지 형식만 업로드 가능합니다: JPG, PNG, SVG, WEBP');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하만 가능합니다.');
      return false;
    }
    return true;
  };

  const handleSingleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    type: 'pdf' | 'image',
  ) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file, type)) {
      setter(file);
    }
  };
  const handleMultipleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File[]>>,
    type: 'image',
  ) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => validateFile(file, type));
    setter(prev => [...prev, ...validFiles]);
  };

  // 미리보기
  const renderPreview = (file: File) => {
    if (file.type === 'application/pdf') {
      return <p className="text-xs text-babgray-600">{file.name}</p>;
    }
    return (
      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
    );
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
                {/* 아이디 */}
                <InputField
                  label="아이디"
                  type="text"
                  value={id}
                  onChange={e => setId(e.target.value)}
                  placeholder="아이디을 입력해주세요"
                  required
                />

                {/* 비밀번호 */}
                <InputField
                  label="비밀번호"
                  type="password"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  required
                />
              </div>

              {/* 이메일 */}
              <InputFieldWithButton
                label="이메일"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요"
                required
                children="인증번호 전송"
              />

              {/* 사업자등록번호 + 업체명 */}
              <div className="  flex gap-7">
                {/* 사업자 등록 번호 */}
                <InputField
                  label="사업자 등록 번호"
                  type="text"
                  value={businessNumber}
                  onChange={handleBusinessChange}
                  placeholder="사업자 등록 번호를 입력해주세요"
                  required
                />

                <InputField
                  label="업체명"
                  type="text"
                  value={restaurantname}
                  onChange={e => setRestaurantname(e.target.value)}
                  placeholder="업체명을 입력해주세요"
                  required
                />
              </div>

              {/* 업체 주소 */}
              <InputFieldWithButton
                label="업체 주소"
                type="text"
                value={address}
                onChange={() => {}}
                onButtonClick={handleClickZipCode}
                placeholder="업체 주소 입력해주세요"
                required
                children="주소 검색"
              />

              {/* 대표자명 + 연락처 */}
              <div className="flex gap-7">
                <InputField
                  label="대표자명"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="대표자명 입력해주세요"
                  required
                />
                {/* 휴대폰 번호 */}
                <InputField
                  label="휴대폰 번호"
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="번호를 입력해주세요"
                  required
                />
              </div>
            </section>

            {/* 운영 정보 */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">운영 정보</h2>
              <hr className="border-babgray-150" />

              <div className="flex gap-7">
                <div className="relative  flex flex-col w-[50%] justify-center gap-[9px] ">
                  <div className="flex gap-1">
                    <label>카테고리</label>
                    <span className="text-bab-500">*</span>
                  </div>
                  <div className="flex items-center relative">
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      required
                      className="w-full h-[50px] rounded-[25px] border border-gray-300 px-3 pr-10 text-gray-400 focus:outline-none focus:ring-2 focus:ring-bab-500 appearance-none"
                    >
                      <option value="">카테고리</option>
                      {categorys.map(y => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <RiArrowDownSLine color="#C2C2C2" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-[50%] gap-2">
                  {/* 대표자명 + 연락처 */}
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

              {/* 매장 소개 */}
              <div className="flex flex-col w-full gap-2">
                <TextAreaCustom
                  label="매장 소개"
                  value={storeIntro}
                  onChange={e => setStoreIntro(e.target.value)}
                  placeholder="대표 메뉴와 업체의 특징을 소개해주세요"
                  maxLength={500}
                  required
                />
                <p className="text-xs text-babgray-500 text-right">{storeIntro.length}/500</p>
              </div>
            </section>

            {/* 서류 업로드 */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">서류 업로드</h2>
              <hr className="border-babgray-150" />

              <div className="grid grid-cols-2 gap-6">
                {/* 사업자등록증 */}
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

                {/* 메뉴판 이미지 */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-1 text-gray-700 font-medium">
                    메뉴판 이미지 <span className="text-bab-500">*</span>
                  </label>
                  <label className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-babgray-200 rounded-2xl text-sm text-babgray-500 cursor-pointer overflow-hidden">
                    {menuFile
                      ? renderPreview(menuFile)
                      : '파일을 클릭하여 업로드 (JPG, PNG, SVG, WEBP / 최대 5MB)'}
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.svg,.webp"
                      onChange={e => handleSingleFileChange(e, setMenuFile, 'image')}
                    />
                  </label>
                </div>
              </div>

              {/* 매장 사진 */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1 text-gray-700 font-medium">
                  매장 사진 (선택사항)
                </label>
                <label className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-babgray-200 rounded-2xl text-sm text-babgray-500 cursor-pointer overflow-hidden">
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.svg,.webp"
                    multiple
                    onChange={e => handleMultipleFileChange(e, setStoreFiles, 'image')}
                  />
                  {storeFiles.length > 0 ? (
                    <div className="grid grid-cols-8 gap-2 p-[28px] w-full max-h-[400px] overflow-y-auto">
                      {storeFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="w-[100px] h-[100px] flex items-center justify-center border rounded-lg overflow-hidden"
                        >
                          {renderPreview(file)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    '매장 내외부 사진을 업로드해주세요 (JPG, PNG, SVG, WEBP / 최대 5MB)'
                  )}
                </label>
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
                  <RiCheckLine className="absolute text-white text-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm text-gray-700">전체 동의</span>
              </label>

              {/* 이용약관 */}
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
                  <RiCheckLine className="absolute text-white text-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm">
                  <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                  <span className="text-gray-700">서비스 이용약관에 동의합니다</span>
                </span>
              </label>

              {/* 개인정보 */}
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
                  <RiCheckLine className="absolute text-white text-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm">
                  <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                  <span className="text-gray-700">개인정보 처리방침에 동의합니다</span>
                </span>
              </label>

              {/* 승인 안내 */}
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
                  <RiCheckLine className="absolute text-white text-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm">
                  <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                  <span className="text-gray-700">신청 후 승인까지 2~3일 정도 소요됩니다</span>
                </span>
              </label>

              {/* 마케팅 */}
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
                  <RiCheckLine className="absolute text-white text-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm text-gray-700">
                  <span className="text-gray-500">(선택)</span> 마케팅 정보 수신에 동의합니다
                </span>
              </label>
            </section>
          </div>
          {/* 버튼 */}
          <div className="flex gap-4">
            <button className="flex-1 h-14 border border-babgray-300 rounded-lg font-bold text-babgray-600">
              임시저장
            </button>
            <button className="flex-1 h-14 bg-bab text-white rounded-lg font-bold">신청하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PartnerSignupPage;
