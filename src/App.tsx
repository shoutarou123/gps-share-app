import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { atom, useAtom } from "jotai";

import "tailwindcss";

import { User } from "./domain/user";
import { GetAllUsers } from "../lib/user";

import Home from "./compornents/home";
import Team from "./compornents/team";
import TeamRegister from "./compornents/team_register";
import { SignupForm } from "./compornents/signupForm";
import LoginForm from "./compornents/LoginForm";
import { SignOutButton } from "./compornents/SignOutButton";
import { ResetPasswordForm } from "./compornents/ResetPasswordForm";
import { PasswordReset } from "./compornents/PasswordReset";
import { MapPage } from "./compornents/MapPage";
import { PostRegister } from "./compornents/post_register";
import { Posts } from "./compornents/posts";
import { Welcome } from "./compornents/Welcome";
import { ToastContainer } from "react-toastify";
import { UserShow } from "./compornents/UserShow";


const usersAtom = atom<User[]>([]); // user情報を管理するatom
const loadingAtom = atom(false)

function App() {
  const [users, setUsers] = useAtom<User[]>(usersAtom);
  // const [loading, setLoading] = useAtom(loadingAtom);

  useEffect(() => {
    const GetAllUser = async () => {
      // setLoading(true);
      const usersData = await GetAllUsers();
      setUsers(usersData);
      // setLoading(false);
    }
    GetAllUser();
  }, [])

  return (
    <>
    <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    {/* {loading ? (<div><p>Loading...</p></div>) : ( */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="signupform" element={<SignupForm/>}/>

          <Route path="login" element={<LoginForm />} />

          <Route path="logout" element={<SignOutButton />} />

          <Route path="resetPasswordForm" element={<ResetPasswordForm />}/>

          <Route path="passwordReset" element={<PasswordReset />}/>


          <Route path="userShow/:id" element={<UserShow />} />

          <Route path="team" element={<Team />} />
          <Route path="/team/register" element={<TeamRegister />} />

          <Route path="/post/register" element={<PostRegister />} />

          <Route path="posts" element={<Posts />} />

          <Route path="mapPage" element={<MapPage />} />

          <Route path="welcome" element={<Welcome />} />
        </Routes>
      </BrowserRouter>
    {/* )} */}
    </>
  )
}

export default App
