import { useAtom } from 'jotai';
import { loadingAtom, postAtom } from './Atom';
import { Post } from '../domain/post';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase, supabaseUrl } from '../../utils/supabase';



export const Posts = () => {
  const [post, setPost] = useAtom<Post[]>(postAtom);
  const [loading, setLoading] = useAtom(loadingAtom)
  const navigate = useNavigate();

  const SUPABASE_STORAGE_URL = `${supabaseUrl}/storage/v1/object/public/post-images`;

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts').select('id, title, content, image_url, movie_url').order('created_at', { ascending: false });
        if (error) throw error;

        const postsWithUrls = data.map((post) => {
          return post.image_url
            ? {
              ...post,
              image_url: `${SUPABASE_STORAGE_URL}/${post.image_url}`
              }
           : {
              ...post,
              image_url: null
             }
        });
        setPost(postsWithUrls);

      } catch (error) {
        console.error('データ取得エラー', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [setPost])
  console.log('post', post);

  return (
    <div>
      {loading ? <p>Loading...</p> :
        <>
          <h1>投稿一覧</h1>

          <table>
            <tbody>
              <tr className='border'>
                <th className='border'>タイトル</th>
                <th className='border'>内容</th>
                <th className='border'>画像</th>
              </tr>
              {post.map((post) => {
                console.log(post)
                return (
                  <tr key={post.id}>
                    <td className='border'>{post.title}</td>
                    <td className='border'>{post.content ?? '内容なし'}</td>
                    <td className='border'>
                      { post.image_url ?
                        <img
                          src={post.image_url ?? ''}
                          alt={`${post.title}の画像`}
                          style={{
                            width: '100px',
                            height: '100px'
                          }}
                        />
                        :
                        <span>画像なし</span>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <button
            className='bg-gray-50 border border-gray-300 rounded-lg p-2.5'
            onClick={() => navigate('/post/register')}
          >投稿登録へ</button>
        </>
      }
    </div>
  )
}
