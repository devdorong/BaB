function TermsofServicePage() {
  return (
    <div className="w-full font-normal text-base sm:text-lg bg-bg-bg">
      <div className="w-full max-w-[1280px] mx-auto py-10 sm:py-16 px-5 sm:px-10 flex flex-col gap-8">
        <div className="font-bold text-2xl sm:text-4xl">
          <p>BaB 이용약관</p>
        </div>

        <div className="flex flex-col gap-10">
          {/* 제1조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제1조 (목적)</p>
            <p>
              본 약관은 BaB(이하 "서비스")가 제공하는 식사 매칭 플랫폼 서비스의 이용과 관련하여,
              회사와 회원 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제2조 (정의)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>"회원"이라 함은 본 약관에 동의하고 서비스 이용계약을 체결한 자를 말합니다.</li>
              <li>
                "파트너"라 함은 가맹점, 사업자 등 서비스 내 제휴 형태로 참여하는 자를 말합니다.
              </li>
              <li>"관리자"라 함은 회원·파트너의 서비스 이용을 관리하는 운영자를 의미합니다.</li>
              <li>"매칭"이란, 회원 간 혹은 회원과 파트너 간의 식사 동행 연결을 의미합니다.</li>
            </ol>
          </section>

          {/* 제3조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제3조 (약관의 효력 및 변경)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>본 약관은 회원이 동의함과 동시에 효력이 발생합니다.</li>
              <li>
                회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시
                공지합니다.
              </li>
            </ol>
          </section>

          {/* 제4조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제4조 (회원 가입 및 관리)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>회원 가입은 서비스가 정한 절차에 따라 이루어집니다.</li>
              <li>
                회원은 가입 시 정확한 정보를 기재해야 하며, 허위 정보 입력으로 인한 불이익은
                본인에게 있습니다.
              </li>
              <li>관리자는 부적절한 이용 행위가 발견될 경우 서비스 이용을 제한할 수 있습니다.</li>
            </ol>
          </section>

          {/* 제5조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제5조 (서비스의 제공 및 변경)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>회사는 회원에게 위치 기반 매칭, 커뮤니티, 이벤트 등 다양한 기능을 제공합니다.</li>
              <li>서비스 내용은 운영상 필요에 따라 추가·변경될 수 있습니다.</li>
            </ol>
          </section>

          {/* 제6조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제6조 (회원의 의무)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>회원은 관련 법령, 본 약관, 서비스 운영정책을 준수해야 합니다.</li>
              <li>회원은 타인의 권리를 침해하거나 부적절한 행위를 해서는 안 됩니다.</li>
            </ol>
          </section>

          {/* 제7조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제7조 (서비스 이용 제한 및 해지)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                회원이 본 약관을 위반하거나 법령을 위반하는 경우 서비스 이용이 제한될 수 있습니다.
              </li>
              <li>
                회원은 언제든지 탈퇴를 요청할 수 있으며, 탈퇴 시 개인정보는 개인정보처리방침에 따라
                처리됩니다.
              </li>
            </ol>
          </section>

          {/* 제8조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제8조 (면책조항)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                회사는 회원 간 발생한 개인적 분쟁에 개입하지 않으며, 이에 대한 책임을 지지 않습니다.
              </li>
              <li>
                천재지변, 시스템 오류, 제3자 해킹 등 불가항력 사유로 인한 서비스 장애에 대해서는
                책임을 지지 않습니다.
              </li>
            </ol>
          </section>

          {/* 제9조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제9조 (관할 법원 및 준거법)</p>
            <p>
              본 약관에 관한 분쟁은 대한민국 법률에 따라 해석되며, 관할 법원은 회사의 본사 소재지
              법원으로 합니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsofServicePage;
