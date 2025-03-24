import { supabase } from "../utils/supabase";
import { User } from "../src/domain/user";

export async function GetAllUsers() : Promise<User[]>{ //User型のｵﾌﾞｼﾞｪｸﾄを要素としてもつ配列を返すことを保証している。他のuserのﾃﾞｰﾀもあるはずなので配列となる。
  const response = await supabase.from("users").select("*");
  if (response.error) {
    throw new Error(response.error.message);
  }

  const usersData = response.data.map((user) => {
    return new User(user.id, user.name, user.unit, user.age, user.adress, user.email, user.image)
  });
  return usersData;
}