import { useNavigate } from 'react-router'
import { supabase } from '../../utils/supabase'
import { BackgroundImage } from './BackgroundImage';

import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify';

type Inputs = {
  password: string;
  confirmPassword: string;
}

export const PasswordReset = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, getValues, formState: {errors} } = useForm<Inputs>({ defaultValues: { password: "" } })

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      const { password } = data;
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      navigate('/login') // 成功したらloginページへ
      toast.success("パスワード変更が完了しました")
    } catch (err) {
      toast.error("エラーが発生しました");
    } finally {
      reset();
    }
  }

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

      <h1 className='text-4xl text-white font-bold
          pt-10 mb-20
          text-center'>パスワード再設定</h1>
      <form className='space-y-3 flex flex-col' onSubmit={handleSubmit(onSubmit)}>
        <label className='text-white text-xl'>パスワード</label>
        <input
          type="password"
          placeholder='パスワードを入力してください'
          className='text-white block border border-gray-300 w-full mb-5 p-3 rounded-md'
          {...register("password", { required: "パスワードは必須です"}) }
        />

        <label className='text-white text-xl'>パスワード確認</label>
        <input
          type="password"
          placeholder='パスワードをもう一度入力...'
          className='text-white block border border-gray-300 w-full mb-5 p-3 rounded-md'
          {...register("confirmPassword", { required: "確認用パスワードは必須です",
            validate: (value) => value === getValues('password') || "パスワードが一致しません"
          })}
        />
        <button
          className='py-5
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
            '>
              送信
          </button>
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </form>
    </div>
    </BackgroundImage>
  )
}
