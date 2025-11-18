import { useEffect } from 'react';

function YouthPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full font-normal text-base sm:text-lg bg-bg-bg">
      <div className="w-full max-w-[1280px] mx-auto py-10 sm:py-16 px-5 sm:px-10 flex flex-col gap-8">
        <div className="font-bold text-2xl sm:text-4xl">
          <p>청소년 보호 정책</p>
        </div>

        <div className="flex flex-col gap-10">
          {/* 1조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제1조 (목적)</p>
            <p>
              BaB(이하 “회사”)는 청소년이 유해한 환경으로부터 보호받고 안전하게 서비스를 이용할 수
              있도록 청소년 보호 정책을 수립하고 시행합니다.
            </p>
          </section>

          {/* 2조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제2조 (청소년 보호 원칙)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>청소년 유해 게시물 및 유해 매칭의 차단 조치</li>
              <li>욕설·폭력·음란·사기 등 불건전 행위에 대한 모니터링</li>
              <li>신고 시스템 운영 및 신속한 처리</li>
              <li>유해 이용자에 대한 서비스 제한·제재 조치</li>
            </ol>
          </section>

          {/* 3조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제3조 (유해 행위 및 콘텐츠 차단)</p>
            <p>
              회사는 아래와 같은 청소년 유해 콘텐츠나 행위 발생 시 게시물 삭제, 경고, 서비스 이용
              제한 등의 조치를 취합니다.
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>도박·폭력·음란 등 불법 또는 유해한 내용</li>
              <li>성적 접근, 만남 강요 등 청소년에게 위험한 행위</li>
              <li>불법 촬영 또는 사기 행위 등 범죄성 메시지</li>
            </ol>
          </section>

          {/* 4조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제4조 (청소년 보호 조치)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>청소년 개인정보를 법령에 따라 안전하게 관리합니다.</li>
              <li>연령 확인이 필요한 경우 본인 인증 절차를 요청할 수 있습니다.</li>
              <li>
                청소년이 접근하기 부적절한 기능·게시물에 대해 사전·사후적 차단 조치를 적용합니다.
              </li>
            </ol>
          </section>

          {/* 5조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제5조 (신고 및 대응 절차)</p>
            <p>
              이용자는 서비스 내 신고 기능을 사용하여 유해 행위를 신고할 수 있으며, 회사는 신고 접수
              시 즉시 사실 확인 후 필요한 조치를 진행합니다.
            </p>
          </section>

          {/* 6조 */}
          <section className="flex flex-col gap-2 pb-10">
            <p className="font-bold text-xl sm:text-2xl">제6조 (청소년 보호 책임자)</p>
            <p>
              청소년 보호를 위해 회사는 아래와 같이 청소년 보호 책임자를 지정합니다.
              <br /> 담당자: BaB 서비스 운영팀
              <br /> 연락처: contact@bab.app
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default YouthPolicyPage;
