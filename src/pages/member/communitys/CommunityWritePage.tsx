function CommunityWritePage() {
  return (
    <div>
      <p>게시글 작성</p>
      <div>
        <div>
          <p>
            카테고리 <p>*</p>
          </p>
          <div>
            <button>자유 게시판</button>
            <button>Q&A</button>
            <button>팁·노하우</button>
          </div>
        </div>
        <div>
          <p>
            제목 <p>*</p>
          </p>
          <input />
          <div>0/100 글자수</div>
        </div>
        <div>
          <p>
            내용 <p>*</p>
          </p>
          <textarea />
          <div>0/500 글자수</div>
        </div>
        <div>
          <p>게시글 작성 가이드</p>
          <ul>
            <li>서로 존중하는 댓글 문화르 만들어가요</li>
            <li>개인 정보나 연락처는 공개하지 말아주세요</li>
            <li>광고성 게시글은 삭제될 수 있습니다</li>
          </ul>
        </div>
        <div>
          <button>취소</button>
          <button>매칭 등록하기</button>
        </div>
      </div>
    </div>
  );
}

export default CommunityWritePage;
