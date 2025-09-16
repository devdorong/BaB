function PersonalPolicyPage() {
  return (
    <div className="w-full font-normal text-lg bg-bg-bg">
      <div className="w-[1280px] mx-auto py-16 px-10 flex flex-col gap-12">
        <div className="font-bold text-4xl">
          <p>BaB 개인정보처리방침</p>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-bold text-2xl">1. 수집하는 개인정보 항목</p>
            </div>
            <div>
              <p className="font-bold text-xl">
                회사는 회원 가입 및 서비스 제공을 위해 아래 정보를 수집합니다.
              </p>
            </div>
            <ul className="list-disc list-inside text-babgray-700">
              <li>필수: 이름, 닉네임, 이메일, 비밀번호, 성별, 생년월일</li>
              <li>선택: 휴대폰 번호, 관심사, 위치 정보</li>
              <li>자동 수집: 접속 로그, 쿠키, 기기 정보</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-2xl">2. 개인정보의 수집 및 이용 목적</p>
            <ul className="list-disc list-inside text-babgray-700">
              <li>회원 식별 및 본인 인증</li>
              <li>매칭 서비스 제공</li>
              <li>이벤트 및 커뮤니티 운영</li>
              <li>고객 문의 처리 및 공지 전달</li>
              <li>부정 이용 방지 및 안전한 서비스 제공</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-2xl">3. 개인정보의 보관 및 이용 기간</p>
            <ul className="list-disc list-inside text-babgray-700">
              <p>회원 탈퇴 시 즉시 파기</p>
              <p>단, 관계 법령에 따라 일정 기간 보관해야 하는 경우 해당 기간 동안 보관 후 파기</p>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-2xl">4. 개인정보 제3자 제공</p>
            <div>
              <p>회사는 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다.</p>
              <p>다만, 회원 동의가 있거나 법령에 따라 필요한 경우 제공할 수 있습니다.</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-2xl">5. 개인정보 처리 위탁</p>
            <p>
              서비스 운영을 위해 필요한 경우 일부 업무를 외부 업체에 위탁할 수 있으며, 이 경우 위탁
              사실을 공지합니다.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-2xl">6. 개인정보 보호 조치</p>
            <ul className="list-disc list-inside text-babgray-700">
              <li>개인정보 암호화 저장</li>
              <li>접근 권한 최소화</li>
              <li>보안 프로그램 설치 및 정기 점검</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-2xl">7. 이용자의 권리</p>
            <p>회원은 언제든지 자신의 개인정보를 열람·수정·삭제·처리정지 요구할 수 있습니다.</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-2xl">8. 문의처</p>
            <p>
              개인정보 관련 문의는 서비스 고객센터 또는 관리자 이메일을 통해 접수할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalPolicyPage;
