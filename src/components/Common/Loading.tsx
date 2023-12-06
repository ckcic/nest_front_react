import React from "react";
import { SyncLoader } from "react-spinners"
import "../../style/Loading.css"

const Loading = () => {
  return (
    <div className="loadingContainer">
      <SyncLoader color="#B8B8FF" />
    </div>
  );
}

export default Loading;