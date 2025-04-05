import React from 'react'
import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <h1>home</h1>
      <div
      className='flex flex-col space-y-10'
      >

        <button
          className='bg-gray-50 border border-gray-300 rounded-lg p-2.5'
          onClick={() => navigate("/golocationFetch")}
        >位置情報取得画面へ</button>

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
