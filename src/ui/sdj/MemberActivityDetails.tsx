import { AnimatePresence, motion } from 'framer-motion';

interface MemberActivityModalProps {
  onClose: () => void;
}

export default function MemberActivityDetailModal({ onClose }: MemberActivityModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto p-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* 헤더 */}
          <h2 className="text-xl font-semibold text-center mb-6">회원 활동내역</h2>

          {/* 프로필 영역 */}
          <div className="flex items-center mb-6">
            <img
              src="https://placekitten.com/60/60"
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover mr-4"
            />
            <div>
              <p className="text-lg font-medium">사용자 닉네임</p>
              <p className="text-sm text-gray-500">가입일</p>
            </div>
          </div>

          {/* 매칭 기록 */}
          <h3 className="font-bold text-[19px] text-gray-700 mb-3">매칭기록</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="text-left py-2 px-4 w-[150px]">시간</th>
                <th className="text-left py-2 px-4">매칭 대상 (닉네임/ID)</th>
                <th className="text-left py-2 px-4 w-[180px]">장소 (위치)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b last:border-0">
                <td className="py-3 px-4 align-top text-gray-700">매칭일</td>
                <td className="py-3 px-4">
                  <div>(닉네임: 닉네임/아이디)</div>
                </td>
                <td className="py-3 px-4 align-top text-gray-700">장소</td>
              </tr>
            </tbody>
          </table>

          {/* 닫기 버튼 */}
          <div className="flex justify-center mt-8">
            <button
              onClick={onClose}
              className="px-8 py-2 rounded-lg bg-[#FF5722] text-white font-medium hover:bg-[#e14c1d] transition"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
