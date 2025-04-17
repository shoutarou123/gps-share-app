import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import { atom, useAtom } from "jotai";

import "tailwindcss";

import { User } from "./domain/user";
import { GetAllUsers } from "../lib/user";

import Home from "./compornents/home";
import Team from "./compornents/team";
import TeamRegister from "./compornents/team_register";
import Post from "./compornents/post";
import Personal from "./compornents/personal";
import PersonalRegister from "./compornents/personalRegister";
import { SignupForm } from "./compornents/signupForm";
import LoginForm from "./compornents/LoginForm";
import { SignOutButton } from "./compornents/SignOutButton";
import { ResetPasswordForm } from "./compornents/ResetPasswordForm";
import { PasswordReset } from "./compornents/PasswordReset";
import { MapPage } from "./compornents/MapPage";
import { PostRegister } from "./compornents/post_register";
import { Posts } from "./compornents/posts";
import { Welcome } from "./compornents/Welcome";


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
    {/* {loading ? (<div><p>Loading...</p></div>) : ( */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="signupform" element={<SignupForm/>}/>

          <Route path="login" element={<LoginForm />} />

          <Route path="logout" element={<SignOutButton />} />

          <Route path="resetPasswordForm" element={<ResetPasswordForm />}/>

          <Route path="passwordReset" element={<PasswordReset />}/>


          <Route path="personal/:id" element={<Personal />} />
          <Route path="/personal/register" element={<PersonalRegister />} />


          <Route path="team" element={<Team />} />
          <Route path="/team/register" element={<TeamRegister />} />

          <Route path="post" element={<Post />} />
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
