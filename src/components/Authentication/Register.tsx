import React, { useState } from "react";
import { api_url } from "../../global";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center flex-col bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-4/12 min-w-min">
        <h1 className="font-bold text-2xl text-center mb-6">Register</h1>
        <form 
          onSubmit={async (event) => {
            event.preventDefault();
            
            setErrors({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            });

            if (form.password === form.confirmPassword) {
              const url = `${api_url}users/register`
              const headers = { "Content-Type": "application/json" };
              const body = {
                name: form.name,
                email: form.email,
                password: form.password,
              }

            try {
              const res = await axios.post(url, body, { headers });
              console.log(res.data);

              navigate("/login")
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

            } else {
              setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: "Passwords do not match.",
              }));
            }
            
          }} 
          className="flex flex-col"
        >
          <input
            type="text"
            placeholder="Username"
            className="mb-6 p-2 border border-gray-300 rounded"
            required
            onChange={(event) => {
              setForm({ ...form, name: event.target.value });
            }}
          />
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
          <div className="mb-6 relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="p-2 border border-gray-300 rounded w-full"
              required
              onChange={(event) => {
                setForm({ ...form, confirmPassword: event.target.value });
              }}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-2 right-2 cursor-pointer"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm pt-2">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;