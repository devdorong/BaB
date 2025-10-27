import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { RiArrowRightDoubleLine, RiArrowRightSLine, RiChat3Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import CommunityCardSkeleton from '../../../ui/sdj/CommunityCardSkeleton';
import Modal from '../../../ui/sdj/Modal';
import { useModal } from '../../../ui/sdj/ModalState';
import type { PostWithProfile } from '../communitys/CommunityPage';
import { BlueTag, GreenTag, PurpleTag } from '../../../ui/tag';
import styles from './MyWritePage.module.css';

dayjs.extend(relativeTime);
dayjs.locale('ko');

type FilteredTag = '자유' | 'Q&A' | 'TIP';

function MyWritePage() {
  const { user } = useAuth();
  const { closeModal, modal } = useModal();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [currentItems, setCurrentItems] = useState<PostWithProfile[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 10;
  const blockSize = 10;
  const currentBlock = Math.floor(currentPage / blockSize);
  const startPage = currentBlock * blockSize;
  const endPage = Math.min(startPage + blockSize, pageCount);

  const tagComponents: Record<FilteredTag, JSX.Element> = {
    자유: <BlueTag>자유</BlueTag>,
    'Q&A': <GreenTag>Q&A</GreenTag>,
    TIP: <PurpleTag>TIP</PurpleTag>,
  };

  const handlePageClick = (e: { selected: number }) => {
    setCurrentPage(e.selected);
    sessionStorage.setItem('my_write_page', String(e.selected));
    const newOffset = (e.selected * itemsPerPage) % posts.length;
    setItemOffset(newOffset);
  };

  const handlePostClick = (postId: number) => {
    if (!user) return;
    navigate(`/member/community/detail/${postId}`);
  };

  const fetchMyPosts = async () => {
    if (!user?.id) return;
    setIsLoading(true);

    const { data, error } = await supabase
      .from('posts')
      .select(
        `id, title, content, created_at, post_category, profile_id, tag, view_count,
        profiles (
          id,
          nickname
        ),
        comments (
          id
        )`,
      )
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('내 게시글 불러오기 실패:', error.message);
      setIsLoading(false);
      return;
    }

    setPosts(data as unknown as PostWithProfile[]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user?.id) fetchMyPosts();
  }, [user?.id]);

  useEffect(() => {
    if (posts.length > 0) {
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(posts.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(posts.length / itemsPerPage));
    } else {
      setCurrentItems([]);
      setPageCount(0);
    }
  }, [posts, itemOffset]);

  useEffect(() => {
    const savedPage = sessionStorage.getItem('my_write_page');
    if (savedPage) {
      const pageNum = Number(savedPage);
      setCurrentPage(pageNum);
      setItemOffset(pageNum * itemsPerPage);
    }
  }, []);

  return (
    <div className="w-full bg-bg-bg">
      <div className={styles.pageContainer}>
        {/* 타이틀 */}
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-bold">내가 쓴 게시글</p>
          <p className="text-babgray-600">내가 작성한 글들을 확인해 보세요.</p>
        </div>

        {/* 게시글 목록 */}
        <div className={styles.postList}>
          {isLoading ? (
            <>
              {[...Array(10)].map((_, i) => (
                <CommunityCardSkeleton key={i} />
              ))}
            </>
          ) : currentItems.length > 0 ? (
            currentItems.map(item => (
              <div
                key={item.id}
                onClick={() => handlePostClick(item.id)}
                className={styles.postCard}
              >
                <div className="flex justify-between">
                  <div>{tagComponents[item.tag as FilteredTag] ?? item.tag}</div>
                  <span className="text-babgray-500 text-[14px]">
                    {dayjs(item.created_at).fromNow()}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-xl">{item.title}</p>
                  <p className="text-babgray-600 line-clamp-2">{item.content}</p>
                </div>
                <div className="flex justify-between text-babgray-600">
                  <p className="font-semibold">{item.profiles?.nickname ?? '알 수 없음'}</p>
                  <div className="flex items-center gap-1">
                    <RiChat3Line />
                    {item.comments?.length ?? 0}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-5">지금 새로운 글을 등록해 보세요!</p>
          )}
        </div>

        {/* 페이지네이션 */}
        {!isLoading && pageCount > 1 && (
          <div className="flex items-center justify-center">
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

              {/* 이전 페이지 */}
              {currentPage > 0 && (
                <button
                  className="flex justify-center items-center rounded-md hover:bg-bab hover:text-white w-6 h-6"
                  onClick={() => handlePageClick({ selected: currentPage - 1 })}
                >
                  <RiArrowRightSLine className="transform rotate-180" />
                </button>
              )}

              {/* 현재 블록 페이지들 */}
              {Array.from({ length: endPage - startPage }, (_, i) => {
                const page = startPage + i;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageClick({ selected: page })}
                    className={`flex justify-center items-center px-2 ${
                      page === currentPage ? 'font-bold text-bab' : ''
                    } rounded-md hover:bg-bab hover:text-white w-6 h-6`}
                  >
                    {page + 1}
                  </button>
                );
              })}

              {/* 다음 페이지 */}
              {currentPage < pageCount - 1 && (
                <button
                  className="flex justify-center items-center rounded-md hover:bg-bab hover:text-white w-6 h-6"
                  onClick={() => handlePageClick({ selected: currentPage + 1 })}
                >
                  <RiArrowRightSLine />
                </button>
              )}

              {/* 맨 끝 블록 버튼 */}
              {currentBlock < Math.floor((pageCount - 1) / blockSize) && (
                <button
                  className="flex justify-center items-center rounded-md hover:bg-bab hover:text-white w-6 h-6"
                  onClick={() => handlePageClick({ selected: pageCount - 1 })}
                >
                  <RiArrowRightDoubleLine />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
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
    </div>
  );
}

export default MyWritePage;
