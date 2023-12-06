import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { api_url } from "../../global";
import Cookies from "js-cookie";
import moment from 'moment';
import 'moment/locale/ko';

import { jwtDecode } from "jwt-decode";

const Board = () => {
  const navigate = useNavigate();
  const [permission, setPermission] = useState("");

  const createHandle = async () => {
    let name = prompt("생성할 게시판의 이름을 입력해주세요. (2 ~ 50)")
    // console.log(name);
    if(name != null) {
      if(name!.length < 2 || name!.length > 50) {
        alert("게시판 이름은 2 ~ 50 길이로 작성해주세요.")
      }
      else {
        const token = Cookies.get("authToken");;
        const url = `${api_url}board/create`
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
        const body = { name: name }
    
        try {
          const res = await axios.post(url, body, { headers });
          console.log(res.data);
          window.location.reload();
    
        } catch (error) {
          if(error instanceof AxiosError) {
            console.log(error.response?.data.message);
            if (Array.isArray(error.response?.data.message)) {
              const errorMessageString = error.response?.data.message.join('\n');
              alert(errorMessageString)
            } else {
              alert(error.response?.data.message)
            }
          }
        }
      }
    }
  }

  const handleBlockClick = (boardId: string) => {
    // 특정 게시판으로 이동하는 로직
    navigate(`/board/${boardId}`);
  };

  const deleteHandle = async (id: string) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (isConfirmed) {
      const token = Cookies.get("authToken");;
      const url = `${api_url}board/${id}`
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
      try {
        const res = await axios.delete(url, { headers });
        // console.log(res.data);
        alert("삭제되었습니다.");
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("삭제가 취소되었습니다.");
    }
  };
  
  const updateHandle = async (id: string) => {
    let name = prompt("수정할 게시판의 이름을 입력해주세요. (2 ~ 50)")
    if(name != null) {
      if(name!.length < 2 || name!.length > 50) {
        alert("게시판 이름은 2 ~ 50 길이로 작성해주세요.")
      }
      else {
        const token = Cookies.get("authToken");;
        const url = `${api_url}board/${id}`
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
        const body = { name }
    
        try {
          const res = await axios.patch(url, body, { headers });
          console.log(res.data);
          window.location.reload();
    
        } catch (error) {
          if(error instanceof AxiosError) {
            console.log(error.response?.data.message);
            if (Array.isArray(error.response?.data.message)) {
              const errorMessageString = error.response?.data.message.join('\n');
              alert(errorMessageString)
            } else {
              alert(error.response?.data.message)
            }
          }
        }
      }
    }
  };

  const [boardList, setList] = useState([
    {
      id: "",
      board_name: "",
      createdAt: "",
    },
  ]);

  const authToken = Cookies.get("authToken");

  useEffect(() => {
    if(authToken) {
      try {
        const decodedToken: {permission: string} = jwtDecode(authToken);
        // console.log(decodedToken);
        setPermission(decodedToken.permission);
      } catch(error) {
        console.error("Error decoding JWT token:", error);
      }
    }

    axios
      .get(`${api_url}board`)
      .then((res) => {
        setList(res.data); 
        // console.log(res.data);
      })
      .catch((error) => console.log(error));
  }, []);



  return (
    <div className="pt-16 min-h-screen flex flex-col bg-gray-100">
      {permission === "admin" ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-auto absolute top-3 right-[14rem]"
          onClick={createHandle}
        >
          게시판 생성
        </button>
      ) : null}
  
      <div className="flex flex-wrap gap-4 mt-4 pl-4">
        {boardList.map((board) => (
          <div
            key={board.id}
            className="relative border cursor-pointer hover:border-blue-500 transition-all duration-300 min-w-[10rem] max-w-[20rem] py-1 flex flex-col justify-center items-center"
          >
            <div className="z-0"  onClick={() => handleBlockClick(board.id)}>
              <h1 className="text-lg text-center font-bold mb-2">{board.board_name}</h1>
              <p className="text-[0.7rem] text-gray-500 font-light">
                {moment(board.createdAt).format('YYYY년 MM월 DD일 hh시 mm분')}
              </p>
            </div>
            {permission === "admin" ? (
              <div className="flex mt-2 ml-2 z-10">
                <button
                  className="mr-2 text-blue-500"
                  onClick={() => updateHandle(board.id)}
                >
                  수정
                </button>
                <button
                  className="text-red-500"
                  onClick={() => deleteHandle(board.id)}
                >
                  삭제
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;