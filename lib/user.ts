import { supabase } from "../utils/supabase";
import { User } from "../src/domain/user";

export async function GetAllUsers() : Promise<User[]>{ //User型のｵﾌﾞｼﾞｪｸﾄを要素としてもつ配列を返すことを保証している。他のuserのﾃﾞｰﾀもあるはずなので配列となる。
  const response = await supabase.from("users").select("*");
  if (response.error) {
    throw new Error(response.error.message);
  }

  const usersData = response.data.map((user) => {
    return new User(user.id, user.user_id, user.name, user.unit, user.age, user.address, user.email)
  });
  return usersData;
}

// usersテーブルから自分のデータを取得
export async function GetUser() :Promise<User>{
  const { data: {user} } = await supabase.auth.getUser();
  if (!user) throw new Error('ユーザーが認証されていません');

  const { data, error } = await supabase
  .from('users')
  .select("*")
  .eq('id', user.id)
  .single();

  if (error) throw new Error('データ取得エラー', { cause: error.message});
  return data;
}
