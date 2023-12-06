import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { api_url } from "../../global";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import DOMPurify from 'dompurify';
import moment from 'moment';
import 'moment/locale/ko';

const PostMain = () => {
  const navigate = useNavigate();
  const { board_id, id } = useParams();
  const authToken = Cookies.get("authToken");
  const [post, setPost] = useState(
    {
      id: "",
      title: "",
      writer: "",
      content: "",
      hit: "",
      createdAt: "",
      user: {
        name: "",
      }
    },
  );
  const [comments, setComments] = useState([
    {
      id: "",
      writer: "",
      content: "",
      createdAt: "",
      user: {
        name: "",
      }
    }
  ]); // 댓글 목록 추가
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 추가
  const [user, setUser] = useState({
    id: "",
    name: "",
  });

  const deleteCommentHandle = async (id: string) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (isConfirmed) {
      const token = Cookies.get("authToken");;
      const url = `${api_url}comment/${id}`
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

  const deletePostHandle = async (id: string) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (isConfirmed) {
      const token = Cookies.get("authToken");;
      const url = `${api_url}post/${id}`
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
      try {
        const res = await axios.delete(url, { headers });
        // console.log(res.data);
        alert("삭제되었습니다.");
        navigate(`/board/${board_id}`);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("삭제가 취소되었습니다.");
    }
  };
  
  const updateCommentHandle = async (id: string) => {
    let content = prompt("수정할 내용을 입력해주세요. (2 ~ 50)")
    if(content != null) {
      if(content!.length < 2 || content!.length > 1000) {
        alert("댓글은 2자이상 1000자이하로 작성해주세요.")
      }
      else {
        const token = Cookies.get("authToken");;
        const url = `${api_url}comment/${id}`
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
        const body = { content }
    
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

  const updatePostHandle = async (id: string) => {
    navigate(`/post/${board_id}/${id}/update`)
  };
  
  useEffect(() => {
    if(authToken) {
      try {
        const decodedToken: {id: string, name: string} = jwtDecode(authToken);
          // console.log(decodedToken);
          setUser({
            id:  decodedToken.id,
            name: decodedToken.name,
          });
      } catch(error) {
        console.error("Error decoding JWT token:", error);
      }
    }

    axios
      .get(`${api_url}post/${id}`)
      .then((res) => {
        setPost(res.data); 
        console.log(res.data);
      })
      .catch((error) => console.log(error));

    // 게시물에 대한 댓글 불러오기
    axios
    .get(`${api_url}comment/getAll/${id}`)
    .then((res) => {
      setComments(res.data);
    })
    .catch((error) => console.log(error));
  }, []);

  const handleCommentSubmit = () => {
    // 새로운 댓글을 서버에 전송 및 저장
    const url = `${api_url}comment/write`
    const body = {
      writer: user.id,
      postId: id,
      content: newComment,
    }
    const headers = { "Content-Type": "application/json" };
    axios
      .post(url, body, { headers })
      .then((res) => {
        // 댓글 추가 후, 댓글 목록을 다시 불러옴
        axios
          .get(`${api_url}comment/getAll/${id}`)
          .then((res) => {
            setComments(res.data);
          })
          .catch((error) => console.log(error));

        // 새로운 댓글 입력 필드 초기화
        setNewComment("");
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="pt-16 min-h-screen flex flex-col bg-gray-100 items-center justify-center">
      <div className="mb-4 p-4 bg-white rounded-md min-h-[63.5vh] min-w-[100%]">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-lg font-bold">
            {post.title}
          </div>
          {post.writer === user.id && (
            <div className="flex ml-2 mr-10 z-10">
              <button
                className="mr-5 text-blue-500"
                onClick={() => updatePostHandle(post.id)}
              >
                수정
              </button>
              <button
                className="text-red-500"
                onClick={() => deletePostHandle(post.id)}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t pt-2 mb-4">
          <div className="flex items-center">
            <div className="text-xs mr-4">조회수: {post.hit}</div>
            <div className="text-xs mr-4">작성자: {post.user.name}</div>
            <div className="text-xs">작성일: {moment(post.createdAt).format('YYYY년MM월DD일')}</div>
          </div>
        </div>
        
      {post.content && (
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content, { USE_PROFILES: { html: true } }) }} />
      )}
      </div>

      {/* 댓글 목록 표시 */}
      {comments.length != 0 && (
        <div className="mt-4 min-w-[75%]">
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} className="mr-2 mb-2 p-2 bg-white rounded">
                <div className="text-sm">작성자: {comment.user.name}</div>
                <div className="text-sm">{comment.content}</div>
                <div className="text-xs">작성일: {moment(comment.createdAt).format('YYYY년MM월DD일HH시MM분SS초')}</div>
                {comment.writer === user.id ? (
                  <div className="flex mt-2 ml-2 z-10">
                    <button
                      className="mr-2 text-blue-500"
                      onClick={() => updateCommentHandle(comment.id)}
                    >
                      수정
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => deleteCommentHandle(comment.id)}
                    >
                      삭제
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 댓글 입력 필드 */}
      {authToken && (
        <div className="mt-4 flex flex-col md:flex-row min-w-[75%]">
          <div className="flex-grow flex items-center">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow p-2 border rounded min-h-[100px] resize-none"
              placeholder="댓글을 입력하세요."
            />
            <button onClick={handleCommentSubmit} className="ml-2 max-h-10 bg-blue-500 text-white p-2 rounded-sm hover:bg-blue-700 transition text-sm">댓글 등록</button>
          </div>
        </div>
      )}
    

      <div className="px-4 py-3">
        <Link 
          to={`/board/${board_id}`}
          className="truncate max-w-md block text-center bg-blue-500 text-white font-bold py-2 px-4  hover:bg-blue-700 transition"
        >
          목록
        </Link>
      </div>
    </div>
  )
}

export default PostMain;