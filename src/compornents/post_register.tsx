import React, { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'
import { useHooks } from '../hooks'
import { useAtom } from 'jotai'
import { postAtom, postContentAtom, postTitleAtom, previewImgAtom, uploadImageAtom } from './Atom'
import { Post } from '../domain/post'
import { supabase } from '../../utils/supabase'

export const PostRegister = () => {
  const { handleFiles, imageContainerRef } = useHooks();
  const [newTitle, setNewTitle] = useAtom<string>(postTitleAtom);
  const [newContent, setNewContent] = useAtom<string>(postContentAtom);
  const [uploadImg, setUploadImg] = useAtom<File | null>(uploadImageAtom);
  const [previewImg, setPreviImg] = useAtom<string | undefined>(previewImgAtom)
  const [post, setPost] = useAtom<Post[]>(postAtom);

  // ｱｲﾏｳﾝﾄ時またはimgが変更された場合に実施
  useEffect(() => {
    return () => {
      if (typeof previewImg === 'string') {
        window.URL.revokeObjectURL(previewImg); // URLを解放する
      }
    };
  }, [previewImg]);

  // ﾌｧｲﾙ選択時の処理
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadImg(e.target.files[0]); // Fileｵﾌﾞｼﾞｪｸﾄをset関数へ渡す
      setPreviImg(window.URL.createObjectURL(e.target.files[0]));
    }
  };

  // プレビュー表示関数
  // const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file: File = e.target.files[0]; // Fileｵﾌﾞｼﾞｪｸﾄが作成されている
  //     if (!file) return;
  //     const fileImage: string = window.URL.createObjectURL(file); // 一時的なURL作成 (blob: <画像のURL>)が作成されている
  //     setNewImg(fileImage); // set関数に画像URLを渡す
  //   }
  // }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!uploadImg) {
        alert('画像を選択してください');
        return;
      }

      const uploadFile = `${Date.now()}-${uploadImg.name}`; // 一意なﾌｧｲﾙとすため日付と名前をのちに渡す準備
      console.log('uploadFileの中身', uploadFile);

      // Supabase Storage に画像をアップロード
      const { data: uploadData, error: uploadError } = await supabase.storage // supabaseのstorageにｱｯﾌﾟﾛｰﾄﾞする、その後dataとerrorを取得
        .from('post-images')
        .upload(uploadFile, uploadImg);
      console.log('uploadDataの中身', uploadData);

      if (uploadError) throw uploadError; // ｴﾗｰがあればｴﾗｰを投げる

      // 公開用URL取得
      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(uploadData.path); // 公開Url取得 このコードは、Supabase Storageに保存されたファイルの公開URLを取得。 urlData オブジェクトの中に 沢山ﾌﾟﾛﾊﾟﾃｨがあり、そのうちpublicUrlというﾌﾟﾛﾊﾟﾃｨも含まれている。それが実際の公開URL（例: https://your-supabase-url/storage/v1/object/public/post-images/example.jpg）です。
      console.log('urlDataの中身', urlData);

      const imageUrl = urlData.publicUrl; // 沢山あるﾌﾟﾛﾊﾟﾃｨからpublicUrlを取出し代入
      console.log('imageUrlの中身', imageUrl);

      // ﾃﾞｰﾀﾍﾞｰｽへ挿入
      const { error } = await supabase.from("posts").insert([
        {
          title: newTitle,
          content: newContent,
          image: imageUrl // storageのURLをdatabaseに保存
        },
      ]);

      if (error) throw error;

      // ローカル状態更新
      setPost((prevPosts) => {
        return [...prevPosts, { title: newTitle, content: newContent, img: imageUrl }]
      })

      // ﾌｫｰﾑｸﾘｱ
      setNewTitle('');
      setNewContent('');
      setPreviImg(undefined);

      // uploadのset関数をｸﾘｱ
      setUploadImg(null);

      alert('投稿が成功しました');

    } catch (error) {
      console.error(error);
      alert('投稿に失敗しました');
    }
  };

  return (
    <div className='flex flex-col items-center space-y-4'>
      <div className='text-3xl font-bold'>投稿登録ページ</div>
      <form onSubmit = {handleSubmit}>
      <label className='text-xl'>タイトル</label>
      <input
        className='bg-gray-50 border border-gray-300 rounded-lg flex p-2.5'
        type='text'
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <label className='text-xl'>内容</label>
      <textarea
        className='border flex'
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
      />
      <label className='text-xl'>画像</label>
      <input
        className='flex border'
        type='file'
        accept='image/*'
        onChange={handleFileChange}
      />

      {previewImg && (
        <img
          className='flex'
          style={{ width: 200, height: 200 }}
          src={previewImg}
        />
      )}
      <button
        className='bg-gray-50 border border-gray-300 rounded-lg p-2.5'
        type='submit'
      >
        送信
      </button>
      </form>



      {/* 仮投稿一覧 */}
      <h1>投稿一覧</h1>
      <div>
        {post.map((post, index) => {
          return (
            <div key={index}>
              <label>タイトル</label>
              <p>{post.title}</p>
              <label>内容</label>
              <p>{post.content}</p>
              {post.img && (
                <img
                  className='flex'
                  src={post.img}
                  style={{ width: 200, height: 200 }}
                />
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
