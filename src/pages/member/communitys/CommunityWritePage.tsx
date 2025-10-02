import { RiErrorWarningLine } from 'react-icons/ri';
import { GrayTag } from '../../../ui/tag';
import { ButtonFillMd, ButtonLineMd } from '../../../ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Database, PostsInsert } from '../../../types/bobType';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

type CategoriesType = Database['public']['Tables']['posts']['Row']['post_category'];
type TagType = Database['public']['Tables']['posts']['Insert']['tag'];
type TagFilterType = Exclude<TagType, '맛집추천요청'>;

function CommunityWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<TagFilterType>('자유');
  const [activeCategory, setActiveCategory] = useState<CategoriesType>('자유게시판');

  const handleSubmit = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData) {
        // 로그인이 필요합니다 모달 띄우기
        alert('로그인이 필요합니다.');
        return;
      }

      const newPost: PostsInsert = {
        post_category: activeCategory,
        profile_id: userData.user.id,
        tag: tag,
        title: title,
        content: content,
      };

      const { data, error } = await supabase.from('posts').insert([newPost]).select('*');

      if (error) {
        // 모달 띄우기
        alert('등록에 실패했습니다');
        navigate(-1);
      } else {
        // 모달 띄우기
        alert('등록되었습니다!');
        navigate('/member/community/detail');
      }
    } catch (error) {
      // 모달 띄우기
      alert('예상치 못한 오류 발생');
    }
  };

  const categories: CategoriesType[] = ['자유게시판', 'Q&A', '팁과노하우'];

  return (
    <div className="flex flex-col gap-4 w-[750px] mx-auto py-8">
      <p className="font-bold text-3xl">게시글 작성</p>
      <div className="flex flex-col gap-6 p-8 bg-white shadow-sm rounded-2xl text-babgray-800">
        <div className="flex flex-col gap-2">
          <span className="flex gap-1 font-semibold">
            카테고리 <p className="text-bab">*</p>
          </span>
          {/* 카테고리 태그 불러오기 */}
          <div className="flex gap-4">
            {categories.map(item => (
              <button
                key={item}
                className={`flex p-2 rounded-full cursor-pointer ${activeCategory === item ? 'text-white bg-bab' : 'bg-bg-bg text-babgray-700'} focus:bg-bab transition-colors`}
                onClick={() => {
                  setActiveCategory(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-1 font-semibold">
            제목 <p className="text-bab">*</p>
          </span>
          {/* 게시글 제목작성 input */}
          <input
            type="text"
            value={title}
            className="w-full h-[42px] py-3 px-3 border border-babgray rounded-3xl focus:outline-none"
            maxLength={100}
            onChange={e => setTitle(e.target.value)}
          />
          {/* input 글자수에따라 실시간 변경,최대 100자 제한 */}
          <div className="flex justify-end text-babgray-500">{title.length}/100</div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-1 font-semibold">
            내용 <p className="text-bab">*</p>
          </span>
          {/* textarea 글자수에따라 실시간 변경,최대 500자 제한 */}
          <textarea
            value={content}
            className="w-full h-[100px] py-2 px-3 border border-babgray rounded-3xl focus:outline-none resize-none"
            maxLength={500}
            onChange={e => setContent(e.target.value)}
          />
          <div className="flex justify-end text-babgray-500">{content.length}/500</div>
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
          {/* 등록하기 클릭시 커뮤니티페이지 detail:id 로 이동 */}
          {/* 카테고리 선택안했거나 제목,내용 중 하나라도 false라면 모달창 띄움 */}
          <ButtonFillMd onClick={handleSubmit} className="w-[320px]">
            등록하기
          </ButtonFillMd>
        </div>
      </div>
    </div>
  );
}

export default CommunityWritePage;
