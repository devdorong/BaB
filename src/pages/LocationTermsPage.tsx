import { useEffect } from 'react';

function LocationTermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full font-normal text-base sm:text-lg bg-bg-bg">
      <div className="w-full max-w-[1280px] mx-auto py-10 sm:py-16 px-5 sm:px-10 flex flex-col gap-8">
        <div className="font-bold text-2xl sm:text-4xl">
          <p>위치기반서비스 이용약관</p>
        </div>

        <div className="flex flex-col gap-10">
          {/* 제1조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제1조 (목적)</p>
            <p>
              본 약관은 BaB(이하 “회사”)가 제공하는 위치기반서비스의 이용과 관련하여, 회사와 이용자
              간 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제2조 (용어의 정의)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>“위치정보”란 개인 또는 기기의 위치를 나타내는 정보를 의미합니다.</li>
              <li>“개인위치정보주체”란 해당 개인위치정보의 정보주체를 말합니다.</li>
              <li>
                “위치기반서비스”란 위치정보를 활용하여 제공되는 각종 매칭·추천 서비스를 의미합니다.
              </li>
            </ol>
          </section>

          {/* 제3조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제3조 (서비스 내용)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>주변 식당 또는 매칭 정보 제공</li>
              <li>이용자 위치 기반 거리 계산 및 추천 기능 제공</li>
              <li>만남 장소 안내 등 위치 기반 정보 제공 서비스</li>
            </ol>
          </section>

          {/* 제4조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제4조 (위치정보의 이용 및 보유)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>회사는 이용자의 동의 범위 내에서 위치정보를 이용합니다.</li>
              <li>서비스 제공 목적 달성 후 즉시 위치정보는 파기합니다.</li>
              <li>이용자는 언제든 동의를 철회할 수 있습니다.</li>
            </ol>
          </section>

          {/* 제5조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제5조 (위치정보의 제3자 제공)</p>
            <p>
              회사는 법령에 의한 경우를 제외하고 이용자의 개인위치정보를 제3자에게 제공하지
              않습니다.
            </p>
          </section>

          {/* 제6조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제6조 (개인위치정보주체의 권리)</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>위치정보 이용·제공 내역에 대한 열람 또는 통보 요구</li>
              <li>동의 범위 변경 또는 철회</li>
              <li>위치정보 이용·제공 중지 요구</li>
            </ol>
          </section>

          {/* 제7조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제7조 (법정대리인의 권리)</p>
            <p>
              만 14세 미만 아동의 위치정보 이용에 대해서는 법정대리인의 동의를 받으며, 법정대리인은
              아동의 권리를 대신 행사할 수 있습니다.
            </p>
          </section>

          {/* 제8조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제8조 (위치정보 관리책임자)</p>
            <p>
              위치정보의 적절한 관리를 위해 회사는 위치정보관리책임자를 지정합니다.
              <br />
              담당자: BaB 개인정보보호 담당자
              <br />
              연락처: contact@bab.app
            </p>
          </section>

          {/* 제9조 */}
          <section className="flex flex-col gap-2">
            <p className="font-bold text-xl sm:text-2xl">제9조 (손해배상)</p>
            <p>
              회사의 고의 또는 과실로 인해 위치정보가 유출되거나 피해가 발생한 경우, 회사는 관련
              법령에 따라 손해를 배상합니다.
            </p>
          </section>

          {/* 제10조 */}
          <section className="flex flex-col gap-2 pb-10">
            <p className="font-bold text-xl sm:text-2xl">제10조 (준거법 및 분쟁 해결)</p>
            <p>
              본 약관은 대한민국 법률에 따르며, 분쟁 발생 시 위치정보분쟁조정위원회에 조정을 신청할
              수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LocationTermsPage;
