import { supabase } from "../utils/supabase";


export const GetUserData = async (): Promise<string | undefined> => {
  const {data: {user}, error} = await supabase.auth.getUser();
  if(error) throw error;
  return user?.id;
};
