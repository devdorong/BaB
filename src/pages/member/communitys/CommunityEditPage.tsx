import { useEffect, useState } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { ButtonFillMd, ButtonLineMd } from '../../../ui/button';
import { useModal } from '../../../ui/sdj/ModalState';
import { categories, type CategoriesType } from './CommunityWritePage';
import Modal from '../../../ui/sdj/Modal';

export const categoryBadgeMap: Record<CategoriesType, string> = {
  자유게시판: '자유',
  'Q&A': 'Q&A',
  팁과노하우: 'TIP',
};

function CommunityEditPage() {
  const { id } = useParams();
  const { modal, closeModal, openModal, x } = useModal();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<CategoriesType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCancel = () => {
    openModal('수정 취소', '수정중인 내용을 저장하지않고 나가시겠습니까?', '닫기', '확인', () =>
      navigate(-1),
    );
    return;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      openModal('수정 실패', '제목을 입력해주세요.', '확인');
      return;
    } else if (!content.trim()) {
      openModal('수정 실패', '내용을 입력해주세요.', '확인');
      return;
    }

    if (title || content) {
      openModal(
        '수정 확인',
        '수정된 내용으로 게시글을 수정하시겠습니까?',
        '취소',
        '수정',
        async () => {
          const { error } = await supabase
            .from('posts')
            .update({
              post_category: activeCategory,
              tag: categoryBadgeMap[activeCategory as CategoriesType],
              title,
              content,
            })
            .eq('id', id);

          if (error) {
            openModal('수정 실패', '게시글 수정 중 오류가 발생했습니다.', '닫기');
            return;
          }

          setTimeout(() => {
            openModal(
              '수정 완료',
              '게시글이 성공적으로 수정되었습니다.',
              '',
              '확인',
              () => {
                navigate(`/member/community/detail/${id}`);
              },
              () => {
                navigate(`/member/community/detail/${id}`);
                closeModal();
              },
            );
          }, 0);
        },
      );
    }
  };

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
        setActiveCategory(data.post_category as CategoriesType);
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
          <ButtonLineMd onClick={handleCancel} className="w-[320px]">
            취소
          </ButtonLineMd>
          <ButtonFillMd onClick={handleSave} className="w-[320px]">
            수정하기
          </ButtonFillMd>
        </div>
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
          onX={modal.onX}
        />
      )}
    </div>
  );
}

export default CommunityEditPage;
