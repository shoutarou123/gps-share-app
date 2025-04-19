import { useAtom } from 'jotai';
import { loadingAtom, postAtom } from './Atom';
import { Post } from '../domain/post';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase, supabaseUrl } from '../../utils/supabase';
import { BackgroundImage } from './BackgroundImage';



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
          <BackgroundImage>
            <div
              className="
              bg-gray-200/10
              backdrop-blur-lg
              rounded-md
              border
              border-gray-200/10
              shadow-lg
              flex flex-col
              justify-center
              px-10
              py-8
              "
            >

              <h1
                className='
                  text-4xl text-white font-bold
                  pt-10 mb-20
                  text-center
                  '
              >
                投稿一覧
              </h1>

              <div className='overflow-x-auto w-200'>
                <table className='w-full'>
                  <tbody>
                    <tr className='border'>
                      <th className='border bg-gray-50/20 text-white text-3xl'>タイトル</th>
                      <th className='border bg-gray-50/20 text-white text-3xl'>内容</th>
                      <th className='border bg-gray-50/20 text-white text-3xl'>画像</th>
                    </tr>
                    {post.map((post) => {
                      console.log(post)
                      return (
                        <tr key={post.id}>
                          <td className='border text-white text-2xl pl-5'>{post.title}</td>
                          <td className='border text-white text-xl pl-5'>{post.content ?? '内容なし'}</td>
                          <td className='border text-white text-xl pl-2'>
                            {post.image_url ?
                              <a
                                href={post.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                              >
                                <img
                                  src={post.image_url ?? ''}
                                  alt={`${post.title}の画像`}
                                  style={{
                                    width: '100px',
                                    height: '100px'
                                  }}
                                />
                              </a>
                              :
                              <span className='text-white text-xl'>画像なし</span>
                            }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <button
                className='
                w-50
                py-5
                my-5
                mx-auto
                bg-amber-500 hover:bg-amber-600
                focus:outline-none focus:ring-2 focus:ring-amber-500
                rounded-2xl
                font-black text-white text-2xl
                border
                cursor-pointer
                '
                onClick={() => navigate('/post/register')}
              >投稿</button>
              <button
                className='
                w-50
                py-5 mb-3
                mx-auto
                hover:bg-gray-500/80
                backdrop-blur-lg
                focus:outline-none focus:ring-2 focus:ring-amber-500
                rounded-2xl
                font-black
                border
                text-white text-2xl
                cursor-pointer
                '
                onClick={() => navigate('/')}
              >
                homeへ
              </button>
            </div>
          </BackgroundImage>
        </>
      }
    </div>
  )
}
