import { SubmitHandler, useForm } from 'react-hook-form';
import { isRouteErrorResponse, useNavigate } from 'react-router';
import { supabase } from '../../utils/supabase';
import { User } from '../domain/user';
import { useAtom } from 'jotai';
import { userRegisterAtom } from './Atom';

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
  const [ userInfomation, setUserInfomation ] = useAtom(userRegisterAtom);

// メールアドレスの重複チェック（APIﾙｰﾄ経由）
const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3000/api/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if(!response.ok) {
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

const {register, handleSubmit, reset} = useForm<SignUpFormData>({defaultValues:{name: "", unit: "", age: 0, address: "", email:"", password:""}}); // defaultValuesを入れることによりﾌｫｰﾑ全体を管理できる
 // react-hook-form では、ﾌｫｰﾑの各入力ﾌｨｰﾙﾄﾞが一つ一つ独立して状態を管理されるわけではなく、 複数のﾌｨｰﾙﾄﾞを一つのｵﾌﾞｼﾞｪｸﾄとして管理しているため、引数はｵﾌﾞｼﾞｪｸﾄになる。

 const onSubmit: SubmitHandler<SignUpFormData> = async (data: SignUpFormData) => {
  try { // SubmitHandler は、react-hook-form ﾗｲﾌﾞﾗﾘから提供されている型で、ﾌｫｰﾑの送信処理を行う関数に使う。この型は、ﾌｫｰﾑの入力ﾃﾞｰﾀが正しくﾊﾞﾘﾃﾞｰﾄされた後に呼ばれる submit handler の型を定義するために使われます。
    const { email } = data; // dataに入っているemail,passwordを取り出す

    // メールアドレス重複チェック
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      alert("このメールアドレスは既に登録されています");
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
      alert("既に登録済のユーザーです");
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
      {id: authUserId, name: data.name, unit: data.unit, age: data.age, address: data.address, email: data.email}
    ])
    .select(); // 挿入されたデータ取得
    ;

    if (dbError || !insertedData || insertedData.length === 0) {
      throw new Error("データベースへの登録が失敗しました");
    }

    // set関数に登録データを保存
    setUserInfomation(insertedData[0]);

    alert("登録に成功しました");
    navigate("/login"); // 成功したらrootに遷移
  } catch (err) {
    alert("登録に失敗しました");
  } finally {
    reset(); // ﾌｫｰﾑ,ﾌｫｰﾑ関連ｴﾗｰ,ﾊﾞﾘﾃﾞｰｼｮﾝもﾘｾｯﾄされる
  }
};

const handleClick = () => {
  navigate("/login");
};


  return (
    <div className='flex flex-col p-4'>
      <div className='mx-auto '>


      <h1 className='text-2xl font-bold mb-6'>ユーザー登録</h1>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <label>名前</label>
        <input
        className='block border border-gray-300 w-70 p-2 rounded-md'
        type='text'
        {...register("name", { required: true })}
        placeholder="名前を入力してください"
        />

        <label>所属</label>
        <input
          className='block border border-gray-300 w-full p-2 rounded-md'
          type='text'
        {...register("unit", { required: true })}
        placeholder="所属を入力してください"
        />

        <label>年齢</label>
        <input
          className='block border border-gray-300 w-full p-2 rounded-md'
          type='number'
          {...register("age", { required: true })}
          placeholder="年齢を入力してください"
        />

        <label>住所</label>
        <input
          className='block border border-gray-300 w-full p-2 rounded-md'
          type='text'
          {...register("address", { required: true })}
          placeholder="都道府県・市町村名を入力してください"
        />

        <label>メールアドレス</label>
        <input
          type="email"
          className='block border border-gray-300 w-full p-3 rounded-md'
          {...register("email", { required: true })}
          placeholder='メールアドレスを入力してください'
        />

        <label>パスワード</label>
        <input
          type="password"
          className='block border border-gray-300 w-full p-3 rounded-md'
          {...register("password", { required: true })}
          placeholder='パスワードを入力してください'
          />

       <div className='flex flex-col space-y-4'>
        <button
        type="submit"
        className='bg-blue-600 text-white hover:bg-blue-700 rounded-md p-3'
        >登録</button>

        <a className='hover:underline cursor-pointer hover:text-blue-600 text-center' onClick={handleClick}>アカウントを持っている場合</a>
        <button
        className='bg-gray-50 border border-gray-300 rounded-lg p-2.5'
        onClick={() => navigate("/")}
      >
        Homeへ
      </button>
        </div>
      </form>

      </div>
    </div>
  )
}

// handleSubmitはﾌｫｰﾑ送信時の処理を担当し、入力ﾃﾞｰﾀをonSubmit関数に渡す関数。
// onSubmitはhandleSubmitでﾗｯﾌﾟされた関数で、ﾌｫｰﾑのﾃﾞｰﾀを受け取る。
