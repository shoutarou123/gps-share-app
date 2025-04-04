import { useAtom } from 'jotai';
import { loadingAtom, postAtom } from './Atom';
import { Post } from '../domain/post';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../utils/supabase';



export const Posts = () => {
  const [post, setPost] = useAtom<Post[]>(postAtom);
  const [loading, setLoading] = useAtom(loadingAtom)
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const selectResult = await supabase
          .from('posts').select('id, title, content, image_url, movie_url').order('created_at', { ascending: false });
        if (selectResult.error) throw selectResult.error;
        setPost(selectResult.data);

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
                return (
                  <tr key={post.id}>
                    <td className='border'>{post.title}</td>
                    <td className='border'>{post.content ?? '内容なし'}</td>
                    <td className='border'>
                      <img
                        src={post.image_url ?? ''}
                        alt={post.title}
                        style={{
                          width: '100px',
                          height: '100px'
                        }}
                      />
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
