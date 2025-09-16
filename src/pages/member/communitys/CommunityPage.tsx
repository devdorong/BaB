import { Link } from 'react-router-dom';
import { ButtonFillMd } from '../../../ui/button';
import { supabase } from '../../../lib/supabase';
import type { Database, posts } from '../../../types/bobType';
import { useState } from 'react';

type CommunityCategoriesType = Database['public']['Tables']['posts']['Row']['post_category'];

const CommunityCategories: CommunityCategoriesType[] = ['자유게시판', '팁과노하우', '맛집추천요청'];

function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState<CommunityCategoriesType>('자유게시판');

  const getPosts = async (): Promise<any> => {
    const { data, error } = await supabase.from('posts').select('*');
    return data || [];
  };

  return (
    <div className="w-full bg-bg-bg">
      <div className="w-[1280px] mx-auto flex flex-col gap-10 py-8">
        {/* 타이틀 */}
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-bold">커뮤니티</p>
          <p className="text-babgray-600">맛집 친구들과 소통해보세요</p>
        </div>
        {/* 검색폼,버튼 */}
        <div className="flex justify-between items-center">
          <div>검색창</div>
          <Link to={'/member/community/write'}>
            <ButtonFillMd>작성하기</ButtonFillMd>
          </Link>
        </div>
        {/* 카테고리,게시글 */}
        <div>
          <div className="flex gap-10 border-b-[1px] border-babgray-150">
            {CommunityCategories.map(item => (
              <div
                key={item}
                className={`px-4 py-2 cursor-pointer ${activeCategory === item ? 'text-bab border-b-2 border-bab' : ' text-babgray-700'} hover:text-bab transition-colors`}
                onClick={() => setActiveCategory(item)}
              >
                {item}
              </div>
            ))}
          </div>
          <div>
            <div>게시글1</div>
            <div>게시글2</div>
            <div>게시글3</div>
            <div>게시글4</div>
          </div>
        </div>
        {/* 페이지네이션 */}
        <div>
          <div>페이지네이션</div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
