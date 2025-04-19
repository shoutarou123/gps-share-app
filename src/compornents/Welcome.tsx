import { Navigate, useNavigate } from "react-router"
import { BackgroundImage } from "./BackgroundImage";

export const Welcome = () => {
  const navigate = useNavigate();
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
            className="
              text-4xl text-white font-bold
              pt-10 mb-20
              text-center
              "
          >
            Welcome!
          </h1>
          <p>登録完了しました</p>
          <a className='
            text-white text-lg text-center
            mb-5
            hover:underline cursor-pointer hover:text-blue-600
            '
            onClick={() => navigate("/login")}
          >
            ログイン画面へ
          </a>
        </div>
      </BackgroundImage>
    </>
  )
}
