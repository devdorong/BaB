import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { RiAlarmWarningLine, RiChat3Line, RiCloseFill, RiEyeLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import type { Comment, Database, Posts } from '../../../types/bobType';
import { ButtonFillLG, ButtonFillMd, ButtonLineLg } from '../../../ui/button';
import Modal from '../../../ui/sdj/Modal';
import { useModal } from '../../../ui/sdj/ModalState';
import ReportsModal from '../../../ui/sdj/ReportsModal';
import TagBadge from '../../../ui/TagBadge';
import styles from './CommunityDetailPage.module.css';
import { useDirectChat } from '@/contexts/DirectChatContext';
import type { ChatListItem } from '@/types/chatType';
import { findOrCreateDirectChat } from '@/services/directChatService';
import LoadingDiv from '@/components/LoadingDiv';
import Skeleton from '@/ui/dorong/Skeleton';

type PostWithProfile = Posts & {
  profiles: { id: string; nickname: string; avatar_url: string } | null;
};

type CommentWithProfile = Comment & {
  profiles: {
    id: string;
    nickname: string;
    avatar_url?: string;
  } | null;
};

export type ReportsType = Database['public']['Tables']['reports']['Insert']['report_type'];
export type ReportsStatus = Database['public']['Tables']['reports']['Insert'];

function CommunityDetailPage() {
  const { modal, closeModal, openModal } = useModal();
  const navigate = useNavigate();
  const [reports, setReports] = useState(false);
  const [reportInfo, setReportInfo] = useState<{
    type: ReportsType;
    nickname: string | null;
    targetProfileId?: string;
  }>({
    type: '게시글',
    nickname: null,
    targetProfileId: undefined,
  });

  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<PostWithProfile | null>(null);
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const { setCurrentChat, loadMessages, loadChats } = useDirectChat();

  const fetchComments = async () => {
    if (!post?.id) return;

    const { data, error } = await supabase
      .from('comments')
      .select(`*,profiles (id,nickname)`)
      .eq('post_id', post?.id)
      .order(`created_at`, { ascending: true });
    if (!error && data) {
      setComments(data as unknown as CommentWithProfile[]);
    }
  };

  const fetchPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`*, profiles (id, nickname, avatar_url)`)
      .eq('id', id)
      .single();
    if (!error && data) setPost(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openModal(
        '로그인 필요',
        '로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?',
        '취소',
        '확인',
      );
      return;
    }
    if (!content.trim()) {
      openModal('내용 확인', '댓글 내용을 입력해주세요.', '닫기');
      return;
    }
    openModal('등록 확인', '댓글을 등록하시겠습니까?', '취소', '확인', async () => {
      const { error } = await supabase
        .from('comments')
        .insert({ post_id: post?.id, profile_id: user.id, content });

      if (!error) {
        setContent('');
        fetchComments();
      } else {
        console.error(error);
      }
      closeModal();
    });
  };

  const handleChatBt = () => {
    if (!user) {
      return;
    }
    openModal('채팅', '해당 게시글 작성자와 채팅을 하시겠습니까?', '취소', '확인', async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('로그인 정보를 불러올 수 없음');

        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('id, profile_id')
          .eq('id', id)
          .single();

        if (postError) {
          throw new Error(`${postError.message}`);
        }

        const { success, data: chatRoom } = await findOrCreateDirectChat(postData.profile_id);
        if (!success || !chatRoom?.id) throw new Error('채팅방 생성 실패');
        const chatData: ChatListItem = {
          id: chatRoom.id,
          other_user: {
            id: postData.profile_id,
            nickname: post?.profiles?.nickname ?? '호스트',
            avatar_url: post?.profiles?.avatar_url ?? null,
            email: '',
          },
          last_message: undefined,
          unread_count: 0,
          is_new_chat: false,
        };
        setCurrentChat(chatData);
        await loadMessages(chatData.id);
        navigate(`/member/profile/chat`, { state: { chatId: chatRoom.id } });
      } catch (err) {
        console.log(err);
      }
    });
  };

  const handleEditSave = async (id: number) => {
    const { error } = await supabase.from('comments').update({ content: editText }).eq('id', id);
    if (!error) {
      setEditingId(null);
      setEditText('');
      fetchComments();
    }
  };

  const handleDelete = async (id: number) => {
    openModal('댓글 삭제', '해당 댓글을 삭제하시겠습니까?', '취소', '삭제', async () => {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (!error) {
        fetchComments();
      }
      closeModal();
    });
  };

  const handlePostDelete = async (id: number) => {
    openModal('게시글 삭제', '해당 게시글을 삭제하시겠습니까?', '취소', '삭제', async () => {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (!error) {
        navigate('/member/community');
      }
      closeModal();
    });
  };

  const handleReport = async (
    type: ReportsType,
    title: string,
    reason: string,
    targetProfileId: string | undefined,
  ) => {
    if (!user) {
      openModal('로그인 확인', '로그인이 필요합니다.', '닫기');
      return;
    }

    if (!targetProfileId) {
      openModal('사용자 정보', '사용자 정보를 불러오는데 실패했습니다.', '닫기');
      return;
    }

    const { error } = await supabase.from('reports').insert([
      {
        reporter_id: user.id,
        accused_profile_id: targetProfileId,
        reason: `${title.trim()} - ${reason.trim()}`,
        report_type: type,
      },
    ]);

    if (error) {
      console.error('신고 실패:', error);
      openModal('오류', '신고 중 오류가 발생했습니다.', '닫기');
    } else {
      openModal('신고완료', '신고가 접수되었습니다.', '닫기');
    }
  };

  const handleViewCount = async (postId: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const key = `viewed_${postId}_${user.id}_${today}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, 'true');

    const { data, error: selectError } = await supabase
      .from('posts')
      .select('view_count')
      .eq('id', postId)
      .single();

    if (selectError || !data) return;

    const { error } = await supabase
      .from('posts')
      .update({ view_count: data.view_count + 1 })
      .eq('id', postId);

    if (!error) {
      setPost(prev => (prev ? { ...prev, view_count: data.view_count + 1 } : prev));
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      setIsAdmin(profile?.role === 'admin');
      setIsAuthor(user?.id === post?.profile_id);
    };
    checkAdmin();
  }, [user, post]);

  useEffect(() => {
    if (post?.id) {
      handleViewCount(post?.id);
    }
  }, [post?.id]);

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [post]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 로딩중 반응넣기(로딩 스피너)
  // if (loading) return <LoadingDiv />;
  // if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  return (
    <div className={`${styles.pageContainer} w-[1280px] h-full flex justify-between p-4 mx-auto`}>
      <div className={`${styles.leftSection} w-[844px] flex flex-col gap-10`}>
        {/* 게시글 영역 */}
        {loading ? (
          <div className="flex flex-col p-7 gap-6 bg-white rounded-2xl shadow">
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-3/4 h-8" />
            <div className="flex gap-4">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-16 h-5" />
              <Skeleton className="w-16 h-5" />
            </div>
            <Skeleton className="w-full h-40" />
          </div>
        ) : (
          <>
            <div className="flex flex-col p-7 gap-6 bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div>
                  {post?.post_category === '팁과노하우' && (
                    <TagBadge
                      bgColor="bg-babbutton-purple_back"
                      textColor="text-babbutton-purple"
                      children="TIP"
                    />
                  )}
                  {post?.post_category === 'Q&A' && (
                    <TagBadge
                      bgColor="bg-babbutton-green_back"
                      textColor="text-babbutton-green"
                      children="Q&A"
                    />
                  )}
                  {post?.post_category === '자유게시판' && (
                    <TagBadge
                      bgColor="bg-babbutton-blue_back"
                      textColor="text-babbutton-blue"
                      children="자유"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <p className="font-bold text-2xl">{post?.title}</p>
                <div className="flex items-center justify-between text-babgray-700 text-sm">
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-lg">{post?.profiles?.nickname || '익명'}</p>
                    <span className="flex items-center gap-1 text-babgray-600">
                      <RiEyeLine /> <p>{post?.view_count}</p>
                    </span>
                    <span className="flex items-center gap-1 text-babgray-600">
                      <RiChat3Line /> <p>{comments.length}</p>
                    </span>
                  </div>
                  <p className="font-medium text-[12px] text-babgray-500">
                    {dayjs(post?.created_at).fromNow()}
                  </p>
                </div>
              </div>
              <div className="flex border-y py-4 text-babgray-700 leading-relaxed">
                <p>{post?.content}</p>
              </div>
            </div>
          </>
        )}

        {/* 댓글 영역 */}
        {loading ? (
          <div className="flex flex-col p-7 gap-6 bg-white rounded-2xl shadow">
            <div className="flex justify-between items-center">
              <Skeleton className="w-28 h-6" />
              <Skeleton className="w-24 h-8" />
            </div>

            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col gap-4 py-4 border-b border-gray-100">
                <div className="flex justify-between">
                  <Skeleton className="w-20 h-5" />
                  <Skeleton className="w-10 h-4" />
                </div>
                <Skeleton className="w-full h-6" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-col p-7 gap-6 bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.02)]">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xl font-bold gap-2">
                    <RiChat3Line className="text-black" />
                    <span className="flex items-center gap-1">
                      댓글
                      <div className="font-bold">{comments.length}</div>개
                    </span>
                  </div>
                  <div>
                    <ButtonFillMd type="submit">댓글 등록</ButtonFillMd>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <textarea
                    placeholder="댓글을 작성해주세요"
                    value={content}
                    maxLength={500}
                    onChange={e => setContent(e.target.value)}
                    className="w-full h-24 px-4 py-3.5 rounded-xl outline outline-1 outline-offset-[-1px] outline-babgray text-babgray-800 resize-none focus:outline-none focus:ring-1 focus:ring-bab"
                  />
                  <p className="self-stretch text-right text-babgray-500 text-xs">
                    {content.length}/500
                  </p>
                </div>
              </form>
              <ul>
                {comments.map(comment => {
                  const isAuthor = user?.id === comment.profile_id;
                  return (
                    <li
                      key={comment.id}
                      className="flex flex-col gap-4 border-y border-y-babgray py-5 text-babgray-700"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-babgray-800 font-bold">
                          {comment.profiles?.nickname}
                        </span>
                        <span className="text-babgray-700 text-[12px]">
                          {dayjs(comment.created_at).fromNow()}
                        </span>
                      </div>
                      {/* 등록한 댓글 내용 */}
                      <div className="text-babgray-700 break-words">
                        {editingId === comment.id ? (
                          <div className="flex gap-2 mt-1">
                            <input
                              type="text"
                              value={editText}
                              onChange={e => setEditText(e.target.value)}
                              className="border rounded px-2 py-1 text-sm flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => handleEditSave(comment.id)}
                              className="text-bab-500 text-sm"
                            >
                              저장
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-gray-500 text-sm"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <div className="text-gray-700 mt-1">{comment.content}</div>
                        )}
                      </div>
                      <div className="flex justify-end items-center gap-2 text-sm">
                        {(isAuthor || isAdmin) && (
                          <div className="flex gap-1 items-center text-sm text-gray-500">
                            <button
                              onClick={() => {
                                setEditingId(comment.id);
                                setEditText(comment.content);
                              }}
                              className="hover:text-bab-500"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="hover:text-red-500"
                            >
                              삭제
                            </button>
                          </div>
                        )}
                        {!isAuthor && (
                          <div
                            onClick={() => {
                              setReportInfo({
                                type: '댓글',
                                nickname: comment.profiles?.nickname ?? null,
                                targetProfileId: comment.profiles?.id,
                              });
                              setReports(true);
                            }}
                            className="flex items-center gap-1 text-babbutton-red cursor-pointer"
                          >
                            <RiAlarmWarningLine />
                            <p>신고하기</p>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {reports && (
                <ReportsModal
                  setReports={setReports}
                  targetNickname={reportInfo.nickname ?? ''}
                  handleReport={(type, title, reason) =>
                    handleReport(type, title, reason, reportInfo.targetProfileId)
                  }
                  reportType={reportInfo.type}
                />
              )}
            </div>
          </>
        )}
      </div>
      {/* 오른쪽 카드 영역 */}
      {loading ? (
        <div className="flex flex-col gap-4 w-[400px] p-6 bg-white rounded-[16px] shadow">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </div>
      ) : (
        <>
          <div
            className={`${styles.rightSection} flex w-[400px] h-[150px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]`}
          >
            <section className="w-full space-y-3">
              {isAuthor || isAdmin ? (
                <>
                  <ButtonFillLG
                    className="w-full"
                    style={{ fontWeight: 600, borderRadius: '12px' }}
                    onClick={() => navigate(`/member/community/edit/${post?.id}`)}
                  >
                    게시글 수정
                  </ButtonFillLG>
                </>
              ) : (
                ''
              )}
              {isAuthor || isAdmin ? (
                <>
                  <ButtonLineLg
                    className="w-full"
                    style={{ fontWeight: 600, borderRadius: '12px' }}
                    onClick={() => handlePostDelete(post!.id)}
                  >
                    <div className="flex gap-[5px] justify-center items-center">
                      게시글 삭제
                      <RiCloseFill className="w-4 h-4 shrink-0 relative top-[1px]" />
                    </div>
                  </ButtonLineLg>
                </>
              ) : (
                ''
              )}
              {!isAuthor && !isAdmin ? (
                <>
                  <ButtonLineLg
                    className="w-full bg-babbutton-red !text-white hover:!bg-bab-700"
                    style={{ fontWeight: 600, borderRadius: '12px' }}
                    onClick={() => {
                      setReportInfo({
                        type: '게시글',
                        nickname: post?.profiles?.nickname ?? null,
                        targetProfileId: post?.profiles?.id,
                      });
                      setReports(true);
                    }}
                  >
                    <div className="inline-flex items-center justify-center gap-1.5 font-semibold rounded-[12px] leading-none">
                      신고하기
                      <RiAlarmWarningLine className="w-4 h-4 shrink-0 relative top-[1px]" />
                    </div>
                  </ButtonLineLg>
                </>
              ) : (
                ''
              )}{' '}
              {!isAuthor && !isAdmin ? (
                <>
                  <ButtonLineLg
                    className="w-full"
                    style={{ fontWeight: 600, borderRadius: '12px' }}
                    onClick={handleChatBt}
                  >
                    <div className="inline-flex items-center justify-center gap-1.5 font-semibold rounded-[12px] leading-none">
                      채팅하기
                      <RiChat3Line className="w-4 h-4 shrink-0 relative top-[1px]" />
                    </div>
                  </ButtonLineLg>
                </>
              ) : (
                ''
              )}
            </section>
          </div>
        </>
      )}

      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          onSubmit={modal.onSubmit}
          titleText={modal.title}
          contentText={modal.content}
          submitButtonText={modal.submitText}
          closeButtonText={modal.closeText}
        />
      )}
    </div>
  );
}

export default CommunityDetailPage;
