import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { RiAlarmWarningLine, RiChat3Line, RiEyeLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import type { Comment, Database, Posts, ReportsInsert } from '../../../types/bobType';
import { ButtonFillMd } from '../../../ui/button';
import ReportsModal from '../../../ui/sdj/ReportsModal';
import TagBadge from '../../../ui/TagBadge';
import { Modal } from 'antd';

type PostWithProfile = Posts & {
  profiles: { id: string; nickname: string } | null;
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

  const [modalData, setModalData] = useState({
    isOpen: false,
    title: '',
    content: '',
    onSubmit: () => {},
  });

  const fetchComments = async () => {
    if (!post?.id) return;

    const { data, error } = await supabase
      .from('comments')
      .select(`*,profiles (nickname)`)
      .eq('post_id', post?.id)
      .order(`created_at`, { ascending: true });
    if (!error && data) {
      setComments(data as unknown as CommentWithProfile[]);
    }
  };

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `*,
      profiles (id, nickname, avatar_url)
    )`,
      )
      .eq('id', id)
      .single();
    if (!error && data) setPost(data as unknown as PostWithProfile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 모달창 띄우기
    if (!user) return alert('로그인이 필요합니다');
    if (!content.trim()) {
      // 모달창 띄우기
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    if (
      // 모달창 띄우기
      !window.confirm('댓글을 등록하시겠습니까?')
    ) {
      return;
    }
    const { error } = await supabase
      .from('comments')
      .insert({ post_id: post?.id, profile_id: user.id, content });

    if (!error) {
      setContent('');
      fetchComments();
    } else {
      console.error(error);
    }
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
    // 모달창 띄우기
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) fetchComments();
  };

  const handleReport = async (
    type: ReportsType,
    title: string,
    reason: string,
    targetProfileId: string | undefined,
  ) => {
    if (!user) {
      // 모달띄우기
      alert('로그인이 필요합니다.');
      return;
    }

    if (!targetProfileId) {
      alert('신고 대상 정보를 불러오지 못했습니다.');
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
      // 모달띄우기
      alert('신고 중 오류가 발생했습니다.');
    } else {
      // 모달띄우기
      alert('신고가 접수되었습니다.');
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

  const loadPost = async () => {
    if (!id) return;
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();

    if (error) console.log(error);
    else setPost(data);
    setLoading(false);
  };

  useEffect(() => {
    if (post?.id) {
      handleViewCount(post.id);
    }
  }, [post?.id]);

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [post]);

  useEffect(() => {
    fetchPost();
  }, [id]);

  // 로딩중 반응넣기(로딩 스피너)
  if (loading) return <div>로딩 중 ...</div>;
  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  const isAdmin = user?.user_metadata?.role === 'admin';
  const isAuthor = user?.id === post.profile_id;

  return (
    <div className="w-[746px] h-full flex flex-col gap-10 py-8 mx-auto">
      <p className="font-bold text-3xl text-babgray-900">게시글</p>
      {/* 게시글 영역 */}
      <div className="flex flex-col p-7 gap-6 bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div>
            {post.post_category === '팁과노하우' && (
              <TagBadge
                bgColor="bg-babbutton-purple_back"
                textColor="text-babbutton-purple"
                children="TIP"
              />
            )}
            {post.post_category === 'Q&A' && (
              <TagBadge
                bgColor="bg-babbutton-green_back"
                textColor="text-babbutton-green"
                children="Q&A"
              />
            )}
            {post.post_category === '자유게시판' && (
              <TagBadge
                bgColor="bg-babbutton-blue_back"
                textColor="text-babbutton-blue"
                children="자유"
              />
            )}
          </div>
          {isAuthor && (
            <ButtonFillMd onClick={() => navigate(`/member/community/edit/${post.id}`)}>
              게시글 수정
            </ButtonFillMd>
          )}
        </div>
        <div className="flex flex-col gap-8">
          <p className="font-bold text-2xl">{post.title}</p>
          <div className="flex items-center justify-between text-babgray-700 text-sm">
            <div className="flex items-center gap-4">
              <p className="font-bold text-lg">{post.profiles?.nickname || '익명'}</p>
              <span className="flex items-center gap-1 text-babgray-600">
                <RiEyeLine /> <p>{post.view_count}</p>
              </span>
              <span className="flex items-center gap-1 text-babgray-600">
                <RiChat3Line /> <p>{comments.length}</p>
              </span>
            </div>
            <p className="font-medium text-[12px] text-babgray-500">
              {dayjs(post.created_at).fromNow()}
            </p>
          </div>
        </div>
        <div className="flex border-y py-4 text-babgray-700 leading-relaxed">
          <p>{post.content}</p>
        </div>
        <div className="flex justify-center items-center gap-10 py-2">
          <div
            onClick={() => {
              setReportInfo({
                type: '게시글',
                nickname: post.profiles?.nickname ?? null,
                targetProfileId: post.profiles?.id,
              });
              setReports(true);
            }}
            className="flex items-center gap-2 text-babbutton-red cursor-pointer"
          >
            <RiAlarmWarningLine />
            <p>게시글 신고</p>
          </div>
        </div>
      </div>
      {/* 댓글 영역 */}
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
            {/* 댓글등록 클릭시 확인모달 출력 */}
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
            <p className="self-stretch text-right text-babgray-500 text-xs">{content.length}/500</p>
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
                  <span className="text-babgray-800 font-bold">{comment.profiles?.nickname}</span>
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
                <div className="flex justify-between items-center text-sm">
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
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default CommunityDetailPage;
