import React, { ChangeEventHandler, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import { useAtom } from 'jotai'
import { postAtom, postContentAtom, postTitleAtom, previewImgAtom, previewMovieAtom, uploadImageAtom, uploadMovieAtom } from './Atom'
import { supabase } from '../../utils/supabase'

import { Post } from '../domain/post'
import { BackgroundImage } from './BackgroundImage'

export const PostRegister = () => {
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

  const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        { enableHighAccuracy: true }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      const { data: authData, error: authError } = await supabase.auth.getUser();
      console.log('authDataの値', authData);
      console.log('authErrorの値', authError);

      if (authError) throw authError;

      if (!authData) {
        toast.error('ログインが必要です');
        return;
      }

      // 座標取得成功
      const position = await getLocation();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      let imagePath = null;

      if (uploadImg) {
        // 一意なﾌｧｲﾙとすため日付と名前をのちに渡す準備
        const uploadFile = `${Date.now()}-${uploadImg.name}` // 1743659642286-68D15BCE-75E7-48FF-A211-9FB44F70F551.jpg
        const uploadResult = await supabase.storage.from('post-images').upload(uploadFile, uploadImg); // data: {path: '1743660191468-68D15BCE-75E7-48FF-A211-9FB44F70F551.jpg', id: 'e26384d9-a7ef-4972-8320-ec0d0662ebc5', fullPath: 'post-images/1743660191468-68D15BCE-75E7-48FF-A211-9FB44F70F551.jpg'} error: null
        if (uploadResult.error) {
          throw uploadResult.error;
        }
        imagePath = uploadResult.data.path;
        // 公開用URL取得 ｱﾌﾟﾘｹｰｼｮﾝ内で利用するために必要 Supabase Storageに保存されたファイルの公開URLを取得している
        // urlData オブジェクトの中に 沢山ﾌﾟﾛﾊﾟﾃｨがあり、そのうちpublicUrlというﾌﾟﾛﾊﾟﾃｨも含まれている。
        const getPublicResult = supabase.storage.from('post-images').getPublicUrl(uploadResult.data.path); // data: publicUrl: "https://[project-id].supabase.co/storage/v1/object/public/post-images/1743660353453-68D15BCE-75E7-48FF-A211-9FB44F70F551.jpg"
        const imageUrl = getPublicResult.data.publicUrl;
        console.log('getPublicResultの値', getPublicResult);
        console.log('imageUrlの値', imageUrl);
      }

      // ﾃﾞｰﾀﾍﾞｰｽへ挿入
      const { data: postData, error: postError } = await supabase.from('posts').insert([
        {
          title: newTitle,
          content: newContent,
          image_url: imagePath, // ﾌｧｲﾙ名形式でﾃﾞｰﾀﾍﾞｰｽへ保存
          movie_url: previeMovie
        }
      ])
        .select(); // 挿入ﾃﾞｰﾀを取得 postを更新するために必要
      if (postError) throw postError;

      // ﾃﾞｰﾀﾍﾞｰｽへ座標を挿入
      const { data, error: gisError } = await supabase.schema('public').from('post_locations').insert({
        post_id: postData[0].id,
        location: `SRID=4326;POINT(${longitude} ${latitude})`
      });
      console.log('data', data);
      if (gisError) throw gisError;

      // ローカル状態更新
      setPost((prevPost) => {
        return [...prevPost, { id: postData[0].id, title: newTitle, content: newContent, image_url: imagePath, movie_url: previeMovie }]
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

      toast.success('投稿に成功しました');

    } catch (error) {
      console.error(error);
      toast.error('投稿に失敗しました');
    }
  };

  return (
    <BackgroundImage>
      <div className="
            w-120
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
        <h1 className='
          text-4xl text-white font-bold
          pt-10 mb-20
          text-center
        '
        >
          投稿登録</h1>
        <form className='space-y-3 flex flex-col' onSubmit={handleSubmit}>
          <label className='text-white text-2xl'>タイトル</label>
          <input
            className='text-white text-xl block border border-gray-300 w-full mb-5 p-3 rounded-md'
            type='text'
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <label className='text-white text-2xl'>内容</label>
          <textarea
            className='text-white text-xl w-90 mt-2 mb-2 border border-gray-300 rounded-lg flex'
            value={newContent ?? ''}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <label className='text-white text-2xl'>画像</label>
          <input
            ref={fileInputRef}
            className='text-white block border border-gray-300 w-full mb-5 p-3 rounded-md'
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
          <div className='flex flex-col mt-5'>
            <button
              className='
                py-5
                bg-sky-700
                mb-7
                hover:bg-sky-800
                backdrop-blur-lg
                focus:outline-none focus:ring-2 focus:ring-sky    -500
                rounded-2xl
                font-black
                border
                border-sky-700
                text-white text-2xl
                cursor-pointer
              '
              type='submit'
            >
              送信
            </button>
          </div>
        </form>
        <button
          className='
            w-50
            mx-auto
            py-5
            mb-7
            bg-lime-600 hover:bg-lime-700
            backdrop-blur-lg
            focus:outline-none focus:ring-2 focus:ring-amber-500
            rounded-2xl
            font-black
            border
            text-white text-2xl
            cursor-pointer
          '
          onClick={() => navigate("/posts")}
        >
          投稿一覧へ
        </button>
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
          onClick={() => navigate("/")}
        >
          Homeへ
        </button>
      </div>
    </BackgroundImage>
  )
}
