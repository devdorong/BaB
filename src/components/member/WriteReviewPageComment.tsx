import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  deleteReviewComment,
  fetchReviewComments,
  insertReviewComment,
} from '../../lib/restaurants';

interface WriteReviewCommentProps {
  reviewId: number;
}

function WriteReviewPageComment({ reviewId }: WriteReviewCommentProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const commentsLengths = 500;

  useEffect(() => {
    const load = async () => {
      const data = await fetchReviewComments(reviewId);
      setComments(data);
    };
    load();
  }, [reviewId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const comment = await insertReviewComment(reviewId, newComment);
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteReviewComment(id);
    setComments(prev => prev.filter(comment => comment.id !== id));
  };

  const keyEventEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex w-full">
      {comments.map(c => (
        <div
          key={c.id}
          className="mt-5 px-5 py-4 w-full bg-bab-100 border-l-4 border-bab-500 flex flex-col justify-start items-start gap-2.5"
        >
          <div className="flex w-full justify-start gap-2 text-bab">
            <div className="w-full inline-flex flex-col justify-center gap-1.5">
              <div className="self-stretch justify-start text-bab-700 text-[14px] font-normal ">
                사장님 답글
              </div>
              <div className="self-stretch justify-start text-babgray-700 text-[14px] font-normal ">
                {c.content}
              </div>
              {/* <div className="text-xs flex justify-end text-gray-400 hover:text-red-500">
                {user?.id === c.profiles!.id && (
                  <button onClick={() => handleDelete(c.id)}>삭제</button>
                )}
              </div> */}
            </div>
          </div>
        </div>
      ))}

      {/* {comments.length === 0 && (
        <form
          onSubmit={handleSubmit}
          className="px-5 py-4 w-full bg-bab-100 border-l-4 border-bab-500 flex flex-col justify-start items-start gap-2.5"
        >
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            maxLength={commentsLengths}
            onKeyDown={keyEventEnter}
            className="flex overflow-y-hidden w-full resize-none border-none bg-bab-100 rounded-md text-base"
            placeholder="답글을 입력하세요"
          />
          <button
            type="submit"
            className="text-xs w-full flex justify-end text-gray-400 hover:text-red-500"
          >
            등록
          </button>
        </form>
      )} */}
    </div>
  );
}

export default WriteReviewPageComment;
