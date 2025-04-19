import { SubmitHandler, useForm } from 'react-hook-form'
import { supabase } from '../../utils/supabase';
import { BackgroundImage } from './BackgroundImage';
import { toast } from 'react-toastify';

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
      toast.success('パスワード再設定メールを送信しました。メールを確認してください。');
    } catch (err) {
      console.log(err)
    } finally {
      reset();
    };
  };

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
      <h1 className='
        text-4xl text-white font-bold
        pt-10 mb-20
        text-center
        '
      >
        パスワードリセットページ
      </h1>

      <form
       className='space-y-3 flex flex-col' onSubmit={handleSubmit(onSubmit)}>

        <label className='text-white text-xl'>メールアドレス</label>
        <input
          type="email"
          placeholder='メールアドレスを入力してください'
          className='text-white block border border-gray-300 w-full mb-5 p-3 rounded-md'
          {...register("email")}
        />
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
        >送信</button>
      </form>
      </div>
      </BackgroundImage>
    </>
  )
};
