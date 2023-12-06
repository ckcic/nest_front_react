import React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom"
import Home from "../components/Home";
import Board from "../components/Board/Board";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error"
import Footer from "../components/Common/Footer";
import Register from "../components/Authentication/Register";
import Login from "../components/Authentication/Login";
import PostForm from "../components/Board/PostForm";
import BoardMain from "../components/Board/BoardMain";
import PostMain from "../components/Board/PostMain";
import PostFormUpdate from "../components/Board/PostFormUpdate";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/:id" element={<BoardMain />} />
        
        
        <Route path="/post/:board_id/:id" element={<PostMain />} />
        <Route path="/post/write/:board_id" element={<PostForm />} />
        <Route path="/post/:board_id/:id/update" element={<PostFormUpdate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Error />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default Router;