import React from "react";

const Logout = () => {
  const handleLogout = () => {
    localStorage.setItem("_token", "");
    // Redirect to the login page
    window.location.href = "/login";
  };

  return (
    <></>
    // <div>
    //   <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
    //     <span className="me-2">
    //       <i className="fa-solid fa-arrow-right-from-bracket"></i>
    //     </span>{" "}
    //     Logout
    //   </button>
    // </div>
  );
};

export default Logout;
