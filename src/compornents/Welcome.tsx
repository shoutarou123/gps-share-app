import { Navigate, useNavigate } from "react-router"

export const Welcome = () => {
  const navigate = useNavigate();
  return (

    <>
      <div className="flex flex-col">
        <div className="space-y-4 mx-auto">

          <h1 className="text-2xl font-bold m-6">Welcome!</h1>
          <p>登録完了しました</p>
          <a className='text-center underline cursor-pointer text-blue-600' onClick={() => navigate("/login")}>ログイン画面へ</a>
        </div>
      </div>

    </>
  )
}
