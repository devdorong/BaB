import { useEffect, useState } from 'react';
import {
  RiAlarmWarningLine,
  RiChat3Line,
  RiCornerDownRightFill,
  RiEyeLine,
  RiHeart3Line,
  RiShareForwardLine,
} from 'react-icons/ri';
import { ButtonFillMd } from '../../../ui/button';
import ReportsModal from '../../../ui/sdj/ReportsModal';
import { BlueTag } from '../../../ui/tag';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import type { Posts } from '../../../types/bobType';
import dayjs from 'dayjs';
import TagBadge from '../../../ui/TagBadge';
import { useAuth } from '../../../contexts/AuthContext';

type PostDetail = Posts & {
  profiles: { id: string; nickname: string } | null;
};

function CommunityDetailPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

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
    const loadPost = async () => {
      if (!id) return;
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();

      if (error) console.log(error);
      else setPost(data);
      setLoading(false);
    };
    loadPost();
  }, [id]);

  useEffect(() => {
    if (post?.id) {
      handleViewCount(post.id);
      console.log(handleViewCount);
    }
  }, [post?.id]);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        //   .select(
        //     `id,post_category,profile_id,tag,title,content,created_at,view_count, profiles (
        //   nickname
        // )`,
        //   )
        .select(`*, profiles(nickname)`)
        .eq('id', id)
        .single();
      if (!error && data) setPost(data as unknown as PostDetail);
    };

    fetchPost();
  }, [id]);

  // 로딩중 반응넣기(로딩 스피너)
  if (loading) return <div>로딩 중 ...</div>;
  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

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
              <p className="font-bold text-lg">{post.profiles?.nickname}</p>
              <span className="flex items-center gap-1 text-babgray-600">
                <RiEyeLine /> <p>{post.view_count}</p>
              </span>
              {/* 이 게시글 좋아요 수 */}
              <span className="flex items-center gap-1 text-babgray-600">
                <RiHeart3Line /> <p>23</p>
              </span>
              {/* 이 게시글에 달린 댓글 수 */}
              <span className="flex items-center gap-1 text-babgray-600">
                <RiChat3Line /> <p>3</p>
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
          <div className="flex items-center gap-2 text-babgray-700 cursor-pointer">
            {/* 좋아요 누른 게시글에는 하트색 바뀌도록, 한번더 누르면 원상복구 */}
            <RiHeart3Line />
            <p>좋아요</p>
            {/* 이 게시글 좋아요 수 */}
            <div>23</div>
          </div>
          {/* 신고 버튼 클릭시 reports modal 출력 */}
          <div
            onClick={() => setReports(true)}
            className="flex items-center gap-2 text-babbutton-red cursor-pointer"
          >
            <RiAlarmWarningLine />
            <p>게시글 신고</p>
          </div>
          {reports && <ReportsModal setReports={setReports} />}
        </div>
      </div>
      {/* 댓글 영역 */}
      <div className="flex flex-col p-7 gap-6 bg-white rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xl font-bold gap-2">
            <RiChat3Line className="text-black" />
            <span className="flex items-center gap-1">
              댓글
              {/* 해당 게시글 댓글 갯수 */}
              <div className="font-bold">3</div>개
            </span>
          </div>
          {/* 댓글등록 클릭시 확인모달 출력 */}
          <div>
            <ButtonFillMd>댓글 등록</ButtonFillMd>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {/* 댓글등록 클릭시 작성될 내용 */}
          <textarea
            placeholder="댓글을 작성해주세요"
            className="w-full h-24 px-4 py-3.5 rounded-xl outline outline-1 outline-offset-[-1px] outline-babgray text-babgray-800 resize-none focus:outline-none focus:ring-1 focus:ring-bab"
          />
          {/* textarea 에 작성된 글자수 제한,실시간 연동 500자 제한*/}
          <p className="self-stretch text-right text-babgray-500 text-xs">0/500</p>
        </div>
        <div>
          {/* 기본버전 */}
          <div className="flex flex-col gap-4 border-y border-y-babgray py-5 text-babgray-700">
            <div className="flex justify-between items-start">
              {/* 댓글작성자 닉네임 */}
              <span className="text-babgray-800 font-bold">도로롱</span>
              {/* 댓글 작성시간 */}
              <span className="text-babgray-700 text-[12px]">1시간 전</span>
            </div>
            {/* 등록한 댓글 내용 */}
            <p className="text-babgray-700">
              고기 구이 맛집이라면 저도 참여하고 싶어요. 어떤 곳을 생각하고 계신가요? 계신가요?
              계신가요? 계신가요? 계신가요? 계신가요? 계신가요? 계신가요?
            </p>
            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-5 text-babgray-700">
                {/* 눌렀을때 색바뀌면서 활성화 되며 개수 증가, 한번더 누르면 원상복구 후 좋아요 개수 감소 */}
                <div className="flex items-center gap-1 cursor-pointer">
                  <RiHeart3Line />
                  <p>5</p>
                </div>
                {/* 눌렀을때 답글버전으로 변경 */}
                <div className="flex items-center gap-1 cursor-pointer">
                  <RiShareForwardLine />
                  <p>답글</p>
                </div>
              </div>
              {/* 눌렀을때 reports 모달 */}
              <div className="flex items-center gap-1 text-babbutton-red cursor-pointer">
                <RiAlarmWarningLine />
                <p>신고하기</p>
              </div>
            </div>
          </div>
          {/* 답글 달렸을때 버전 */}
          <div className="flex flex-col gap-4 border-y border-y-babgray py-5 text-babgray-700">
            <div className="flex justify-between items-center gap-2 text-babgray-500">
              <div className="flex items-center gap-2">
                <RiCornerDownRightFill className="text-babgray-600" />
                {/* 답글 단 회원의 닉네임 */}
                <p className="text-babgray-800 font-bold">도현</p>
              </div>
              {/* 답글 단 시간 */}
              <p className="text-babgray-700 text-[12px]">50분 전</p>
            </div>
            <div>
              {/* 답글 내용 */}
              <p className="text-color-grayscale-g700 text-base">반가워요!</p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-5 text-color-grayscale-g700">
                <div className="flex items-center gap-1 cursor-pointer">
                  {/* 눌렀을때 색바뀌면서 활성화 되며 개수 증가, 한번더 누르면 원상복구 후 좋아요 개수 감소 */}
                  <RiHeart3Line />
                  <p>5</p>
                </div>
                {/* 눌렀을때 답글버전으로 변경 */}
                <div className="flex items-center gap-1 cursor-pointer">
                  <RiShareForwardLine />
                  <p>답글</p>
                </div>
              </div>
              {/* 눌렀을때 reports 모달 */}
              <div className="flex items-center gap-1 text-babbutton-red cursor-pointer">
                <RiAlarmWarningLine />
                <p>신고하기</p>
              </div>
            </div>
          </div>
          {/* 답글버튼 눌렀을때 버전 */}
          <div className="flex flex-col gap-4 border-y border-y-babgray py-5 text-babgray-700">
            <div className="flex justify-between items-center">
              {/* 답글 작성자 닉네임 */}
              <p className="font-bold">도롱</p>
              {/* 답글 작성 시간 */}
              <p className="text-[12px]">2시간 전</p>
            </div>
            {/* 답글을 달 댓글 내용 */}
            <p>저도 강남역 근처 맛집 탐방 좋아해요! 함께 할 수 있을까요?</p>
            {/* 답글 내용 */}
            <div className="flex flex-col gap-3">
              <textarea
                className="w-full h-24 px-4 py-3.5 rounded-xl outline outline-1 outline-offset-[-1px] outline-babgray text-babgray-800 resize-none focus:outline-none focus:ring-1 focus:ring-bab"
                placeholder="답글을 입력해주세요"
              />
              {/* <p className="self-stretch text-right text-babgray-500 text-xs">0/500</p> */}
            </div>
            <div className="flex justify-end">
              {/* 등록하기 버튼 */}
              <ButtonFillMd style={{ width: 'auto', fontWeight: 400 }}>등록하기</ButtonFillMd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetailPage;
