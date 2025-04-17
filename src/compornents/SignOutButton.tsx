import { useCallback } from "react";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router";


export const SignOutButton = () => {
  const navigate = useNavigate();

  const onLogout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message); // ここでthrowしないと仮にｴﾗｰが発生していても処理が進行しnavigateが実行されｴﾗｰの発生を検知できなくなる
      }
      navigate('/login');
    } catch (err) { // catchはtry内で発生した例外(throwされたもの)のみしかｷｬｯﾁできない
      console.log(err);
    }
  }, []);

  return (
    <>
      <button
      className="
      py-5
      hover:bg-gray-500/80
      backdrop-blur-lg
      focus:outline-none focus:ring-2 focus:ring-amber-500
      rounded-2xl
      font-black
      border
      text-white text-2xl
      cursor-pointer
      "
        onClick={onLogout}
      >
        ログアウト
      </button>
    </>
  );
};
