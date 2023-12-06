import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { api_url } from "../../global";
import Cookies from "js-cookie";
import moment from 'moment';
import 'moment/locale/ko';

import { jwtDecode } from "jwt-decode";

const BoardMain = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [postList, setList] = useState([
    {
      id: "",
      title: "",
      writer: "",
      hit: "",
      createdAt: "",
      user: {
        name: "",
      }
    },
  ]);

  // 한 페이지 당 나타낼 데이터의 갯수
  const size = 10;
  // 전체 페이지 수
  const totalPage = Math.ceil(postList.length / size);
  // 화면에 나타날 페이지 갯수
  const pageCount = 5;
  // 현재 페이지 번호
  const [curPage, setCurPage] = useState(1);
  // 지금 속해 있는 페이지가 몇번째 페이지 그룹에 속해있는지 계산한다.
  const [pageGroup, setPageGroup] = useState(Math.ceil(curPage / pageCount));
  const offset = (curPage - 1) * size;
  // 그룹 내 마지막 번호
  let lastNum = pageGroup * pageCount;
  if (lastNum > totalPage) {
    lastNum = totalPage;
  }
  // 그룹 내 첫 번호
  let firstNum = lastNum - (pageCount - 1);
  if (pageCount > lastNum) {
    firstNum = 1;
  }

  const authToken = Cookies.get("authToken");

  const pagination = () => {
    let arr = [];
    for (let i = firstNum; i <= lastNum; i++) {
      arr.push(
        <li key={i}>
          <a
            onClick={() => setCurPage(i)}
            className="font-bold flex items-center justify-center text-sm py-2 px-3 leading-tight text-white bg-blue-500 border border-gray-500 hover:bg-gray-100 hover:text-blue-500"
          >
            {i}
          </a>
        </li>
      );
    }
    return arr;
  };

  useEffect(() => {
    if(authToken) {
      try {
        const decodedToken: {permission: string} = jwtDecode(authToken);
        // console.log(decodedToken);
      } catch(error) {
        console.error("Error decoding JWT token:", error);
      }
    }

    axios
      .get(`${api_url}post/${id}/get_all`)
      .then((res) => {
        setList(res.data); 
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  }, []);



  return (
    <div className="pt-16 min-h-screen flex flex-col bg-gray-100">
      <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden p-3">
          <h1 className="text-gray-900 text-3xl title-font font-bold mb-1 ml-3">
            {"as"}
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-end space-y-3 md:space-y-0 md:space-x-4 p-2">
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0 ">
              {authToken !== undefined ? (
                <NavLink
                  to={`/post/write/${id}`}
                  className="flex ml-auto text-white  bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded"
                >
                  글작성
                </NavLink>
              ) : (
                <NavLink
                  onClick={() => {
                    alert("로그인 해주세요");
                  }}
                  to="/login"
                  className="flex ml-auto text-white  bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded"
                >
                  글작성
                </NavLink>
              )}
            </div>
          </div>
          <div className="overflow-x-auto"></div>
          <table
            style={{ minHeight: "20vh" }}
            className="w-full text-sm text-left"
          >
            <thead className="uppercase bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3"
                >
                  제목
                </th>
                <th
                  scope="col"
                  className="px-4 py-3"
                >
                  작성자
                </th>
                <th
                  scope="col"
                  className="px-4 py-3"
                >
                  조회수
                </th>
                <th
                  scope="col"
                  className="px-4 py-3"
                >
                  작성일
                </th>
              </tr>
            </thead>
            {postList.length != 0 ? 
            (<tbody>
              {postList.slice(offset, offset + size).map((post) => {
                // console.log(post.writer);
                return (
                  <tr
                    key={post.id}
                    className="border-b dark:border-gray-700 bg-white"
                  >
                    <td className="px-4 py-3">
                      <Link 
                        to={`/post/${id}/${post.id}`}
                        className="truncate max-w-md block"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{post.user.name}</td>
                    <td className="px-4 py-3">{post.hit}</td>
                    <td className="px-4 py-3">{moment(post.createdAt).format('YYYY년MM월DD일')}</td>
                  </tr>
                );
              })}
            </tbody>):
             (<tbody>
                <tr>
                  <td className="px-4 py-3 border text-center" colSpan={4}>
                    게시글이 없습니다.
                  </td>
                </tr>
              </tbody>)}
            
          </table>
          <nav
            className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
            aria-label="Table navigation"
          >
            <div className="w-full flex justify-center mt-4">
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <button
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0  text-white bg-blue-500 rounded-l-lg border border-gray-500 hover:bg-gray-100 hover:text-blue-400"
                    onClick={() => setPageGroup(pageGroup - 1)}
                    disabled={firstNum === 1}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
                {pagination()}
                <li>
                  <button
                    className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-white bg-blue-500 rounded-r-lg border border-gray-500 hover:bg-gray-100 hover:text-blue-400"
                    onClick={() => setPageGroup(pageGroup + 1)}
                    disabled={lastNum === totalPage}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
    </div>
  );
}

export default BoardMain;