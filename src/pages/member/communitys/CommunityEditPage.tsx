import { useEffect, useState } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { ButtonFillMd, ButtonLineMd } from '../../../ui/button';
import { useModal } from '../../../ui/sdj/ModalState';
import { categoryTagMap, type CategoriesType, type TagFilterType } from './CommunityWritePage';

function CommunityEditPage() {
  const { id } = useParams();
  const { closeModal, modal, openModal } = useModal();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<CategoriesType | null>(null);
  const [tag, setTag] = useState<TagFilterType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();

      if (error) {
        console.log(`게시글 불러오기 실패 : ${error.message}`);
        openModal('게시글 오류', '게시글 불러오기에 실패했습니다.', '닫기');
        return;
      }

      if (data) {
        setActiveCategory(data.category as CategoriesType);
        setTag(categoryTagMap[data.category as CategoriesType]);
        setTitle(data.title);
        setContent(data.content);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <div className="flex flex-col gap-4 w-[750px] mx-auto py-8">
      <p className="font-bold text-3xl">게시글 작성</p>
      <div className="flex flex-col gap-6 p-8 bg-white shadow-sm rounded-2xl text-babgray-800">
        <div className="flex flex-col gap-2">
          <span className="flex gap-1 font-semibold">
            카테고리 <p className="text-bab">*</p>
          </span>
          <div className="flex gap-4">
            {/* {categories.map(item => (
              <button
                key={item}
                className={`flex p-2 rounded-full cursor-pointer ${activeCategory === item ? 'text-white bg-bab' : 'bg-bg-bg text-babgray-700'} focus:bg-bab transition-colors`}
                onClick={() => {
                  {
                    setActiveCategory(item);
                    setTag(categoryTagMap[item]);
                  }
                }}
              >
                {item}
              </button>
            ))} */}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-1 font-semibold">
            제목 <p className="text-bab">*</p>
          </span>
          <input
            type="text"
            value={title}
            className="w-full h-[42px] py-3 px-3 border border-babgray rounded-3xl focus:outline-none"
            maxLength={100}
            onChange={e => setTitle(e.target.value)}
          />
          <div className="flex justify-end text-babgray-500">
            {title.length}
            /100
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-1 font-semibold">
            내용 <p className="text-bab">*</p>
          </span>
          <textarea
            value={content}
            className="w-full h-[100px] py-2 px-3 border border-babgray rounded-3xl focus:outline-none resize-none"
            maxLength={500}
            onChange={e => setContent(e.target.value)}
          />
          <div className="flex justify-end text-babgray-500">
            {content.length}
            /500
          </div>
        </div>
        <div className="flex flex-col gap-1 bg-bab-100 p-4 rounded-lg text-bab ">
          <div className="flex gap-2 items-center">
            <RiErrorWarningLine />
            <p>게시글 작성 가이드</p>
          </div>
          <ul className="list-disc flex flex-col px-8">
            <li>서로 존중하는 댓글 문화를 만들어가요</li>
            <li>개인 정보나 연락처는 공개하지 말아주세요</li>
            <li>광고성 게시글은 삭제될 수 있습니다</li>
          </ul>
        </div>
        <div className="border-b border-b-babgray" />
        <div className="flex justify-between">
          <ButtonLineMd onClick={() => navigate('/member/community')} className="w-[320px]">
            취소
          </ButtonLineMd>
          {/* 수정하기 클릭시 커뮤니티페이지 detail:id 로 이동 */}
          {/* 카테고리 선택안했거나 제목,내용 중 하나라도 false라면 모달창 띄움 */}
          <ButtonFillMd className="w-[320px]">수정하기</ButtonFillMd>
        </div>
      </div>
    </div>
  );
}

export default CommunityEditPage;
