import { supabase } from '../../utils/supabase'
import { useNavigate } from 'react-router'
import { SubmitHandler, useForm } from 'react-hook-form'

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
      alert("パスワード変更が完了しました")
    } catch (err) {
      alert("エラーが発生しました");
    } finally {
      reset();
    }
  }

  return (
    <div>
      <h1 className='text-5xl font-bold'>パスワード再設定登録画面</h1>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <label>パスワード</label>
        <input
          type="password"
          placeholder='パスワードを入力してください'
          className='block border border-gray-300'
          {...register("password", { required: "パスワードは必須です"}) }
        />

        <label>パスワード確認</label>
        <input 
          type="password"
          placeholder='パスワードをもう一度入力...'
          className='block border border-gray-300'
          {...register("confirmPassword", { required: "確認用パスワードは必須です",
            validate: (value) => value === getValues('password') || "パスワードが一致しません"
          })}
        />
        <button className='bg-blue-600 text-white hover:cursor-pointer hover:bg-blue-700'>パスワード変更</button>
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </form>
    </div>
  )
}
