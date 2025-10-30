import { useEffect, useState } from 'react';
import { InputField, InputFieldWithButton } from '../components/InputField';
import { createProfile } from '../lib/propile';
import { supabase } from '../lib/supabase';
import type { ProfileInsert } from '../types/bobType';
import { LogoLg } from '../ui/Ui';
import { RiArrowDownSLine, RiCheckLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useModal } from '@/ui/sdj/ModalState';
import Modal from '@/ui/sdj/Modal';
import { Select } from 'antd';
function MemberSignupPage() {
  // ts
  // const { signUp } = useAuth();
  const { Option } = Select;
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [phone, setPhone] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [days, setDays] = useState<number[]>([]);
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState(true);
  const [msg, setMsg] = useState('');
  const { closeModal, modal, openModal } = useModal();
  const navigate = useNavigate();
  // 이용 약관
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);

  const [isCheckingNick, setIsCheckingNick] = useState(false);
  const [isNickAvailable, setIsNickAvailable] = useState<boolean | null>(null);

  const allChecked = Object.values(agreements).every(Boolean);
  const toggleAll = () => {
    const newValue = !allChecked;
    setAgreements({
      terms: newValue,
      privacy: newValue,
      marketing: newValue,
    });
  };

  const toggleOne = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 현재 년도 기준 리스트
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 윤년 체크 함수
  const isLeapYear = (y: number) => {
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  };

  // 월/년도 바뀔 때 → 일수 갱신
  useEffect(() => {
    if (!year || !month) return;

    const y = parseInt(year, 10);
    const m = parseInt(month, 10);

    let maxDays = 31;
    if ([4, 6, 9, 11].includes(m)) {
      maxDays = 30;
    } else if (m === 2) {
      maxDays = isLeapYear(y) ? 29 : 28;
    }

    setDays(Array.from({ length: maxDays }, (_, i) => i + 1));

    // 현재 선택된 day가 maxDays보다 크면 초기화
    if (day && parseInt(day, 10) > maxDays) {
      setDay('');
    }
  }, [year, month]);

  // year, month, day가 바뀌면 birth 조합
  useEffect(() => {
    if (year && month && day) {
      const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      setBirth(birthDate);
    }
  }, [year, month, day]);

  // 이메일 중복 체크
  const handleCheckEmail = async () => {
    if (!email.trim()) return setMsg('이메일을 입력하세요.');

    const { data, error } = await supabase
      .from('profiles_with_email')
      .select('email')
      .eq('email', email)
      .maybeSingle(); // 1건만 반환

    if (error) {
      console.error('이메일 확인 중 오류:', error.message);
      setMsg('이메일 확인 중 오류가 발생했습니다.');
      return;
    }

    if (data) {
      setIsEmailAvailable(false);
      setMsg('이미 가입된 이메일입니다.');
    } else {
      setIsEmailAvailable(true);
      setMsg('사용 가능한 이메일입니다.');
    }
  };

  // 닉네임 중복 체크
  const handleCheckNick = async () => {
    if (!nickName.trim()) {
      setMsg('닉네임을 입력하세요.');
      return;
    }

    setIsCheckingNick(true);
    setIsNickAvailable(null);

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('nickname', nickName)
      .maybeSingle();

    setIsCheckingNick(false);

    if (error) {
      console.error('닉네임 중복체크 오류:', error.message);
      setMsg('닉네임 확인 중 오류가 발생했습니다.');
      return;
    }

    if (data) {
      setIsNickAvailable(false);
      setMsg('이미 사용 중인 닉네임입니다.');
    } else {
      setIsNickAvailable(true);
      setMsg('사용 가능한 닉네임입니다.');
    }
  };

  const validateForm = () => {
    if (!email.trim()) return '이메일을 입력하세요.';
    if (!pw.trim()) return '비밀번호를 입력하세요.';
    if (pw.length < 6) return '비밀번호는 6자 이상 입력하세요.';
    if (pw !== confirmPw) return '비밀번호와 확인 비밀번호가 일치하지 않습니다.';
    if (!nickName.trim()) return '닉네임을 입력하세요.';
    if (!birth) return '생년월일을 선택하세요.';
    if (isEmailAvailable === false) return '이미 가입된 이메일입니다.';
    if (isNickAvailable === false) return '이미 사용 중인 닉네임입니다.';
    if (isEmailAvailable !== true || isNickAvailable !== true)
      return '이메일과 닉네임 중복 확인을 완료해주세요.';
    if (!agreements.terms || !agreements.privacy)
      return '필수 약관에 모두 동의해야 신청이 가능합니다.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      openModal('입력 오류', errorMsg, '닫기', '확인', () => closeModal());
      return;
    }

    try {
      // 회원가입만 진행 (프로필 생성은 ConfirmPage에서)
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pw,
        options: {
          data: {
            name,
            nickName,
            phone,
            gender,
            birth,
            needsProfileCreation: true, // ✅ 플래그 설정
          },
          // ✅ 반드시 ConfirmPage로 리다이렉트
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        setMsg(`회원가입 오류 : ${error.message}`);
        return;
      }

      // ✅ 성공 메시지만 표시 (프로필 생성은 이메일 인증 후)
      setMsg('회원가입에 성공했습니다. 이메일 인증 링크를 눌러 회원가입을 완료해주세요.');
    } catch (err) {
      console.error('회원가입 처리 중 오류:', err);
      setMsg('회원가입 처리 중 오류가 발생했습니다.');
    }
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

  useEffect(() => {
    if (msg) {
      const isSuccess = msg.includes('회원가입에 성공했습니다');

      if (isSuccess) {
        openModal(
          '회원가입 완료',
          `${email} 주소로 인증 메일을 보냈습니다.\n메일함을 열어 인증을 완료해주세요.`,
          '닫기',
          '메일함 열기',
          () => {
            // 이메일 도메인에 따라 자동 이동
            const domain = email.split('@')[1];
            let mailUrl = '';

            if (domain.includes('gmail')) mailUrl = 'https://mail.google.com/';
            else if (domain.includes('naver')) mailUrl = 'https://mail.naver.com/';
            else if (domain.includes('daum')) mailUrl = 'https://mail.daum.net/';
            else if (domain.includes('kakao')) mailUrl = 'https://mail.kakao.com/';
            else mailUrl = `https://tmailor.com/ko/`; // 기본값 임시이메일생성

            window.open(mailUrl, '_blank');
            closeModal();
            navigate('/');
          },
        );
      } else {
        // 일반 알림 모달
        openModal(msg.includes('가능') ? '중복확인' : '중복확인', msg, '', '확인', () => {
          closeModal();
        });
      }
      setMsg('');
    }
  }, [msg]);

  // tsx
  return (
    <div className="min-h-screen bg-bg-bg flex flex-col justify-center items-center px-4 sm:px-6 py-16">
      {/* 상단 로고 및 안내문 */}
      <div className="flex flex-col justify-center items-center gap-10 w-full max-w-[530px] text-center">
        <div className="flex flex-col justify-center items-center gap-8">
          {/* 반응형 로고 */}
          <div
            onClick={e => navigate(`/member`)}
            className="transform transition-transform duration-300 scale-90 sm:scale-100 max-w-[200px] sm:max-w-none mx-auto cursor-pointer"
          >
            <LogoLg />
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-black text-2xl sm:text-3xl font-bold">BaB에 오신 걸 환영합니다!</h2>
            <p className="text-babgray-600 text-sm sm:text-base">
              함께 식사할 친구를 찾기 위해 정보를 입력해주세요
            </p>
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="w-full max-w-[426px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <InputField
              label="이름"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              required
            />

            <InputFieldWithButton
              label="닉네임"
              type="text"
              value={nickName}
              onChange={e => setNickName(e.target.value)}
              placeholder="닉네임을 입력해주세요"
              required
              onButtonClick={handleCheckNick}
              children={isCheckingNick ? '확인 중...' : '중복 체크'}
            />

            <InputFieldWithButton
              label="이메일"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
              required
              onButtonClick={handleCheckEmail}
              children={isCheckingEmail ? '확인 중...' : '중복 체크'}
            />

            <InputField
              label="비밀번호"
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              required
            />

            <InputField
              label="비밀번호 확인"
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="비밀번호를 다시 입력해주세요"
              required
            />

            <InputField
              label="휴대폰 번호"
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="번호를 입력해주세요"
              required
            />

            {/* 생년월일 */}
            <div className="flex flex-col gap-6">
              <label className="flex items-center gap-1 text-gray-700 font-medium">
                생년월일 <span className="text-bab-500">*</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {/* 년 */}
                <div className="flex-1">
                  <Select
                    value={year || '년도'}
                    onChange={value => setYear(value)}
                    suffixIcon={null}
                    className="bab-select w-full flex items-center justify-center"
                    classNames={{
                      popup: {
                        root: 'bab-select-dropdown',
                      },
                    }}
                  >
                    <Option value="">년도</Option>
                    {years.map(y => (
                      <Option key={y} value={String(y)}>
                        {y}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* 월 */}
                <div className="flex-1">
                  <Select
                    value={month || '월'}
                    onChange={value => setMonth(String(value))}
                    suffixIcon={null}
                    className="bab-select w-full flex items-center justify-center"
                    classNames={{
                      popup: {
                        root: 'bab-select-dropdown',
                      },
                    }}
                  >
                    <Option value="">월</Option>
                    {months.map(m => (
                      <Option key={m} value={String(m)}>
                        {m}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* 일 */}
                <div className="flex-1">
                  <Select
                    value={day || '일'}
                    onChange={value => setDay(String(value))}
                    suffixIcon={null}
                    className="bab-select w-full flex items-center justify-center"
                    classNames={{
                      popup: {
                        root: 'bab-select-dropdown',
                      },
                    }}
                  >
                    <Option value="">일</Option>
                    {days.map(d => (
                      <Option key={d} value={String(d)}>
                        {d}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* 성별 */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1 text-gray-700 font-medium">
                성별 <span className="text-bab-500">*</span>
              </label>
              <div className="flex gap-6 flex-wrap">
                <label htmlFor="male" className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="true"
                    checked={gender === true}
                    onChange={() => setGender(true)}
                    className="appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded-full checked:border-[#FF5722] checked:border-4 transition-colors"
                  />
                  <span className="text-gray-700">남성</span>
                </label>

                <label htmlFor="female" className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="false"
                    checked={gender === false}
                    onChange={() => setGender(false)}
                    className="appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded-full checked:border-[#FF5722] checked:border-4 transition-colors"
                  />
                  <span className="text-gray-700">여성</span>
                </label>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="flex flex-col gap-3 mt-2">
              <p className="text-gray-700 text-sm font-medium text-start">약관 동의</p>

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

              {/* 이용약관 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.terms}
                  onChange={() => toggleOne('terms')}
                  className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded checked:bg-[#FF5722] transition-colors"
                />
                <RiCheckLine className="absolute text-white text-lg hidden peer-checked:block pointer-events-none" />
                <span className="text-sm">
                  <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                  <span className="text-gray-700">이용약관에 동의합니다</span>
                </span>
              </label>

              {/* 개인정보 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.privacy}
                  onChange={() => toggleOne('privacy')}
                  className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded checked:bg-[#FF5722] transition-colors"
                />
                <RiCheckLine className="absolute text-white text-lg hidden peer-checked:block pointer-events-none" />
                <span className="text-sm">
                  <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                  <span className="text-gray-700">개인정보 수집 및 이용에 동의합니다</span>
                </span>
              </label>

              {/* 마케팅 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={() => toggleOne('marketing')}
                  className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded checked:bg-[#FF5722] transition-colors"
                />
                <RiCheckLine className="absolute text-white text-lg hidden peer-checked:block pointer-events-none" />
                <span className="text-sm text-gray-700">
                  <span className="text-gray-500">(선택)</span> 마케팅 정보 수신에 동의합니다
                </span>
              </label>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="mt-6 w-full h-[49px] bg-bab-500 rounded-lg text-white font-bold hover:bg-[#BB2D00] transition-colors"
            >
              회원가입
            </button>
          </form>

          {/* 로그인 유도 문구 */}
          <div className="text-sm mt-6 text-center">
            <span className="text-babgray-700">이미 계정이 있으신가요? </span>
            <span
              onClick={() => navigate('/member/login')}
              className="text-bab-500 cursor-pointer hover:underline"
            >
              로그인하기
            </span>
          </div>

          {/* 메시지 출력 */}
          {/* {msg && (
            <p
              className={`mt-4 p-3 rounded-lg text-center border ${
                msg.includes('성공')
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-600'
                  : 'bg-rose-50 text-rose-600 border-rose-600'
              }`}
            >
              {msg}
            </p>
          )} */}
        </div>
      </div>
      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          titleText={modal.title}
          contentText={modal.content}
          closeButtonText={modal.closeText}
          submitButtonText={modal.submitText}
          onSubmit={modal.onSubmit}
        />
      )}
    </div>
  );
}

export default MemberSignupPage;
