import React from "react";
import "tailwindcss";
import Home from "./compornents/home";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./compornents/login";
import UserRegister from "./compornents/user_register";
import User from "./compornents/user";
import Team from "./compornents/team";
import TeamRegister from "./compornents/team_register";
import Post from "./compornents/post";
import PostRegister from "./compornents/post_register";
import Posts from "./compornents/posts";
import Map from "./compornents/map";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="login" element={<Login />} />


          <Route path="user" element={<User />} />
          <Route path="/user/register" element={<UserRegister />} />


          <Route path="team" element={<Team />} />
          <Route path="/team/register" element={<TeamRegister />} />

          <Route path="post" element={<Post />} />
          <Route path="/post/register" element={<PostRegister />} />

          <Route path="posts" element={<Posts />} />
          
          <Route path="map" element={<Map />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
