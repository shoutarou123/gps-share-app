import React from 'react'
import { useHooks } from '../hooks'

export const PostRegister = () => {
 const { handleFiles, imageContainerRef } = useHooks()
  
  return (
    <>
    <div>投稿登録ページ</div>
    <label>タイトル</label>
    <input
      className='bg-gray-50 border border-gray-300 rounded-lg flex p-2.5'
      type='text'
    />
    <label>内容</label>
    <textarea
      className='border flex'
    />
    <label>画像</label>
    <input
      className='flex border'
      type='file'
      accept='image/*'
      onChange={handleFiles}
    />
    <div
      style={{width: 200, height: 200}}
      ref={imageContainerRef} />
    <button
      className='bg-gray-50 border border-gray-300 rounded-lg p-2.5'
      type='submit'
    >
      送信
    </button>

    </>
  )
}
