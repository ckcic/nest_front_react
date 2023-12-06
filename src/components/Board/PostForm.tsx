import React, { SyntheticEvent, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImageActions } from "@xeger/quill-image-actions";
import { ImageFormats } from "@xeger/quill-image-formats";
import { api_url } from "../../global";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

const PostForm = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("")
  const { board_id } = useParams();
  const handleContentChange = (content: any) => {
    setCode(content);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  };

  const quillRef = useRef<ReactQuill>(null);

  
  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const editor = quillRef.current?.getEditor();
    console.log(editor);
  
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener('change', async () => {
      const file = input.files?.[0];
  
      if (file && /^image\//.test(file.type)) {
        console.log(file);
  
        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await axios.post(`${api_url}post/file_upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const IMG_URL = api_url + "uploads/" + res.data.url;

          const editor = quillRef.current?.getEditor();

          const range = editor?.getSelection();

          console.log("File upload success:", res.data.url);
          editor?.insertEmbed(range!.index, 'image', IMG_URL);

        } catch (e) {
          console.log("file upload fail", e);
        }
      }
    })
  };

  const modules = useMemo(() => ({
    imageActions: {},
    imageFormats: {},
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', "strike", { 'align': [] }, { 'color': [] }, { 'background': [] }, 'clean'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['image', "link",],
        ['blockquote', 'code-block', { 'list': 'ordered'}, { 'list': 'bullet' }],
      ],
      handlers: {
        image: imageHandler
      },
      ImageResize: {
        modules: ['Resize']
      }
    },
    clipboard: {
      matchVisual: false,
    },
  }), [])

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const token = Cookies.get("authToken");
    if(token) {
      const decodedToken: {id: string} = jwtDecode(token);
      console.log(decodedToken);
      try {
        const url = `${api_url}post/write`
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
        const body = {
          writer: decodedToken.id,
          boardId: board_id,
          title,
          content: code,
        };
        await axios.post(url, body, { headers });

        navigate(`/board/${board_id}`)
  
      } catch (e) {
        console.log(e);
      }
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'align',
    // 'float',
    'height',
    'width'
  ];

  return (
    <div className="pt-16 min-h-screen min-w-max">
      <div className="mt-2 p-6">
        <div className="p-2 mb-2 flex items-center">
          <label style={{minWidth: "5%"}} htmlFor="title" className="">제목</label>
          <input style={{minWidth: "85%"}} className="border border-gray-300  ml-2 p-1 rounded required" id="title" type="text" onChange={handleTitleChange}></input>
        <button 
          style={{minWidth: "5%"}}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-auto"
          onClick={handleSubmit}
        >
          작성
        </button>
        </div>
        <ReactQuill
          ref={quillRef}
          style={{height: "50vh"}}
          theme="snow"
          modules={modules}
          formats={formats}
          className="quill-editor"
          value={code}
          placeholder={"내용을 입력해주세요"}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
}

export default PostForm;