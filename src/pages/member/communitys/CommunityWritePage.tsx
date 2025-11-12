import { useEffect, useState } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import type { Database, PostsInsert } from '../../../types/bobType';
import { ButtonFillMd, ButtonLineMd } from '../../../ui/button';
import { useModal } from '../../../ui/sdj/ModalState';
import Modal from '../../../ui/sdj/Modal';
import styles from './CommunityWritePage.module.css';

export type CategoriesType = Database['public']['Tables']['posts']['Row']['post_category'];
export type TagFilterType = Exclude<TagType, '맛집추천요청'>;
type TagType = Database['public']['Tables']['posts']['Insert']['tag'];

export const categories: CategoriesType[] = ['자유게시판', 'Q&A', '팁과노하우'];
export const categoryTagMap: Record<CategoriesType, TagFilterType> = {
  자유게시판: '자유',
  'Q&A': 'Q&A',
  팁과노하우: 'TIP',
};

function CommunityWritePage() {
  const { closeModal, modal, openModal } = useModal();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<TagFilterType>('자유');
  const [activeCategory, setActiveCategory] = useState<CategoriesType>('자유게시판');

  const handleCancel = () => {
    if (!title.trim() || !content.trim()) {
      openModal(
        '등록 취소',
        '작성중인 게시글 내용을 저장하지않고 나가시겠습니까?',
        '취소',
        '확인',
        () => navigate('/member/community'),
      );
      return;
    }
    if (title.trim() || content.trim()) {
      openModal(
        '등록 취소',
        '작성중인 게시글 내용을 저장하지않고 나가시겠습니까?',
        '취소',
        '확인',
        () => navigate('/member/community'),
      );
      return;
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (!title.trim() && !content.trim()) {
        openModal('등록확인', '제목과 내용을 모두 입력해주세요.', '닫기');

        return;
      } else if (!title.trim()) {
        openModal('등록확인', '제목을 입력해주세요.', '닫기');

        return;
      } else if (!content.trim()) {
        openModal('등록확인', '내용을 입력해주세요.', '닫기');

        return;
      }

      if (userError || !userData) {
        openModal('로그인 확인', '로그인이 필요합니다.', '닫기', '로그인', () =>
          navigate('/member/login'),
        );

        return;
      }

      const newPost: PostsInsert = {
        post_category: activeCategory,
        profile_id: userData.user.id,
        tag: tag,
        title: title,
        content: content,
      };

      openModal('등록확인', '작성한 내용으로 등록하시겠습니까?', '취소', '등록', async () => {
        const { data, error } = await supabase
          .from('posts')
          .insert([newPost])
          .select('id')
          .single();

        if (error) {
          openModal('등록확인', '등록에 실패했습니다.', '닫기');
          navigate(-1);
          return;
        }

        navigate(`/member/community/detail/${data.id}`);
      });
    } catch (error) {
      openModal('오류확인', '예상치 못한 오류 발생.', '닫기');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`${styles.pageContainer} flex flex-col gap-4 w-[750px] mx-auto py-8`}>
      <p className="font-bold text-3xl">게시글 작성</p>
      <div
        className={`${styles.writeCard} flex flex-col gap-6 p-8 bg-white shadow-sm rounded-2xl text-babgray-800`}
      >
        <div className="flex flex-col gap-2">
          <span className="flex gap-1 font-semibold">
            카테고리 <p className="text-bab">*</p>
          </span>
          <div className={`${styles.categoryList} flex gap-4`}>
            {categories.map(item => (
              <button
                key={item}
                className={`flex py-2 px-4 rounded-full cursor-pointer ${activeCategory === item ? 'text-white bg-bab' : 'bg-bg-bg text-babgray-700'} focus:bg-bab transition-colors`}
                onClick={() => {
                  {
                    setActiveCategory(item);
                    setTag(categoryTagMap[item]);
                  }
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
          <input
            type="text"
            value={title}
            className="w-full h-[42px] py-3 px-3 border border-babgray rounded-3xl focus:outline-none"
            maxLength={100}
            onChange={e => setTitle(e.target.value)}
          />
          <div className="flex justify-end text-babgray-500">{title.length}/100</div>
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
        <div className={`${styles.buttonGroup} flex justify-between`}>
          <ButtonLineMd onClick={handleCancel} className="w-[320px]">
            취소
          </ButtonLineMd>
          <ButtonFillMd onClick={handleSubmit} className="w-[320px]">
            등록하기
          </ButtonFillMd>
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
    </div>
  );
}

export default CommunityWritePage;
