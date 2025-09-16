import { useState } from 'react';
import type { Database, posts } from '../../types/bobType';

// Supabase enum 타입 정의
type PostTag = Database['public']['Enums']['post_tag_enum'];

// 샘플 태그 리스트
const TAGS: PostTag[] = ['자유', '맛집추천요청', 'Q&A', '팁&노하우'];

export default function TagSelector() {
  const [selectedTags, setSelectedTags] = useState<PostTag[]>([]);

  const handleTagClick = (tag: PostTag) => {
    // 이미 선택된 태그면 제거, 아니면 추가
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  return (
    <div className="p-4">
      <h2 className="mb-2 font-bold">태그 선택</h2>
      <div className="flex gap-2 flex-wrap">
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full border ${
              selectedTags.includes(tag)
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">선택된 태그:</h3>
        {selectedTags.length > 0 ? (
          <ul className="list-disc ml-5">
            {selectedTags.map(tag => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">아직 태그가 선택되지 않았습니다.</p>
        )}
      </div>
    </div>
  );
}
