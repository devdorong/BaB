import { useState } from 'react';
import { InputField, InputFieldWithButton } from '../components/InputField';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { RiArrowDownSLine } from 'react-icons/ri';

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
  const handleSubmit = () => {};
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

  return (
    <div className="w-full py-24 bg-gray-50 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-sm w-[1185px] px-12 py-10 flex flex-col gap-14">
        {/* 제목 */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">파트너 신청서</h1>
          <p className="text-babgray-600">BaB 플랫폼의 파트너가 되어 더 많은 고객과 만나보세요.</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
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
                <div className="relative w-[50%] flex items-center">
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

                <div className="flex flex-col w-[50%] gap-2">
                  <label htmlFor="price" className="text-sm font-medium text-babgray-700">
                    가격대 <span className="text-bab">*</span>
                  </label>
                  <input
                    id="price"
                    type="text"
                    placeholder="예: 5,000원 ~ 15,000원"
                    className="w-full h-12 px-4 border border-babgray-300 rounded-3xl focus:outline-none focus:border-bab"
                  />
                </div>
              </div>

              {/* 매장 소개 */}
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="description" className="text-sm font-medium text-babgray-700">
                  매장 소개 <span className="text-bab">*</span>
                </label>
                <textarea
                  id="description"
                  placeholder="대표 메뉴와 업체의 특징을 소개해주세요"
                  className="w-full h-32 px-4 py-3 border border-babgray-300 rounded-3xl focus:outline-none focus:border-bab resize-none"
                />
                <p className="text-xs text-babgray-500">최대 500자까지 입력 가능합니다</p>
              </div>
            </section>

            {/* 서류 업로드 */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">서류 업로드</h2>
              <hr className="border-babgray-150" />

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-babgray-700">
                    사업자등록증 <span className="text-bab">*</span>
                  </label>
                  <div className="h-40 flex items-center justify-center border-2 border-dashed border-babgray-200 rounded-2xl text-sm text-babgray-500">
                    파일을 드래그하거나 클릭하여 업로드 (JPG, PNG, PDF / 최대 5MB)
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-babgray-700">
                    메뉴판 이미지 <span className="text-bab">*</span>
                  </label>
                  <div className="h-40 flex items-center justify-center border-2 border-dashed border-babgray-200 rounded-2xl text-sm text-babgray-500">
                    파일을 드래그하거나 클릭하여 업로드 (JPG, PNG, PDF / 최대 5MB)
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-babgray-700">매장 사진 (선택사항)</label>
                <div className="h-40 flex items-center justify-center border-2 border-dashed border-babgray-200 rounded-2xl text-sm text-babgray-500">
                  매장 내외부 사진을 업로드해주세요 (JPG, PNG, PDF / 최대 5MB)
                </div>
              </div>
            </section>

            {/* 약관 동의 */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">약관 동의</h2>
              <hr className="border-babgray-150" />

              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-5 h-5 border border-babgray-300 rounded" />
                  서비스 이용약관에 동의합니다 <span className="text-bab">*</span>
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-5 h-5 border border-babgray-300 rounded" />
                  개인정보 처리방침에 동의합니다 <span className="text-bab">*</span>
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-5 h-5 border border-babgray-300 rounded" />
                  신청 후 승인까지 2~3일 정도 소요됩니다 <span className="text-bab">*</span>
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-5 h-5 border border-babgray-300 rounded" />
                  마케팅 정보 수신에 동의합니다 (선택)
                </label>
              </div>
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
