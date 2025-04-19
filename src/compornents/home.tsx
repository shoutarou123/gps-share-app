import { useNavigate } from 'react-router'
import { useAtomValue } from 'jotai';
import { loginAtom } from './Atom';

import { GeolocationFetchButton } from './GeolocationFetchButton';
import { SignOutButton } from './SignOutButton';
import { BackgroundImage } from './BackgroundImage';

export default function Home() {
  const navigate = useNavigate();
  const login = useAtomValue(loginAtom);

  return (
    <>
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
        ">

          <h1
            className='
              text-4xl text-white font-bold
              pt-10 mb-20
              text-center
              '
          >
            災害時部隊管理システム
          </h1>
          {login ? (
            <div
              className='flex flex-col space-y-10 w-70 m-auto'
            >
              <GeolocationFetchButton />

              <button
                className='
                py-5
                bg-amber-500 hover:bg-amber-600
                focus:outline-none focus:ring-2 focus:ring-amber-500
                rounded-2xl
                font-black text-white text-2xl
                border
                cursor-pointer
                '
                onClick={() => navigate("/post/register")}
              >
                投稿
              </button>

              <button
                className="
                py-5
                bg-lime-600 hover:bg-lime-700
                backdrop-blur-lg
                focus:outline-none focus:ring-2 focus:ring-amber-500
                rounded-2xl
                font-black
                border
                text-white text-2xl
                cursor-pointer
                "
                onClick={() => navigate("/posts")}
              >
                投稿一覧
              </button>
              <SignOutButton />
            </div>
          ) : (
            <div
              className='flex flex-col space-y-10 w-100 m-auto'
            >
              <button
                className="
                py-5
                bg-sky-700
                hover:bg-sky-800
                backdrop-blur-lg
                focus:outline-none focus:ring-2 focus:ring-sky    -500
                rounded-2xl
                font-black
                border
                border-sky-700
                text-white text-2xl
                cursor-pointer
                "
                onClick={() => navigate("/login")}
              >ログイン画面へ</button>

              <button
                className="
                py-5
                hover:bg-gray-500/80
                backdrop-blur-lg
                focus:outline-none focus:ring-2 focus:ring-amber-500
                rounded-2xl
                font-black
                border
                text-white text-2xl
                cursor-pointer
                "
                onClick={() => navigate("/signupform")}
              >サインアップ画面へ</button>
            </div>
          )}
           </div>
        </BackgroundImage>
      {/* </div> */}
    </>
  )
}
