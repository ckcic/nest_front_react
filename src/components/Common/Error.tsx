import React from "react";

const Error = () => {
  return (
    <div className="pt-16 flex flex-col items-center justify-center h-screen bg-black">
      <h2 className="text-4xl font-bold text-[#F8F7FF]">404 Not Found</h2>
      <p className="text-lg text-[#F8F7FF]">The page you are looking for does not exist.</p>
    </div>
  );
}

export default Error;