import { SubmitHandler, useForm } from 'react-hook-form';
import { isRouteErrorResponse, useNavigate } from 'react-router';
import { supabase } from '../../utils/supabase';
import { User } from '../domain/user';
import { useAtom } from 'jotai';
import { userRegisterAtom } from './Atom';
import Toast from './Toast';
import { BackgroundImage } from './BackgroundImage';
import { toast } from 'react-toastify';

// ﾌｫｰﾑ専用の型
type SignUpFormData = {
  name: string;
  unit: string;
  age: number;
  address: string;
  email: string;
  password: string; // ﾌｫｰﾑ入力でのみ使用
};

export const SignupForm = () => {
  const navigate = useNavigate();
  const [userInfomation, setUserInfomation] = useAtom(userRegisterAtom);

  // メールアドレスの重複チェック（APIﾙｰﾄ経由）
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3000/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        console.error('サーバーエラー', response.status);
        return false;
      }

      const result = await response.json();
      return result.exists;
    } catch (err) {
      console.error('メールアドレス確認エラー:', err);
      return false;
    }
  };

  const { register, handleSubmit, reset } = useForm<SignUpFormData>({ defaultValues: { name: "", unit: "", age: 0, address: "", email: "", password: "" } }); // defaultValuesを入れることによりﾌｫｰﾑ全体を管理できる
  // react-hook-form では、ﾌｫｰﾑの各入力ﾌｨｰﾙﾄﾞが一つ一つ独立して状態を管理されるわけではなく、 複数のﾌｨｰﾙﾄﾞを一つのｵﾌﾞｼﾞｪｸﾄとして管理しているため、引数はｵﾌﾞｼﾞｪｸﾄになる。

  const onSubmit: SubmitHandler<SignUpFormData> = async (data: SignUpFormData) => {
    try { // SubmitHandler は、react-hook-form ﾗｲﾌﾞﾗﾘから提供されている型で、ﾌｫｰﾑの送信処理を行う関数に使う。この型は、ﾌｫｰﾑの入力ﾃﾞｰﾀが正しくﾊﾞﾘﾃﾞｰﾄされた後に呼ばれる submit handler の型を定義するために使われます。
      const { email } = data; // dataに入っているemail,passwordを取り出す

      // メールアドレス重複チェック
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        toast.error("このメールアドレスは既に登録されています");
        return;
      }

      // サインアップ処理
      const { data: signUpData, error } = await supabase.auth.signUp({
        // supabaseにemail等を渡してからerrorを取り出す
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`
        }
        // locationとは、現在表示されているｳｪﾌﾞﾍﾟｰｼﾞのURLを抽出したり、別のﾍﾟｰｼﾞへ遷移する場合などに便利なｵﾌﾞｼﾞｪｸﾄ。
        // location.origin	ﾌﾟﾛﾄｺﾙﾎﾟｰﾄを含めたURLを取得する もしﾕｰｻﾞｰがhogehogeというURLで登録していた場合、登録後のﾒｰﾙについているﾘﾝｸ先がhogehoge/welcomになる。
      });

      // ここでも簡易的なメールアドレス重複チェック identitiesは登録済のｱﾄﾞﾚｽなら空の配列を返す
      if (signUpData.user?.identities?.length === 0) {
        console.log("既に登録済のユーザーです");
        return;
      };

      if (error) { // 上で取り出したerrorがtrueなら
        throw new Error(error.message); // errorをｽﾛｰする
      }

      // Authが生成したUUIDを取得
      const authUserId = signUpData.user?.id;
      if (!authUserId) {
        throw new Error("ユーザー登録に失敗しました");
      }

      // テーブルに登録データを保存 passwordは保存しない
      const { data: insertedData, error: dbError } = await supabase
        .from('users')
        .insert([
          { id: authUserId, name: data.name, unit: data.unit, age: data.age, address: data.address, email: data.email }
        ])
        .select(); // 挿入されたデータ取得
      ;

      if (dbError || !insertedData || insertedData.length === 0) {
        throw new Error("データベースへの登録が失敗しました");
      }

      // set関数に登録データを保存
      setUserInfomation(insertedData[0]);

      toast.success("登録に成功しました");
      navigate("/login"); // 成功したらrootに遷移
    } catch (err) {
      toast.error("登録に失敗しました");
    } finally {
      reset(); // ﾌｫｰﾑ,ﾌｫｰﾑ関連ｴﾗｰ,ﾊﾞﾘﾃﾞｰｼｮﾝもﾘｾｯﾄされる
    }
  };

  const handleClick = () => {
    navigate("/login");
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
          ユーザー登録
        </h1>
        <form className='space-y-3 flex flex-col' onSubmit={handleSubmit(onSubmit)}>

          <label className='text-white text-xl'>名前</label>
          <input
            className='text-white block border border-gray-300 w-full mb-5 p-3 rounded-md'
            type='text'
            {...register("name", { required: true })}
            placeholder="名前を入力してください"
          />

          <label className='text-white text-xl'>所属</label>
          <input
            className='text-white block border border-gray-300 w-full mb-5 p-3 rounded-md'
            type='text'
            {...register("unit", { required: true })}
            placeholder="所属を入力してください"
          />

          <label className='text-white text-xl'>年齢</label>
          <input
            className='text-white block border border-gray-300 w-full mb-5 p-3 rounded-md'
            type='number'
            {...register("age", { required: true })}
            placeholder="年齢を入力してください"
          />

          <label className='text-white text-xl'>住所</label>
          <input
            className='text-white block border border-gray-300 w-full mb-5 p-3 rounded-md'
            type='text'
            {...register("address", { required: true })}
            placeholder="都道府県・市町村名を入力してください"
          />

          <label className='text-white text-xl'>メールアドレス</label>
          <input
            type="email"
            className='text-white block border border-gray-300 w-full mb-5 p-3 rounded-md'
            {...register("email", { required: true })}
            placeholder='メールアドレスを入力してください'
          />

          <label className='text-white text-xl'>パスワード</label>
          <input
            type="password"
            className='text-white block border border-gray-300 w-full mb-5 p-3 rounded-md'
            {...register("password", { required: true })}
            placeholder='パスワードを入力してください'
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
            >送信</button>

            <a className='
                text-white text-lg text-center
                mb-5
                hover:underline cursor-pointer hover:text-blue-600
                '
              onClick={handleClick}>
              アカウントを持っている場合
            </a>
            <button
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
              onClick={() => navigate("/")}
            >
              Homeへ
            </button>
          </div>
        </form>
      </div>
    </BackgroundImage>
  )
}

// handleSubmitはﾌｫｰﾑ送信時の処理を担当し、入力ﾃﾞｰﾀをonSubmit関数に渡す関数。
// onSubmitはhandleSubmitでﾗｯﾌﾟされた関数で、ﾌｫｰﾑのﾃﾞｰﾀを受け取る。
