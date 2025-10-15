import { useState } from 'react';

interface ReviewContentProps {
  comment: string;
}

const ReviewContent = ({ comment }: ReviewContentProps) => {
  const [expanded, setExpanded] = useState(false);

  // 200자 이상일 때만 "더보기" 표시
  const isLong = comment.length > 200;
  const displayedText = expanded ? comment : comment.slice(0, 200);

  return (
    <div className="mt-5 text-[14px] text-babgray-800">
      <p className="whitespace-pre-wrap leading-relaxed">
        {displayedText}
        {!expanded && isLong && '...'}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-[13px] text-babgray-500 hover:text-babgray-700 transition-colors"
          >
            {expanded ? '접기' : '더보기'}
          </button>
        )}
      </p>
    </div>
  );
};

export default ReviewContent;
