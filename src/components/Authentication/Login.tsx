import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_url } from "../../global";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email:"",
    password:"",
  });
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center flex-col bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-4/12 min-w-min">
        <h1 className="font-bold text-2xl text-center mb-6">Login</h1>
        <form 
          onSubmit={async (event) => {
            event.preventDefault();
            
            const url = `${api_url}users/login`
            const headers = { "Content-Type": "application/json" };
            const body = {
              email: form.email,
              password: form.password,
            };

            try {
              const res = await axios.post(url, body, { headers });
              // console.log(res.data);
              const token = res.data;
              
              Cookies.set("authToken", token);

              navigate("/")
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
          className="flex flex-col"
        >
          <input
            type="email"
            placeholder="Email"
            className="mb-6 p-2 border border-gray-300 rounded"
            required
            onChange={(event) => {
              setForm({ ...form, email: event.target.value });
            }}
          />
          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="p-2 border border-gray-300 rounded w-full"
              required
              onChange={(event) => {
                setForm({ ...form, password: event.target.value });
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-2 cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}


export default Login;