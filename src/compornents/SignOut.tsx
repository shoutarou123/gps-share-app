import { useCallback } from "react";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router";


export const SignOut =  () => {
  const navigate = useNavigate();

  const onLogout = useCallback( async() => {
    try {
      const {error} = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message); // ここでthrowしないと仮にｴﾗｰが発生していても処理が進行しnavigateが実行されｴﾗｰの発生を検知できなくなる
      } 
      navigate('/login');
    } catch (err) { // catchはtry内で発生した例外(throwされたもの)のみしかｷｬｯﾁできない
      console.log(err);
    } 
  },[]);

  return (
    <button
      onClick={onLogout}
    >
      ログアウト
    </button>
  );
};