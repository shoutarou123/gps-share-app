import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { supabase } from '../../utils/supabase';

type Inputs = {
  email: string;
  password: string;
}

export const SignupForm = () => {
const navigate = useNavigate();
const {register, handleSubmit, reset} = useForm<Inputs>({defaultValues:{email:"", password:""}}); // defaultValuesを入れることによりﾌｫｰﾑ全体を管理できる
 // react-hook-form では、ﾌｫｰﾑの各入力ﾌｨｰﾙﾄﾞが一つ一つ独立して状態を管理されるわけではなく、 複数のﾌｨｰﾙﾄﾞを一つのｵﾌﾞｼﾞｪｸﾄとして管理しているため、引数はｵﾌﾞｼﾞｪｸﾄになる。
const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
  try { // SubmitHandler は、react-hook-form ﾗｲﾌﾞﾗﾘから提供されている型で、ﾌｫｰﾑの送信処理を行う関数に使う。この型は、ﾌｫｰﾑの入力ﾃﾞｰﾀが正しくﾊﾞﾘﾃﾞｰﾄされた後に呼ばれる submit handler の型を定義するために使われます。
    const { email, password } = data; // dataに入っているemail,passwordを取り出す
    const { error } = await supabase.auth.signUp({ // supabaseにemail等を渡してからerrorを取り出す
      email,
      password,
      options: {
        emailRedirectTo:`${window.location.origin}/welcome` // 確認用ﾒｰﾙの遷移遷移先が/welcomeとしている locationとは、現在表示されているｳｪﾌﾞﾍﾟｰｼﾞのURLを抽出したり、別のﾍﾟｰｼﾞへ遷移する場合などに便利なｵﾌﾞｼﾞｪｸﾄです。
      } // location.origin	ﾌﾟﾛﾄｺﾙﾎﾟｰﾄを含めたURLを取得する もしﾕｰｻﾞｰがhogehogeというURLで登録していた場合、登録後のﾒｰﾙについているﾘﾝｸ先がhogehoge/welcomになる。
    });
    if (error) { // 上で取り出したerrorがtrueなら
    throw new Error(error.message); // errorをｽﾛｰする
    }
    navigate("/"); // 成功したらrootに遷移
  } catch (err) {
    console.log(err);
  } finally {
    reset(); // ﾌｫｰﾑ,ﾌｫｰﾑ関連ｴﾗｰ,ﾊﾞﾘﾃﾞｰｼｮﾝもﾘｾｯﾄされる
  }
};

const handleClick = () => {
  navigate("/login");
};


  return (
    <div>
      <h1 className='text-2xl font-bold'>サインアップページ</h1>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <label>メールアドレス</label>
        <input
          type="email"
          placeholder='メールアドレスを入力してください'
          className='block border border-gray-300'
          {...register("email")}
        />
        <label>パスワード</label>
        <input
          type="password"
          placeholder='パスワードを入力してください'
          className='block border border-gray-300'
          {...register("password")}
        />
        <button
        type="submit"
        className='bg-blue-600 text-white hover:bg-blue-700'
        >サインアップ</button>
        <a className='hover:underline cursor-pointer hover:text-blue-600' onClick={handleClick}>アカウントを持っている場合</a>
      </form>


    </div>
  )
}

// handleSubmitはﾌｫｰﾑ送信時の処理を担当し、入力ﾃﾞｰﾀをonSubmit関数に渡す関数。
// onSubmitはhandleSubmitでﾗｯﾌﾟされた関数で、ﾌｫｰﾑのﾃﾞｰﾀを受け取る。