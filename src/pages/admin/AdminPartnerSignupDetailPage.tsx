import Modal from '@/ui/sdj/Modal';
import { useModal } from '@/ui/sdj/ModalState';
import { RiCheckLine } from 'react-icons/ri';

function AdminPartnerSignupDetailPage() {
  const { closeModal, modal, openModal } = useModal();
  return (
    <div className="w-full py-24 bg-gray-50 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-sm w-[1185px] px-12 py-10 flex flex-col gap-14">
        {/* 제목 */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">파트너 신청서</h1>
          <p className="text-babgray-600">BaB 플랫폼의 파트너가 되어 더 많은 고객과 만나보세요.</p>
        </div>

        {/* 폼 */}
        <form className="flex flex-col gap-[30px]">
          <div className="flex flex-col gap-[37px]">
            {/* 기본 정보 */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">기본 정보</h2>
              <hr className="border-babgray-150" />

              <div className="flex gap-7">
                <div>닉네임</div>

                <div>이메일</div>
              </div>

              <div className="flex gap-7">
                <div>대표자명</div>

                <div>휴대폰 번호</div>
              </div>

              <div className="flex gap-7">
                <div>사업자 등록 번호</div>

                <div>업체명</div>
              </div>

              <div>업체 주소</div>
            </section>

            {/* 운영 정보 */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">운영 정보</h2>
              <hr className="border-babgray-150" />

              <div className="flex gap-7">
                <div className="relative flex flex-col w-[50%] justify-center gap-[9px]">
                  <div className="flex gap-1">
                    <label>카테고리</label>
                    <span className="text-bab-500">*</span>
                  </div>
                  <div>카테고리</div>
                </div>

                <div className="flex flex-col w-[50%] gap-2">
                  <div className="flex gap-7">
                    <div>가격대</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end gap-8 bg-white py-4">
                {/* 운영시간 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <label className="text-babgray-800 text-md font-medium">운영시간</label>
                    <span className="text-bab-500">*</span>
                  </div>

                  <div className="flex items-center gap-3 w-[530px]">
                    {/* 시작 시간 */}

                    <div className="w-[250px] h-[44px] rounded-3xl border border-babgray-300 px-3">
                      시작시간
                    </div>

                    <span className="text-babgray-600">~</span>

                    {/* 종료 시간 */}
                    <div className="w-[250px] h-[44px] rounded-3xl border border-babgray-300 px-3 focus:border-bab">
                      종료시간
                    </div>
                  </div>
                </div>

                {/* 휴무일 */}
                <div className="flex flex-col gap-2 w-[530px]">
                  <span className="text-md text-babgray-800">휴무일</span>
                  <div className="flex gap-2 justify-start">
                    <button
                      type="button"
                      className={`w-11 h-11 rounded-xl flex justify-center items-center text-base font-medium transition 
                            `}
                      // ? 'bg-bab text-white border border-bab'
                      // : 'border border-babgray-300 text-babgray-800 hover:bg-babgray-100'
                    >
                      월
                    </button>
                  </div>
                </div>
              </div>

              {/* 매장 소개 */}
              <div className="flex flex-col w-full gap-2">
                <div>매장소개</div>
                <div>매장소개</div>
                <p className="text-xs text-babgray-500 text-right">
                  {/* {(formData.storeIntro ?? '').length}/500 */}
                  0/500
                </p>
              </div>
            </section>

            {/* 서류 업로드 */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">서류 업로드</h2>
              <hr className="border-babgray-150" />

              <div className="grid grid-cols-2 gap-6">
                {/* 사업자등록증 (PDF, private) */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-1 text-gray-700 font-medium">
                    사업자 등록증 <span className="text-bab-500">*</span>
                  </label>
                  <label className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-babgray-200 rounded-2xl text-sm text-babgray-500 cursor-pointer overflow-hidden">
                    <div>사업자 등록증 사진</div>
                  </label>
                </div>

                {/* 매장 대표 이미지 (공개 URL) */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-1 text-gray-700 font-medium">
                    매장 사진 <span className="text-bab-500">*</span>
                  </label>
                  <label className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-babgray-200 rounded-2xl text-sm text-babgray-500 cursor-pointer overflow-hidden">
                    매장 사진
                  </label>
                </div>
              </div>
            </section>

            {/* 약관 동의 */}
            <section className="w-80 flex flex-col gap-3">
              <p className="text-gray-700 text-sm font-medium">이용 약관</p>

              {/* 전체 동의 */}
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <span className="relative cursor-pointer">
                  {/* <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                     checked:border-[#FF5722] checked:bg-[#FF5722]
                     flex-shrink-0 transition-colors cursor-pointer"
                  /> */}
                  <RiCheckLine className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm text-gray-700">전체 동의</span>
              </label>

              {/* 개별 동의들 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="relative cursor-pointer">
                  {/* <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={() => toggleOne('terms')}
                    className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                     checked:border-[#FF5722] checked:bg-[#FF5722]
                     flex-shrink-0 transition-colors cursor-pointer"
                  /> */}
                  <RiCheckLine className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm">
                  <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                  <span className="text-gray-700">서비스 이용약관에 동의합니다</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="relative">
                  {/* <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={() => toggleOne('privacy')}
                    className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                     checked:border-[#FF5722] checked:bg-[#FF5722]
                     flex-shrink-0 transition-colors cursor-pointer"
                  /> */}
                  <RiCheckLine className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm">
                  <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                  <span className="text-gray-700">개인정보 처리방침에 동의합니다</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="relative">
                  {/* <input
                    type="checkbox"
                    checked={agreements.approval}
                    onChange={() => toggleOne('approval')}
                    className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                     checked:border-[#FF5722] checked:bg-[#FF5722]
                     flex-shrink-0 transition-colors cursor-pointer"
                  /> */}
                  <RiCheckLine className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm">
                  <span className="text-[#FF5722] font-medium">(필수)</span>{' '}
                  <span className="text-gray-700">신청 후 승인까지 2~3일 정도 소요됩니다</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="relative">
                  {/* <input
                    type="checkbox"
                    checked={agreements.marketing}
                    onChange={() => toggleOne('marketing')}
                    className="peer appearance-none w-5 h-5 border-2 border-[#C2C2C2] rounded 
                     checked:border-[#FF5722] checked:bg-[#FF5722]
                     flex-shrink-0 transition-colors cursor-pointer"
                  /> */}
                  <RiCheckLine className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] hidden peer-checked:block pointer-events-none" />
                </span>
                <span className="text-sm text-gray-700">
                  <span className="text-gray-500">(선택)</span> 마케팅 정보 수신에 동의합니다
                </span>
              </label>
            </section>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 h-14 border border-babgray-300 rounded-lg font-bold text-babgray-600 disabled:opacity-60"
            >
              거절
            </button>
            <button
              type="submit"
              className="flex-1 h-14 bg-bab text-white rounded-lg font-bold disabled:opacity-60"
              //   disabled={submitting}
            >
              {/* {submitting ? '신청 중...' : '신청하기'} */}
              승인
            </button>
          </div>
        </form>
      </div>{' '}
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
      {/* {addressModal.isOpen && (
        <Modal
          isOpen={addressModal.isOpen}
          onClose={addressCloseModal}
          titleText={addressModal.title}
          contentText={addressModal.content}
          closeButtonText={addressModal.closeText}
          submitButtonText={addressModal.submitText}
          onSubmit={addressModal.onSubmit}
        />
      )} */}
    </div>
  );
}

export default AdminPartnerSignupDetailPage;
