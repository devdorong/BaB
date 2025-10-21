import { RiStarSFill, RiStarHalfSFill, RiStarLine } from 'react-icons/ri';

interface StarRatingProps {
  rating: number;
}

export const StarRating = ({ rating }: StarRatingProps) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        if (rating >= starValue) {
          // 꽉 찬 별
          return <RiStarSFill key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />;
        } else if (rating >= starValue - 0.5) {
          // 반쪽 별
          return <RiStarHalfSFill key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />;
        } else {
          // 빈 별
          return <RiStarLine key={i} className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />;
        }
      })}
    </div>
  );
};
