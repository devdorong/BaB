import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import {
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiChat3Line,
  RiSearchLine,
} from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getProfile } from '../../../lib/propile';
import { supabase } from '../../../lib/supabase';
import type { Database, Posts } from '../../../types/bobType';
import { ButtonFillMd } from '../../../ui/button';
import CommunityCardSkeleton from '../../../ui/sdj/CommunityCardSkeleton';
import Modal from '../../../ui/sdj/Modal';
import { BlueTag, GreenTag, PurpleTag } from '../../../ui/tag';
import styles from './CommunityPage.module.css';

type CategoriesType = Database['public']['Tables']['posts']['Row']['post_category'];
type CategoryTagType = Database['public']['Tables']['posts']['Row']['tag'];

export type PostWithProfile = Posts & {
  profiles: { id: string; nickname: string } | null;
  comments: { id: number }[];
};

dayjs.extend(relativeTime);
dayjs.locale('ko');

function CommunityPage() {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<UiCategory>('전체');
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [search, setSearch] = useState('');

  // 페이지네이션
  const [currentItems, setCurrentItems] = useState<PostWithProfile[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const blockSize = 10;
  const currentBlock = Math.floor(currentPage / blockSize);
  const startPage = currentBlock * blockSize;
  const endPage = Math.min(startPage + blockSize, pageCount);

  const handlePageClick = (e: { selected: number }) => {
    setCurrentPage(e.selected);
    sessionStorage.setItem('community_page', String(e.selected));
    const newOffset = (e.selected * itemsPerPage) % posts.length;
    setItemOffset(newOffset);
  };

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

  const fetchPosts = async () => {
    let postData = supabase.from('posts').select(
      `id, title, content, created_at, post_category, profile_id, tag, view_count,
    profiles (
      id,
      nickname
    ),comments (
      id
    )`,
    );

    // 검색기능
    if (search && search.trim() !== '') {
      postData = postData.ilike('title', `%${search.trim()}%`);
    }

    const { data, error } = await postData;

    if (error) {
      console.log(error);
    } else {
      setPosts(data as unknown as PostWithProfile[]);
    }
  };

  const handleWriteClick = async () => {
    if (!session || !user) {
      setIsOpen(true);
      return;
    }
    const login = await getProfile(user?.id);
    if (login) {
      navigate(`/member/community/write`);
    } else {
      setIsOpen(true);
    }
  };

  const handlePostClick = (postId: number) => {
    if (!user) {
      setIsOpen(true);
      return;
    }
    navigate(`/member/community/detail/${postId}`);
  };

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(filteredPosts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredPosts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, posts, activeCategory]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setItemOffset(0);
    setCurrentPage(0);
  }, [activeCategory, search]);

  useEffect(() => {
    const savedPage = sessionStorage.getItem('community_page');
    if (savedPage) {
      const pageNum = Number(savedPage);
      setCurrentPage(pageNum);
      setItemOffset(pageNum * itemsPerPage);
    }
  }, []);

  return (
    <div className="w-full bg-bg-bg">
      <div className={`${styles.pageContainer} w-[1280px] mx-auto flex flex-col gap-8 py-8`}>
        {/* 타이틀 */}
        <div className="flex flex-col gap-1">
          <p className="text-[24px] lg:text-3xl font-bold">커뮤니티</p>
          <p className="text-babgray-600">맛집 친구들과 소통해보세요</p>
        </div>
        {/* 검색폼,버튼 */}

        <div className={`${styles.writeFormWhitBt} w-full items-center`}>
          <div
            onClick={() => document.getElementById('searchInput')?.focus()}
            className="flex items-center gap-3 bg-white h-[55px] py-3 px-3 border border-s-babgray rounded-3xl"
          >
            <RiSearchLine className="text-babgray-300" />
            <input
              id="searchInput"
              className="focus:outline-none w-[600px]"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === `Enter`) {
                  fetchPosts();
                }
              }}
              placeholder="키워드로 게시글 검색하기"
            />
          </div>
          <div>
            <ButtonFillMd onClick={handleWriteClick}>작성하기</ButtonFillMd>
            {isOpen ? (
              <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={() => {
                  setIsOpen(false);
                  navigate(`/member/login`);
                }}
                titleText="로그인 확인"
                contentText="로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
                submitButtonText="확인"
                closeButtonText="취소"
              />
            ) : (
              <Link to={`/community/write`} />
            )}
          </div>
        </div>
        <div>
          {/* 카테고리 */}
          <div className={`${styles.category} flex gap-10 border-b-[1px] border-babgray-150`}>
            {UiCategories.map(item => (
              <div
                key={item}
                className={`${styles.category} px-4 py-2 cursor-pointer ${activeCategory === item ? 'text-bab border-b-2 border-bab' : ' text-babgray-700'} hover:text-bab transition-colors`}
                onClick={() => setActiveCategory(item)}
              >
                {item}
              </div>
            ))}
          </div>
          {/* 게시글 목록 */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 py-8">
              {currentItems.length > 0 ? (
                currentItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handlePostClick(item.id)}
                    className="w-full h-auto flex flex-col gap-4 bg-white shadow rounded-xl2 py-6 px-8 cursor-pointer"
                  >
                    <div className="flex justify-between">
                      <div>{tagComponents[item.tag as FilteredTag] ?? item.tag}</div>
                      <span className="text-babgray-500 text-[14px]">
                        {dayjs(item.created_at).fromNow()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-xl truncate">{item.title}</p>
                      <p className="text-babgray-600 truncate">{item.content}</p>
                    </div>
                    <div className="flex justify-between text-babgray-600">
                      <p className="font-semibold truncate">
                        {item.profiles?.nickname ?? '알수없음'}
                      </p>
                      <div>
                        <span className="flex items-center gap-1">
                          <RiChat3Line />
                          {item.comments?.length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : currentItems.length === 0 ? (
                <p className="text-gray-600 text-center py-5">검색된 게시물이 없습니다.</p>
              ) : (
                <>
                  {[...Array(10)].map((_, i) => (
                    <CommunityCardSkeleton key={i} />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        {/* 페이지네이션 */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            {pageCount > 0 && (
              <div className="flex items-center justify-center gap-2">
                {/* 맨 처음 블록 버튼 */}
                {currentBlock > 0 && (
                  <button
                    className="flex justify-center items-center rounded-md hover:bg-bab hover:text-white w-6 h-6"
                    onClick={() => handlePageClick({ selected: 0 })}
                  >
                    <RiArrowRightDoubleLine className="transform rotate-180" />
                  </button>
                )}
                {currentPage > 0 && (
                  <button
                    className="flex justify-center items-center rounded-md hover:bg-bab hover:text-white w-6 h-6 "
                    onClick={() => handlePageClick({ selected: currentPage - 1 })}
                  >
                    {<RiArrowRightSLine className="transform rotate-180" />}
                  </button>
                )}
                {/* 현재 블록 페이지들 */}
                {Array.from({ length: endPage - startPage }, (_, i) => {
                  const page = startPage + i;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageClick({ selected: page })}
                      className={`flex justify-center items-center px-2 ${page === currentPage ? 'font-bold text-bab' : ''} rounded-md hover:bg-bab hover:text-white w-6 h-6`}
                    >
                      {page + 1}
                    </button>
                  );
                })}
                {currentPage < pageCount - 1 && (
                  <button
                    className="flex justify-center items-center rounded-md hover:bg-bab hover:text-white w-6 h-6"
                    onClick={() => handlePageClick({ selected: currentPage + 1 })}
                  >
                    {<RiArrowRightSLine />}
                  </button>
                )}
                {/* 맨 끝 블록 버튼 */}
                {currentBlock < Math.floor((pageCount - 1) / blockSize) && (
                  <button
                    className="flex justify-center items-center rounded-md hover:bg-bab hover:text-white w-6 h-6"
                    onClick={() => handlePageClick({ selected: pageCount - 1 })}
                  >
                    {<RiArrowRightDoubleLine />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
