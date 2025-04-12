import React from 'react'
import { useNavigate } from 'react-router'
import { GeolocationFetchButton } from './GeolocationFetchButton';

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <h1 className='text-2xl font-bold m-6 text-center'>位置情報管理システム</h1>
      <div
      className='flex flex-col space-y-10 w-100 m-auto'
      >

        <GeolocationFetchButton />

        <button
          className='bg-gray-50 border border-gray-300 rounded-lg p-2.5'
          onClick={() => navigate("/post/register")}
        >投稿登録画面へ</button>

        <button
          className='bg-gray-50 border border-gray-300 rounded-lg p-2.5'
          onClick={() => navigate("/posts")}
        >投稿一覧画面へ</button>

        <button
          className='bg-gray-50 border border-gray-300 rounded-lg p-2.5'
          onClick={() => navigate("/login")}
        >ログイン画面へ</button>

        <button
          className='bg-gray-50 border border-gray-300 rounded-lg p-2.5'
          onClick={() => navigate("/signupform")}
        >サインアップ画面へ</button>
      </div>


    </>
  )
}
