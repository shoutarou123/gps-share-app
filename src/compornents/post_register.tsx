import React, { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { useHooks } from '../hooks'
import { useAtom } from 'jotai'
import { postAtom, postContentAtom, postTitleAtom, previewImgAtom, previewMovieAtom, uploadImageAtom, uploadMovieAtom } from './Atom'
import { Post } from '../domain/post'
import { supabase } from '../../utils/supabase'
import { useNavigate } from 'react-router'

export const PostRegister = () => {
  const { handleFiles, imageContainerRef } = useHooks();
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newTitle, setNewTitle] = useAtom<string>(postTitleAtom);
  const [newContent, setNewContent] = useAtom<string | null>(postContentAtom);
  const [uploadImg, setUploadImg] = useAtom<File | null>(uploadImageAtom);
  const [previewImg, setPreviewImg] = useAtom<string | null>(previewImgAtom);
  const [uploadMovie, setUploadMovie] = useAtom<File | null>(uploadMovieAtom);
  const [previeMovie, setPrevieMovie] = useAtom<string | null>(previewMovieAtom);

  const [post, setPost] = useAtom<Post[]>(postAtom);

  const navigate = useNavigate();

  // ｱｲﾏｳﾝﾄ時またはimgが変更された場合に実施
  useEffect(() => {
    return () => {
      if (previewImg)
        window.URL.revokeObjectURL(previewImg)
    }
  }, [previewImg])

  // ﾌｧｲﾙ選択時の処理
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadImg(e.target.files[0]); // File {name: '68D15BCE-75E7-48FF-A211-9FB44F70F551.jpg', lastModified: 1743412391308, lastModifiedDate: Mon Mar 31 2025 18:13:11 GMT+0900 (日本標準時), webkitRelativePath: '', size: 1465902, …}
      setPreviewImg(window.URL.createObjectURL(e.target.files[0])); // blob:http://localhost:5173/b891c190-bb8b-488b-a143-0504fe503fe2
    } else {
      setUploadImg(null);
    }
  }

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

      // 一意なﾌｧｲﾙとすため日付と名前をのちに渡す準備
      const uploadFile = `${Date.now()}-${uploadImg.name}` // 1743659642286-68D15BCE-75E7-48FF-A211-9FB44F70F551.jpg
      const uploadResult = await supabase.storage.from('post-images').upload(uploadFile, uploadImg); // data: {path: '1743660191468-68D15BCE-75E7-48FF-A211-9FB44F70F551.jpg', id: 'e26384d9-a7ef-4972-8320-ec0d0662ebc5', fullPath: 'post-images/1743660191468-68D15BCE-75E7-48FF-A211-9FB44F70F551.jpg'} error: null
      if (uploadResult.error) {
        throw uploadResult.error;
      }

      // 公開用URL取得 ｱﾌﾟﾘｹｰｼｮﾝ内で利用するために必要 Supabase Storageに保存されたファイルの公開URLを取得している
      // urlData オブジェクトの中に 沢山ﾌﾟﾛﾊﾟﾃｨがあり、そのうちpublicUrlというﾌﾟﾛﾊﾟﾃｨも含まれている。
      const getPublicResult = supabase.storage.from('post-images').getPublicUrl(uploadResult.data.path); // data: publicUrl: "https://vsxyeuqkhyjcmduveczr.supabase.co/storage/v1/object/public/post-images/1743660353453-68D15BCE-75E7-48FF-A211-9FB44F70F551.jpg"
      const imageUrl = getPublicResult.data.publicUrl;

      // ﾃﾞｰﾀﾍﾞｰｽへ挿入
      const dataBaseInsertResult = await supabase.from('posts').insert([
        {
          title: newTitle,
          content: newContent,
          image_url: imageUrl, // 公開URL形式でﾃﾞｰﾀﾍﾞｰｽへ保存
          movie_url: previeMovie
        }
      ])
      .select(); // 挿入ﾃﾞｰﾀを取得 postを更新するために必要

      if (dataBaseInsertResult.error) throw dataBaseInsertResult.error;

      // ローカル状態更新
      setPost((prevPost) => {
        return [...prevPost, { id: dataBaseInsertResult.data[0].id, title: newTitle, content: newContent, image_url: imageUrl, movie_url: previeMovie }]
      })

      // ﾌｧｲﾙ入力ﾘｾｯﾄ
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // ﾌｫｰﾑｸﾘｱ
      setNewTitle('');
      setNewContent('');
      setPreviewImg(null);
      setPrevieMovie(null);

      // uploadのset関数をｸﾘｱ
      setUploadImg(null);
      setUploadMovie(null);

      alert('投稿に成功しました');

    } catch (error) {
      console.error(error);
      alert('投稿に失敗しました');
    }
  };

  return (
    <div className='flex flex-col items-center space-y-4'>
      <div className='text-3xl font-bold'>投稿登録ページ</div>
      <form onSubmit={handleSubmit}>
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
          value={newContent ?? ''}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <label className='text-xl'>画像</label>
        <input
          ref={fileInputRef}
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
        <button
          className='bg-gray-50 border border-gray-300 rounded-lg p-2.5'
          onClick={() => navigate("/posts")}
        >
          投稿一覧へ
        </button>
    </div>
  )
}
