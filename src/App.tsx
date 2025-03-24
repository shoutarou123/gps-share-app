import React, { useEffect, useState } from "react";
import "tailwindcss";
import Home from "./compornents/home";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import Login from "./compornents/login";
import Team from "./compornents/team";
import TeamRegister from "./compornents/team_register";
import Post from "./compornents/post";
import PostRegister from "./compornents/post_register";
import Posts from "./compornents/posts";
import Map from "./compornents/map";
import { GetAllUsers } from "../lib/user";
import { User } from "./domain/user";
import Personal from "./compornents/personal";
import PersonalRegister from "./compornents/personalRegister";
import { atom, useAtom } from "jotai";
import { SignupForm } from "./compornents/signupForm";

const usersAtom = atom<User[]>([]); // user情報を管理するatom
const loadingAtom = atom(false)

function App() {
  const [users, setUsers] = useAtom<User[]>(usersAtom);
  const [loading, setLoading] = useAtom(loadingAtom);

  useEffect(() => {
    const GetAllUser = async () => {
      setLoading(true);
      const usersData = await GetAllUsers();
      setUsers(usersData);
      setLoading(false);
    }
    GetAllUser();
  }, [])
  
  return (
    <>
    {loading ? (<div><p>Loading...</p></div>) : (
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="signupform" element={<SignupForm/>}/>

          <Route path="login" element={<Login />} />


          <Route path="personal/:id" element={<Personal />} />
          <Route path="/personal/register" element={<PersonalRegister />} />


          <Route path="team" element={<Team />} />
          <Route path="/team/register" element={<TeamRegister />} />

          <Route path="post" element={<Post />} />
          <Route path="/post/register" element={<PostRegister />} />

          <Route path="posts" element={<Posts />} />

          <Route path="map" element={<Map />} />
        </Routes>
      </BrowserRouter>
    )}
    </>
  )
}

export default App
