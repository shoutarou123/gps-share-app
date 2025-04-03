import { useAtom } from 'jotai';
import { loadingAtom, postAtom } from './Atom';
import { Post } from '../domain/post';
import { supabase } from '../../utils/supabase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';



export const Posts = () => {
  const [post, setPost] = useAtom<Post[]>(postAtom);
  const [loading, setLoading ] = useAtom(loadingAtom)
  const navigate = useNavigate();

  useEffect( () => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const selectResult = await supabase.from('posts').select('*');
        console.log('selectResult', selectResult);
        if (selectResult.error) throw selectResult.error;
        console.log('postの値', post);
        const listResult = await supabase.storage.from('post-images').list('');
        console.log('listResult',listResult);
      } catch (error) {
        console.error('データ取得エラー', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [setPost])

  return (
    <>
      {/* 仮投稿一覧 */}
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
          <th className='border'>{post.title}</th>
          <th className='border'>{post.content}</th>
          <th className='border'>{post.image}</th>
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
  )
}
