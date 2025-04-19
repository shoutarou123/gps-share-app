import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import ReactPaginate from 'react-paginate';
import { useAtom } from 'jotai';
import { itemsOffsetAtom, loadingAtom, postAtom } from './Atom';
import { supabase, supabaseUrl } from '../../utils/supabase';

import { Post } from '../domain/post';
import { BackgroundImage } from './BackgroundImage';

export const Posts = () => {
  const [post, setPost] = useAtom<Post[]>(postAtom);
  const [loading, setLoading] = useAtom(loadingAtom)
  const navigate = useNavigate();

  const [itemsOffset, setItemsOffset] = useAtom<number>(itemsOffsetAtom); // ページごとの最初の番号管理

  const itemsPerPage = 5; // 1ページ当たりの表示数
  const endOffset = itemsOffset + itemsPerPage; // endOffsetページの最後の番号
  const currentPosts = post.slice(itemsOffset, endOffset);
  const pageCount = Math.ceil(post.length / itemsPerPage);
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

  const handlePageClick = (e: { selected: number }) => {
    const newOffset = e.selected * itemsPerPage % post.length;
    setItemsOffset(newOffset);
  }

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
              <ReactPaginate
                className='text-sky-500 text-2xl flex flex-row justify-center gap-5 mb-2 cursor-pointer cursor-border'
                pageCount={pageCount}
                onPageChange={handlePageClick}
                marginPagesDisplayed={2} //先頭と末尾に表示するページの数。今回は2としたので1,2…今いるページの前後…後ろから2番目, 1番目 のように表示されます。
                pageRangeDisplayed={1} //上記の「今いるページの前後」の番号をいくつ表示させるかを決めます。
                activeClassName='font-black text-white' //今いるページ番号のクラス名。今いるページの番号だけ太字にしたりできます
                previousLabel='前へ' //前のページ番号に戻すリンクのテキスト
                nextLabel='次へ' //次のページに進むボタンのテキスト
                disabledClassName='disabled' //先頭 or 末尾に行ったときにそれ以上戻れ(進め)なくするためのクラス
                breakLabel='...' // ページがたくさんあるときに表示しない番号に当たる部分をどう表示するか
              />
              <div className='overflow-x-auto w-200'>
                <table className='w-full'>
                  <tbody>
                    <tr className='border'>
                      <th className='border bg-gray-50/20 text-white text-2xl p-1'>タイトル</th>
                      <th className='border bg-gray-50/20 text-white text-2xl p-1'>内容</th>
                      <th className='border bg-gray-50/20 text-white text-2xl p-1'>画像</th>
                    </tr>
                    {currentPosts.map((post) => {
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
                Homeへ
              </button>
            </div>
          </BackgroundImage>
        </>
      }
    </div>
  )
}
