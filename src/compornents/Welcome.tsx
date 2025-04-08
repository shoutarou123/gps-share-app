import { Navigate, useNavigate } from "react-router"

export const Welcome = () => {
  const navigate = useNavigate();
  return (

    <>
      <h1>Welcome!</h1>
      <p>登録完了しました</p>
      <a className='text-center hover:underline cursor-pointer hover:text-blue-600' onClick={() => navigate("/login")}>ログイン画面へ</a>

    </>
  )
}
