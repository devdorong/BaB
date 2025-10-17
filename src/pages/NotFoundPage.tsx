import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh/0.9)] bg-babgray-100 text-center">
      <h1 className="text-[100px] font-bold text-babgray-900">404</h1>
      <p className="text-lg text-babgray-600 mb-8">페이지를 찾을 수 없습니다.</p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl font-semibold text-white bg-bab-500 hover:bg-bab-600 transition"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

export default NotFoundPage;
