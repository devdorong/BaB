import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import type { Database } from '../../../types/bobType';
import { ButtonFillMd } from '../../../ui/button';
import { BlueTag, GreenTag, PurpleTag } from '../../../ui/tag';
import { RiChat3Line } from 'react-icons/ri';

type CategoriesType = Database['public']['Tables']['posts']['Row']['post_category'];
type CategoryTagType = Database['public']['Tables']['posts']['Row']['tag'];

type PostWithProfile = {
  id?: number;
  post_category: CategoriesType;
  profile_id: string;
  tag: CategoryTagType;
  title: string;
  content: string;
  created_at?: string | null;
  view_count?: number;
  profiles: { id: string; nickname: string } | null;
  comments: { id: number }[];
};

dayjs.extend(relativeTime);
dayjs.locale('ko');

function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState<UiCategory>('전체');
  const [posts, setPosts] = useState<PostWithProfile[]>([]);

  const CommunityCategories: CategoriesType[] = ['자유게시판', 'Q&A', '팁과노하우'];

  type UiCategory = (typeof UiCategories)[number];
  const UiCategories = ['전체', ...CommunityCategories] as const;

  type FilteredTag = Exclude<CategoryTagType, '맛집추천요청'>;
  // 카테고리,태그 매핑
  const tagToCategoryMap: Record<FilteredTag, CategoriesType> = {
    자유: '자유게시판',
    'Q&A': 'Q&A',
    TIP: '팁과노하우',
  };

  const tagComponents: Record<FilteredTag, JSX.Element> = {
    자유: <BlueTag>자유</BlueTag>,
    'Q&A': <GreenTag>Q&A</GreenTag>,
    TIP: <PurpleTag>TIP</PurpleTag>,
  };

  const filteredPosts = posts
    .slice()
    .sort((a, b) => b.created_at?.localeCompare(a.created_at ?? '') ?? 0)
    .filter(item => {
      const mapCategory = tagToCategoryMap[item.tag as FilteredTag];
      return activeCategory === '전체' ? true : mapCategory === activeCategory;
    });

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `id,
    title,
    content,
    created_at,
    post_category,
    profile_id,
    tag,
    view_count,
    profiles (
      id,
      nickname
    ),comments (
      id
    )`,
        )
        .returns<PostWithProfile[]>();

      if (error) {
        console.log(error);
      } else {
        setPosts(data as PostWithProfile[]);
      }
    };
    fetchPosts();
  }, []);

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
        <div>
          {/* 카테고리 */}
          <div className="flex gap-10 border-b-[1px] border-babgray-150">
            {UiCategories.map(item => (
              <div
                key={item}
                className={`px-4 py-2 cursor-pointer ${activeCategory === item ? 'text-bab border-b-2 border-bab' : ' text-babgray-700'} hover:text-bab transition-colors`}
                onClick={() => setActiveCategory(item)}
              >
                {item}
              </div>
            ))}
          </div>
          {/* 게시글 목록 */}
          <div className="flex flex-col gap-6 py-8">
            <div className="flex flex-col gap-6 py-8">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(item => (
                  <div
                    key={item.id}
                    className="w-full h-auto flex flex-col gap-4 bg-white shadow-card rounded-xl2 py-6 px-8 "
                  >
                    <div className="flex justify-between">
                      <div>{tagComponents[item.tag as FilteredTag] ?? item.tag}</div>
                      <span className="text-babgray-500">{dayjs(item.created_at).fromNow()}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-xl">{item.title}</p>
                      <p className="text-babgray-600">{item.content}</p>
                    </div>
                    <div className="flex justify-between text-babgray-600">
                      <p className="font-semibold">{item.profiles?.nickname}</p>
                      <div>
                        <span className="flex items-center gap-1">
                          <RiChat3Line />
                          {item.comments?.length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">게시글이 없습니다.</p>
              )}
            </div>
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
