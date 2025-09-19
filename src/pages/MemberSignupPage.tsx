import { useEffect, useState } from 'react';
import { InputField, InputFieldWithButton } from '../components/InputField';
import { createProfile } from '../lib/propile';
import { supabase } from '../lib/supabase';
import type { ProfileInsert } from '../types/bobType';
import { LogoLg } from '../ui/Ui';
import { RiArrowDownSLine } from 'react-icons/ri';
function MemberSignupPage() {
  // ts
  // const { signUp } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return alert('이메일을 입력하세요.');
    if (!pw.trim()) return alert('비밀번호를 입력하세요.');
    if (pw.length < 6) return alert('비밀번호는 6자 이상 입력하세요.');
    if (pw !== confirmPw) return alert('비밀번호와 확인 비밀번호가 일치하지 않습니다.');
    if (!nickName.trim()) return alert('닉네임을 입력하세요.');
    if (!birth) return alert('생년월일을 선택하세요.');

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pw,
      options: {
        data: { name, nickName, phone, gender },
      },
    });
    if (error) {
      setMsg(`회원가입 오류 : ${error.message}`);
    } else {
      setMsg('회원가입에 성공했습니다. 이메일 인증 링크를 확인해주세요.');
    }

    if (data.user?.id) {
      // 프로필을 추가한다
      const newUser: ProfileInsert = {
        id: data.user.id,
        nickname: nickName,
        birth,
        name,
        phone,
        gender,
      };
      const result = await createProfile(newUser);
      if (result) {
        // 프로필 추가가 성공한 경우
        setMsg('회원가입 및 프로필 생성 성공했습니다. 이메일 인증 링크를 확인해 주세요');
      } else {
        setMsg(`회원가입은 성공, 하지만, 프로필 생성 실패했습니다`);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // tsx
  return (
    <div className="w-screen min-h-full bg-bg-bg">
      <div className="w-[530px] flex flex-col justify-center items-center gap-[60px] mx-auto py-[100px] ">
        <div className="flex justify-center items-center flex-col gap-[50px] ]">
          <LogoLg />
          <div className="text-center flex flex-col  gap-[12px]">
            <h2 className="text-black text-3xl font-bold">BaB에 오신 걸 환영합니다!</h2>
            <p className="text-babgray-600 text-base ">
              함께 식사할 친구를 찾기 위해 정보를 입력해주세요
            </p>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <InputField
                label="이름"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
                required
              />
              {/* 닉네임 */}
              <InputFieldWithButton
                label="닉네임"
                type="text"
                value={nickName}
                onChange={e => setNickName(e.target.value)}
                placeholder="닉네임을 입력해주세요"
                required
                children="중복 체크"
              />

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

              {/* 비밀번호 */}
              <InputField
                label="비밀번호"
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="비밀번호를 입력해주세요"
                required
              />

              {/* 비밀번호 확인 */}
              <InputField
                label="비밀번호 확인"
                type="password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
                required
              />

              {/* 휴대폰 번호 */}
              <InputFieldWithButton
                label="휴대폰 번호"
                type="text"
                value={phone}
                onChange={handleChange}
                placeholder="번호를 입력해주세요"
                required
                children="인증번호 전송"
              />

              {/* 생년월일 */}

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1 text-gray-700 font-medium">
                  생년월일 <span className="text-bab-500">*</span>
                </label>
                <div className="flex gap-2">
                  {/* 년도 */}
                  <div className="relative flex-1">
                    <select
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      required
                      className="w-full h-[50px] rounded-[20px] border border-gray-300 px-3 pr-10 text-gray-400 focus:outline-none focus:ring-2 focus:ring-bab-500 appearance-none"
                    >
                      <option value="">년도</option>
                      {years.map(y => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <RiArrowDownSLine color="#C2C2C2" />
                    </div>
                  </div>

                  {/* 월 */}
                  <div className="relative flex-1">
                    <select
                      value={month}
                      onChange={e => setMonth(e.target.value)}
                      required
                      className="w-full h-[50px] rounded-[20px] border border-gray-300 px-3 pr-10  text-gray-400 focus:outline-none focus:ring-2 focus:ring-bab-500  appearance-none"
                    >
                      <option value="">월</option>
                      {months.map(m => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <RiArrowDownSLine color="#C2C2C2" />
                    </div>
                  </div>

                  {/* 일 */}
                  <div className="relative flex-1">
                    <select
                      value={day}
                      onChange={e => setDay(e.target.value)}
                      required
                      className="w-full h-[50px] rounded-[20px] border border-gray-300 px-3 pr-10 text-gray-400 focus:outline-none focus:ring-2 focus:ring-bab-500 appearance-none"
                    >
                      <option value="">일</option>
                      {days.map(d => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <RiArrowDownSLine color="#C2C2C2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 성별 */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1 text-gray-700 font-medium">
                  성별 <span className="text-bab-500">*</span>
                </label>
                <div className="flex gap-4">
                  {/* 남성 */}
                  <label htmlFor="male" className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="true"
                      checked={gender === true}
                      onChange={() => setGender(true)}
                      className="appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded-full 
                   checked:border-[#FF5722] checked:bg-none checked:border-4
                   focus:outline-none transition-colors"
                    />
                    <span className="text-gray-700">남성</span>
                  </label>

                  {/* 여성 */}
                  <label htmlFor="female" className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="false"
                      checked={gender === false}
                      onChange={() => setGender(false)}
                      className="appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded-full 
                   checked:border-[#FF5722] checked:bg-none checked:border-4
                   focus:outline-none transition-colors"
                    />
                    <span className="text-gray-700">여성</span>
                  </label>
                </div>
              </div>

              <div className="w-80 flex flex-col gap-3">
                <p className="text-gray-700 text-sm font-medium">약관 동의</p>

                {/* 이용약관 */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                 checked:none checked:border-[#FF5722] 
                 flex-shrink-0 transition-colors"
                  />
                  <span className="text-sm">
                    <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                    <span className="text-gray-700">이용약관에 동의합니다</span>
                  </span>
                </label>

                {/* 개인정보 */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                 checked:none checked:border-[#FF5722] 
                 flex-shrink-0 transition-colors"
                  />
                  <span className="text-sm">
                    <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                    <span className="text-gray-700">개인정보 수집 및 이용에 동의합니다</span>
                  </span>
                </label>

                {/* 마케팅 */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                 checked:none checked:border-[#FF5722] 
                 flex-shrink-0 transition-colors"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="text-gray-500">(선택)</span> 마케팅 정보 수신에 동의합니다
                  </span>
                </label>
              </div>
            </div>

            <button type="submit">회원가입</button>
          </form>
          {msg && <p>{msg}</p>}
        </div>
      </div>
    </div>
  );
}

export default MemberSignupPage;
