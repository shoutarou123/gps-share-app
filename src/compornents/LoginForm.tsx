import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router'
import { supabase } from '../../utils/supabase';

type Inputs = {
  email: string;
  password: string;
}

export default function LoginForm() {
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
        throw new Error(error.message);
      }
      navigate("/"); // 成功したらrootに遷移
      alert("ログインに成功しました");
    } catch (err) {
      alert("ログインに失敗しました");
    } finally {
      reset(); // ﾌｫｰﾑ,ﾌｫｰﾑ関連ｴﾗｰ,ﾊﾞﾘﾃﾞｰｼｮﾝもﾘｾｯﾄされる
    }
  }

  const handleClick = () => {
    navigate('/resetPasswordForm');
  };

  return (
    <div className='flex flex-col'>
      <div className='space-y-4 mx-auto'>

        <h1 className='text-center text-2xl font-bold m-6'>ログインページ</h1>

        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>

          <label>メールアドレス</label>
          <input
            type="email"
            placeholder='メールアドレスを入力してください'
            className='block border border-gray-300 w-70 p-2 rounded-md'
            {...register("email")}
          />

          <label>パスワード</label>
          <input
            type="password"
            placeholder='パスワードを入力してください'
            className='block border border-gray-300 w-full p-2 rounded-md'
            {...register("password")}
          />

          <div className='flex flex-col space-y-4'>
            <button
              type="submit"
              className='bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 hover:cursor-pointer'
            >
              ログイン
            </button>
            <a className='text-center hover:underline cursor-pointer hover:text-blue-600' onClick={handleClick}>パスワードを忘れた</a>
          </div>
        </form>
      </div>
    </div>
  )
}
