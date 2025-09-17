import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/bobType';

type PostTag = Database['public']['Enums']['post_tag_enum'];
type PostCategory = Database['public']['Enums']['post_category_enum'];

type PostWithNickname = {
  id: number;
  title: string;
  content: string;
  post_category: PostCategory;
  tag: PostTag;
  created_at: string;
  profiles: {
    nickname: string;
  } | null;
};

function PostList() {
  const [posts, setPosts] = useState<PostWithNickname[]>([]);

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
          id,
          title,
          content,
          post_category,
          tag,
          created_at,
          profiles (
            nickname
          )
        `,
        )
        .order('id', { ascending: false });

      if (error) {
        console.error('에러:', error.message);
      }
      setPosts(data as PostWithNickname[]);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>작성자: {post.profiles?.nickname ?? '알 수 없음'}</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
