import { useState } from 'react';
import { createProfile } from '../lib/propile';
import { supabase } from '../lib/supabase';
import type { ProfileInsert } from '../types/bobType';
import { LogoMd } from '../ui/Ui';

function MemberSignupPage() {
  // ts
  // const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState(true);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('이메일을 입력하세요.');
      return;
    }
    if (!pw.trim()) {
      alert('비밀번호를 입력하세요.');
      return;
    }
    if (pw.length < 6) {
      alert('비밀번호를 입력하세요.');
      return;
    }
    if (!nickName.trim()) {
      alert('닉네임을 입력하세요.');
      return;
    }

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
    setMsg(`회원가입 성공했습니다. 이메일 인증 링크를 확인해 주세요`);
  };

  // tsx
  return (
    <div>
      <div>
        <LogoMd />
        <div>
          <h2>BaB에 오신 걸 환영합니다!</h2>
          <p>함께 식사할 친구를 찾기 위해 정보를 입력해주세요</p>
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>이름</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="이름을 입력해주세요"
            />
          </div>
          <div>
            <label>닉네임</label>
            <input
              type="text"
              value={nickName}
              onChange={e => setNickName(e.target.value)}
              required
              placeholder="닉네임을 입력해주세요"
            />
          </div>
          <div>
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="이메일을 입력해주세요"
            />
          </div>
          <div>
            <label>비밀번호</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
              placeholder="비밀번호를 입력해주세요"
            />
          </div>
          <div>
            <label>비밀번호</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
              placeholder="비밀번호를 입력해주세요"
            />
          </div>
          <div>
            <label>휴대폰 번호</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              placeholder="번호를 입력해주세요"
            />
          </div>
          <div>
            <label>생년월일</label>
            <input
              type="date"
              value={birth}
              onChange={e => setBirth(e.target.value)}
              required
              placeholder="생년월일"
            />
          </div>
          <div>
            <label htmlFor="gender">성별</label>
            <div>
              <input
                type="radio"
                id="male"
                name="gender"
                value="true"
                checked={gender === true}
                onChange={() => setGender(true)}
              />
              <label htmlFor="male">남성</label>
            </div>

            <div>
              <input
                type="radio"
                id="female"
                name="gender"
                value="false"
                checked={gender === false}
                onChange={() => setGender(false)}
              />
              <label htmlFor="female">여성</label>
            </div>
          </div>
          <button type="submit">회원가입</button>
        </form>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}

export default MemberSignupPage;
