import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify';
import { loginAtom } from './Atom';
import { useAtom } from 'jotai';
import { supabase } from '../../utils/supabase';

import { BackgroundImage } from './BackgroundImage';

type Inputs = {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [login, setLogin] = useAtom(loginAtom);
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<Inputs>({ defaultValues: { email: "", password: "" } });

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      const { email, password } = data;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error("ログインに失敗しました");
        throw error;
      }
      navigate("/"); // 成功したらrootに遷移
      setLogin(true);
      toast.success("ログインに成功しました");
    } catch (err) {
      console.log("ログイン失敗", err);
    } finally {
      reset(); // ﾌｫｰﾑ,ﾌｫｰﾑ関連ｴﾗｰ,ﾊﾞﾘﾃﾞｰｼｮﾝもﾘｾｯﾄされる
    }
  }

  const handleClick = () => {
    navigate('/resetPasswordForm');
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
        ">

        <h1 className='
          text-4xl text-white font-bold
          pt-10 mb-20
          text-center
          '>
          ログインページ
        </h1>
        <form className='space-y-3 flex flex-col' onSubmit={handleSubmit(onSubmit)}>

          <label className='text-white text-xl'>メールアドレス</label>
          <input
            type="email"
            placeholder='メールアドレスを入力してください'
            className='text-white block border border-gray-300 w-full mb-5 p-3 rounded-md'
            {...register("email")}
          />

          <label className='text-white text-xl'>パスワード</label>
          <input
            type="password"
            placeholder='パスワードを入力してください'
            className='text-white block border border-gray-300 w-full mb-10 p-3 rounded-md'
            {...register("password")}
          />

          <div className='flex flex-col space-y-4'>
            <button
              type="submit"
              className='
                py-5
                bg-sky-700
                mb-5
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
            >
              送信
            </button>
            <a className='
                text-white text-lg text-center
                mb-5
                hover:underline cursor-pointer hover:text-blue-600
                '
              onClick={handleClick}>
              パスワードを忘れた場合はこちら
            </a>
            <button
              type="button"
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
              onClick={() => {
                navigate("/");
              }}
            >
              Homeへ
            </button>
          </div>
        </form>
      </div>
    </BackgroundImage>
  )
}
