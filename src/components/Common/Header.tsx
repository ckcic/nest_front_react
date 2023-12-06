import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
 
const Header = () => {
  const authToken = Cookies.get("authToken");
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string|null>("");
  
  useEffect(() => { 
    if(authToken) {
      try {
        const decodedToken :{ name: string} = jwtDecode(authToken);
        // console.log(decodedToken);
        setUserName(decodedToken?.name)
      } catch(error) {
        console.error("Error decoding JWT token:", error);
      }
    }
  })

  const handleLogout = () => {
    Cookies.remove("authToken");
    navigate("/");
  };

  return (
    <div className="w-full h-16 fixed flex items-center bg-white border-b-[1px] border-gray-300">
      <div className="ml-5">
        <Link to="/">
          <span className="mr-10 font-bold ">Home</span>
        </Link>
        <Link to="/board">
          <span className="mr-5 ">Board</span>
        </Link>
      </div>
      <div className="ml-auto mr-5">
        {authToken ? (
          <>
            <span className="mr-5">Welcome, {userName}</span>
            <button onClick={handleLogout} className="">
              Logout
            </button>
        </>
        ) : (
          <>
            <Link to="/login">
              <button className="mr-5 ">Login</button>
            </Link>
            <Link to="/register">
              <button className="">Register</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;