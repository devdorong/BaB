import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import type { Database, ProfileInsert } from '../../../types/bobType';
import { ButtonFillMd } from '../../../ui/button';

type CategoriesType = Database['public']['Tables']['posts']['Row']['post_category'];
type CategoryTagType = Database['public']['Tables']['posts']['Row']['tag'];
// type CategoryTagType = Database['public']['Enums']['post_tag_enum'];

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
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<CategoriesType>('자유게시판');
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [profiles, setProfiles] = useState<ProfileInsert[]>([]);

  const CommunityCategories: CategoriesType[] = ['자유게시판', '맛집추천요청', '팁과노하우'];
  const CommunityCategoryLabels: Record<CategoriesType, string> = {
    자유게시판: '자유게시판',
    팁과노하우: '팁과노하우',
    맛집추천요청: 'Q&A',
  };

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
      // .typed<PostWithProfile[]>()
      // .select(`*,profiles(id,nickname)`)
      // .order('created_at', { ascending: true });

      if (error) {
        console.log(error);
      } else {
        setPosts(data as PostWithProfile[]);
      }
    };
    fetchPosts();
  }, []);

  // useEffect(() => {
  //   const fetchProfiles = async () => {
  //     const { data, error } = await supabase.from('profiles').select('*');
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       setProfiles(data as ProfileInsert[]);
  //     }
  //   };
  //   fetchProfiles();
  // }, []);
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
                {CommunityCategoryLabels[item]}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-6 py-8">
            <div className="flex flex-col gap-6 py-8">
              {posts.map(item => (
                <div
                  key={item.id}
                  className="w-full h-auto flex flex-col gap-4 bg-white shadow-card rounded-xl2 py-4 px-8 "
                >
                  <div className="flex justify-between">
                    <div>{item.tag}</div>
                    <span>{dayjs(item.created_at).fromNow()}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="">{item.title}</p>
                    <p>{item.content}</p>
                  </div>
                  <div>
                    <p>{item.profiles?.nickname}</p>
                    <div>
                      <span>{item.comments?.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {profiles.map(item => (
              <div>{item.nickname}</div>
            ))}
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
