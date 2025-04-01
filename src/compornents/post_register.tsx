import React, { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'
import { useHooks } from '../hooks'

type PostParams = {
  title: string,
  content: string,
  img: string | File | undefined
}

export const PostRegister = () => {
  const { handleFiles, imageContainerRef } = useHooks();
  const [ title, setTitle] = useState<string>("");
  const [ content, setContent ] = useState<string>("");
  const [ img, setImg ] = useState<string | File | undefined>(); 
  const [ posts, setPosts ] = useState<PostParams[]>([]);
  
  // ｱｲﾏｳﾝﾄ時またはimgが変更された場合に実施
  useEffect(() => {
    return () => {
      if (typeof img === 'string') {
        window.URL.revokeObjectURL(img); // URLを解放する
      }
    };
  }, [img]);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]; // Fileｵﾌﾞｼﾞｪｸﾄが作成されている
      if (!file) return;
      const fileImage = window.URL.createObjectURL(file); // 一時的なURL作成 (blob: <画像のURL>)が作成されている
      setImg(fileImage); // set関数に画像URLを渡す
    }
  }

  const handleSubmit = () => {
    const newPosts = {
      title: title,
      content: content,
      img: img
    }

    setPosts((prevPosts) => {
      return [...prevPosts, newPosts]
    
    })
  }

  return (
    <div className='flex flex-col items-center space-y-4'>
      <div className='text-3xl font-bold'>投稿登録ページ</div>
      <label className='text-xl'>タイトル</label>
      <input
        className='bg-gray-50 border border-gray-300 rounded-lg flex p-2.5'
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className='text-xl'>内容</label>
      <textarea
        className='border flex'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <label className='text-xl'>画像</label>
      <input
        className='flex border'
        type='file'
        accept='image/*'
        onChange={handleFileChange}
      />

      {typeof img === 'string' && (
        <img
          className='flex'
          style={{ width: 200, height: 200 }}
          src={img}
        />
      )}
      <button
        className='bg-gray-50 border border-gray-300 rounded-lg p-2.5'
        type='submit'
        onClick={handleSubmit}
      >
        送信
      </button>

      

      {/* 仮投稿一覧 */}
      <h1>投稿一覧</h1>
      <div>
        {posts.map((post, index) => {
          return (
            <div key={index}>
              <label>タイトル</label>
              <p>{post.title}</p>
              <label>内容</label>
              <p>{post.content}</p>
              {typeof post.img === 'string' && (
                <img
                  className='flex'
                  src={post.img}
                  style={{ width: 200, height: 200}}
                />
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
