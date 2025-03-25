import { SubmitHandler, useForm } from 'react-hook-form'
import { supabase } from '../../utils/supabase';

type Inputs = {
  email: string;
}

export const ResetPasswordForm = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>({ defaultValues: { email: "" } });
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const { email } = data;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/passwordReset`,
      });
      if (error) {
        throw new Error(error.message);
      }
      alert('パスワード再設定メールを送信しました。メールを確認してください。');
    } catch (err) {
      console.log(err)
    } finally {
      reset();
    };
  };

  return (
    <>
      <div className='text-2xl font-bold'>パスワードリセットページ</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>メールアドレス</label>
        <input
          type="email"
          placeholder='メールアドレスを入力してください'
          className='block border border-gray-300'
          {...register("email")}
        />
        <button
        type="submit"
        className='bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer'
        >送信</button>
      </form>
    </>
  )
  
};
