import { RiImageLine } from 'react-icons/ri';
import { ButtonFillMd } from '../../../ui/button';
import { useState } from 'react';

function EditPage() {
  const [nickname, setNickname] = useState('스팸두개');
  const [intro, setIntro] = useState('스팸이 제일 쪼아용');
  const nickMax = 20;
  const introMax = 150;

  // 비밀번호 변경
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPw2, setNewPw2] = useState('');
  return (
    <div className="flex bg-bg-bg ">
      {/* 프로필 헤더 링크 */}
      <div className="flex flex-col w-[1280px] m-auto">
        <div className="flex py-[15px]">
          <div className="text-babgray-600 text-[17px]">프로필</div>
          <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
          <div className="text-babgray-600 text-[17px]">프로필 정보</div>
          <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
          <div className="text-bab-500 text-[17px]">편집</div>
        </div>
        <div className="mt-[20px] mb-[60px]">
          <div className="flex gap-[40px] items-start">
            {/* 왼쪽 프로필 카드 */}
            <div className="flex flex-col gap-[20px] items-center justify-center">
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                {/* 프로필 및 설명 */}
                <div className="gap-[15px] flex flex-col justify-center items-center">
                  <div className="w-[94px] h-[94px] overflow-hidden rounded-full">
                    <img src="https://www.gravatar.com/avatar/?d=mp&s=200" alt="" />
                  </div>
                  <div className="font-medium flex justify-center items-center pt-[25px]">
                    <ButtonFillMd
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
              <section className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
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
                        value={nickname}
                        onChange={e => setNickname(e.target.value.slice(0, nickMax))}
                        className="flex text-babgray-700 outline-none text-[16px] placeholder:text-babgray-400"
                        placeholder="닉네임을 입력하세요"
                      />
                    </div>
                    <div className="text-[12px] text-babgray-400">
                      {nickname.length}/{nickMax}
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
              </section>

              {/* 계정 정보 */}
              <section className="w-full px-[35px] py-[25px] pb-[40px] bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <h2 className="text-babgray-900 text-[18px] font-bold pb-[20px]">계정 정보</h2>

                <div className="mt-6 grid grid-cols-1 gap-[20px] items-center">
                  {/* 아이디 */}
                  <div className="flex flex-col gap-[50px]">
                    <div className="flex justify-between">
                      <div className="text-babgray-700">아이디</div>
                      <div className="text-babgray-800">twospams@gmail.com</div>
                    </div>

                    {/* 이메일 */}
                    <div className="flex justify-between">
                      <div className="text-babgray-700">이메일</div>
                      <div className="text-babgray-800">twospams@gmail.com</div>
                    </div>

                    {/* 전화번호 */}
                    <div className="flex justify-between">
                      <div className="text-babgray-700">전화번호</div>
                      <div className="text-babgray-800">010-**2*-**22</div>
                    </div>

                    {/* 현재 비밀번호 */}
                    <div className="flex justify-between items-center">
                      <div className="text-babgray-700">현재 비밀번호</div>
                      <div className="w-[500px] h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-300 inline-flex items-center">
                        <input
                          type="password"
                          value={curPw}
                          onChange={e => setCurPw(e.target.value)}
                          className="flex-1 text-babgray-700 outline-none text-[16px] placeholder:text-babgray-400"
                          placeholder="현재 비밀번호"
                        />
                      </div>
                    </div>

                    {/* 새 비밀번호 */}
                    <div className="flex justify-between items-center">
                      <div className="text-babgray-700">새 비밀번호</div>
                      <div className="w-[500px] h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-300 inline-flex items-center">
                        <input
                          type="password"
                          value={newPw}
                          onChange={e => setNewPw(e.target.value)}
                          className="w-[500px] text-babgray-700 outline-none text-[16px] placeholder:text-babgray-400"
                          placeholder="새 비밀번호"
                        />
                      </div>
                    </div>

                    {/* 새 비밀번호 확인 */}
                    <div className="flex justify-between items-center">
                      <div className="text-babgray-700">새 비밀번호 확인</div>
                      <div className="w-[500px] h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-300 inline-flex items-center">
                        <input
                          type="password"
                          value={newPw2}
                          onChange={e => setNewPw2(e.target.value)}
                          className="flex-1 text-babgray-700 outline-none text-[16px] placeholder:text-babgray-400"
                          placeholder="새 비밀번호 확인"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 하단 저장 버튼 */}
              <div className="bottom-0 pt-2">
                <button
                  className="w-full h-[46px] rounded-full bg-bab-500 text-white font-semibold shadow-[0_4px_4px_rgba(0,0,0,0.02)]"
                  onClick={() => {
                    // TODO: 저장 로직
                    console.log({ nickname, intro, curPw, newPw, newPw2 });
                  }}
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
