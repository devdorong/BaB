import Modal from '@/ui/sdj/Modal';
import { useModal } from '@/ui/sdj/ModalState';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { RestaurantWithProfile } from './AdminPartnersPage';
import dayjs from 'dayjs';
import { supabase } from '@/lib/supabase';

function AdminPartnerSignupDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const restaurant = location.state.restaurant as RestaurantWithProfile | undefined;

  const { closeModal, modal, openModal } = useModal();

  dayjs.locale('ko');

  const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];

  const sortedDays = [...(restaurant?.closeday || [])].sort(
    (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b),
  );

  const handleApproved = () => {
    openModal(
      '파트너 승인',
      '해당 파트너 신청서를 승인하시겠습니까?',
      '취소',
      '승인',
      async () => {
        const { error } = await supabase
          .from('restaurants')
          .update({ status: 'approved' })
          .eq('id', restaurant?.restaurant_id);

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'partner' })
          .eq('id', restaurant?.profile_id);

        if (updateError) {
          console.error(updateError);
        }

        if (error) {
          openModal('오류', `승인중 오류 발생 : ${error.message}`, '닫기');
          return;
        }
        openModal(
          '승인',
          '파트너 승인 완료',
          '',
          '확인',
          () => {
            closeModal();
            setTimeout(() => navigate(`/admin/partners`), 100);
          },
          () => {
            // navigate(`/admin/partners`);
            closeModal();
          },
        );
      },
      () => {
        // navigate(`/admin/partners/${restaurant?.restaurant_id}`);
        closeModal();
      },
      () => {
        // navigate(`/admin/partners/${restaurant?.restaurant_id}`);
        closeModal();
      },
    );
  };

  // state가 없을 경우 대비
  if (!restaurant) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="w-ful l py-24 bg-gray-50 flex flex-col items-center">
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
                <div className="flex-1 flex flex-col gap-4 border-b pb-3">
                  <div className="flex gap-1">
                    <div className="text-nowrap text-[14px] text-babgray-700">닉네임</div>
                    <span className="text-bab-500">*</span>
                  </div>
                  <div className="flex w-full justify-start font-bold text-babgray-800">
                    {restaurant.owner_nickname}
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-4 border-b pb-3">
                  <div className="flex gap-1">
                    <div className="text-nowrap text-[14px] text-babgray-700">이메일</div>
                    <span className="text-bab-500">*</span>
                  </div>
                  <div className="flex w-full justify-start font-bold text-babgray-800">
                    {restaurant.owner_email}
                  </div>
                </div>
              </div>

              <div className="flex gap-7">
                <div className="flex-1 flex flex-col gap-4 border-b pb-3">
                  <div className="flex gap-1">
                    <div className="text-nowrap text-[14px] text-babgray-700">대표자 명</div>
                    <span className="text-bab-500">*</span>
                  </div>
                  <div className="flex w-full justify-start font-bold text-babgray-800">
                    {restaurant.owner_name}
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-4 border-b pb-3">
                  <div className="flex gap-1">
                    <div className="text-nowrap text-[14px] text-babgray-700">연락처</div>
                    <span className="text-bab-500">*</span>
                  </div>
                  <div className="flex w-full justify-start font-bold text-babgray-800">
                    {restaurant.owner_phone}
                  </div>
                </div>
              </div>

              <div className="flex gap-7">
                <div className="flex-1 flex flex-col gap-4 border-b pb-3">
                  <div className="flex gap-1">
                    <div className="text-nowrap text-[14px] text-babgray-700">사업자 등록 번호</div>
                    <span className="text-bab-500">*</span>
                  </div>
                  <div className="flex w-full justify-start font-bold text-babgray-800">
                    {restaurant.business_number}
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-4 border-b pb-3">
                  <div className="flex gap-1">
                    <div className="text-nowrap text-[14px] text-babgray-700">업체명</div>
                    <span className="text-bab-500">*</span>
                  </div>
                  <div className="flex w-full justify-start font-bold text-babgray-800">
                    {restaurant.restaurant_name}
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4 border-b pb-3">
                <div className="flex gap-1">
                  <div className="text-nowrap text-[14px] text-babgray-700">업체 주소</div>
                  <span className="text-bab-500">*</span>
                </div>
                <div className="flex w-full justify-start font-bold text-babgray-800">
                  {restaurant.address}
                </div>
              </div>
            </section>

            {/* 운영 정보 */}
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-bold">운영 정보</h2>
              <hr className="border-babgray-150" />

              <div className="flex gap-7">
                <div className="relative flex flex-col w-[50%] justify-center gap-[9px]">
                  <div className="flex-1 flex flex-col gap-4 border-b pb-3">
                    <div className="flex gap-1">
                      <div className="text-nowrap text-[14px] text-babgray-700">카테고리</div>
                      <span className="text-bab-500">*</span>
                    </div>
                    <div className="flex w-full justify-start font-bold text-babgray-800">
                      {restaurant.category_name}
                    </div>
                  </div>
                </div>

                {/* <div className="flex flex-col w-[50%] gap-2">
                  <div className="flex gap-7">
                    <div>가격대</div>
                    <span className="text-bab-500">*</span>
                  </div>
                </div> */}
              </div>

              <div className="flex justify-between items-end gap-8 bg-white py-4">
                {/* 운영시간 */}
                <div className="flex w-[50%] flex-col gap-2">
                  <div className="flex-1 flex flex-col gap-4 border-b pb-3">
                    <div className="flex gap-1">
                      <div className="text-nowrap text-[14px] text-babgray-700">운영 시간</div>
                      <span className="text-bab-500">*</span>
                    </div>
                    <div className="flex w-full justify-start font-bold text-babgray-800">
                      {dayjs(`2000-01-01T${restaurant.opentime}`).format('HH:mm')} ~{' '}
                      {dayjs(`2000-01-01T${restaurant.closetime}`).format('HH:mm')}
                    </div>
                  </div>
                </div>

                {/* 휴무일 */}
                <div className="flex-1 flex flex-col gap-4 border-b pb-3">
                  <div className="flex gap-1">
                    <div className="text-nowrap text-[14px] text-babgray-700">휴무일</div>
                    <span className="text-bab-500">*</span>
                  </div>
                  <div className="flex w-full justify-start font-bold text-babgray-800">
                    {sortedDays.length > 0 ? (
                      <div className="flex gap-2">
                        {sortedDays.map((day, idx) => (
                          <span
                            key={idx}
                            className="w-11 h-11 rounded-xl flex justify-center items-center text-base font-medium transition"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span>휴무일 없음</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 매장 소개 */}
              <div className="flex-1 flex flex-col gap-4 border-b pb-3">
                <div className="flex gap-1">
                  <div className="text-nowrap text-[14px] text-babgray-700">사업자 등록증</div>
                  <span className="text-bab-500">*</span>
                </div>
                <div className="flex w-full justify-start font-bold text-babgray-800">
                  {restaurant.storeintro}
                </div>
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
                  <label className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-babgray-200 rounded-2xl text-sm text-babgray-500  overflow-hidden">
                    <div className="cursor-pointer">사진</div>
                  </label>
                </div>

                {/* 매장 대표 이미지 (공개 URL) */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-1 text-gray-700 font-medium">
                    매장 사진 <span className="text-bab-500">*</span>
                  </label>
                  <label className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-babgray-200 rounded-2xl text-sm text-babgray-500 cursor-pointer overflow-hidden">
                    <img
                      src={restaurant.restaurant_thumbnail_url ?? '사진이 없습니다'}
                      alt="매장사진"
                    />
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 h-14 border border-babgray-300 rounded-lg font-bold text-babgray-600 disabled:opacity-60 hover:bg-babgray-400 hover:text-white cursor-pointer"
            >
              거절
            </button>
            <div
              onClick={handleApproved}
              className="flex-1 flex h-14 bg-bab text-white rounded-lg font-bold disabled:opacity-60 hover:bg-bab-600 cursor-pointer justify-center items-center"
              //   disabled={submitting}
            >
              {/* {submitting ? '신청 중...' : '신청하기'} */}
              승인
            </div>
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
