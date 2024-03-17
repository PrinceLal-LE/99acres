import "./login.css";

import React, { useState } from "react";

import axios from "axios";
import companyLogo from "./assets/images/company_logo.jpg";
import loginImage from "./assets/images/login.jpg";
import { useNavigate } from "react-router-dom";

function Login() {
  const [values, setValues] = useState({
    txtuserName: "",
    txtPassword: "",
    rememberMe: false,
    accountType: "",
  });
  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.accountType) {
      alert("Please choose an account type.");
      return;
    }

    const loginData = {
      LoginID: values.txtuserName,
      Password: values.txtPassword,
      RememberMe: values.rememberMe,
      AccountType: values.accountType,
    };

    try {
      const res = await axios.post("http://localhost:8081/login", loginData);
      localStorage.setItem("_token", res.data.token);
      if (res.data.Status === "Success") {
        if (values.rememberMe) {
          localStorage.setItem("rememberedUser", values.txtuserName);
        } else {
          localStorage.removeItem("rememberedUser");
        }
        navigate("/listing");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      alert("An error occurred during login. Please try again later.");
    }
  };

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleAccountTypeSelect = (type) => {
    if (values.accountType === type) {
      // If the same button is double-clicked, deselect it
      setValues({ ...values, accountType: "" });
    } else {
      setValues({ ...values, accountType: type });
    }
  };

  return (
    <main>
      <div className="container ">
        <div className="loginContainer">
          <div className="row loginRow">
            <div className="col-md-5 d-none d-md-block px-0">
              <img src={loginImage} alt="login" className="loginImages" />
            </div>
            <div className="col-md-7 my-5">
              <div className="loginColumn">
                <img
                  src={companyLogo}
                  alt="Dreamworld Properties"
                  className={`logo ${values.accountType && "logo-small"}`}
                />
              </div>
              <div className="creditinal">
                <p className="login-card-description ">Log In</p>
                <form method="post" onSubmit={handleSubmit}>
                  <input
                    type="hidden"
                    name="action"
                    value="InventoryLoginSystem"
                  />

                  <div className="row right">
                    <h4 style={{ textAlign: "center" }}>Choose any Account </h4>
                    <div className="d-flex justify-content-between gap-2 mb-3 bg-light px-3 py-3 rounded border">
                      <button
                        type="button"
                        className={`btn btn-outline-primary  ${
                          values.accountType === "DreamWorldInv" ? "active" : ""
                        }`}
                        onClick={() => handleAccountTypeSelect("DreamWorldInv")}
                        onDoubleClick={() =>
                          setValues({ ...values, accountType: "" })
                        }
                      >
                        {" "}
                        <span className="selected_chk">
                          <i className="fa-solid fa-check"></i>
                        </span>
                        DreamWorld Inventory{" "}
                      </button>
                      <div>
                        <button
                          type="button"
                          className={`btn btn-outline-primary ${
                            values.accountType === "99Acres" ? "active" : ""
                          }`}
                          onClick={() => handleAccountTypeSelect("99Acres")}
                          onDoubleClick={() =>
                            setValues({ ...values, accountType: "" })
                          }
                          // disabled={values.accountType === "Listing"}
                        >
                          <span className="selected_chk">
                            <i className="fa-solid fa-check"></i>
                          </span>
                          99Acres Inventory{" "}
                        </button>
                      </div>
                      <button
                        type="button"
                        className={`btn btn-outline-primary ${
                          values.accountType === "Listing" ? "active" : ""
                        }`}
                        onClick={() => handleAccountTypeSelect("Listing")}
                        onDoubleClick={() =>
                          setValues({ ...values, accountType: "" })
                        }
                        // disabled={values.accountType === "99Acres"}
                      >
                        <span className="selected_chk">
                          <i className="fa-solid fa-check"></i>
                        </span>
                        99Acres Listing{" "}
                      </button>
                    </div>
                  </div>
                  {values.accountType && (
                    <div>
                      <div>
                        <h1 className="text-center text-dark fs-6 my-2 mb-4 fw-normal">
                          👋 Hi! Welcome Back to{" "}
                          <span className="fw-bold">
                            <span className="fw-bold">
                              {values.accountType === "DreamWorldInv" &&
                                "Dreamworld Inventory"}
                              {values.accountType === "99Acres" &&
                                "99Acres Inventory"}
                              {values.accountType === "Listing" &&
                                "99Acres Listing"}
                            </span>
                          </span>
                        </h1>
                      </div>
                      {/* <div className="d-flex flex-wrap justify-content-between gap-2"> */}
                      <div className="form-group flex-grow-1">
                        <label htmlFor="txtuserName">
                          Mobile no. / User ID
                        </label>
                        <input
                          type="text"
                          name="txtuserName"
                          id="txtuserName"
                          value={values.txtuserName}
                          onChange={handleInput}
                          className="form-control"
                          placeholder="Enter Mobile no. / User ID"
                          required
                        />
                      </div>
                      <div className="form-group mb-4">
                        <label htmlFor="txtPassword">Password</label>
                        <div className="position-relative">
                          <input
                            type={passwordShown ? "text" : "password"}
                            name="txtPassword"
                            id="txtPassword"
                            value={values.txtPassword}
                            onChange={handleInput}
                            className="form-control"
                            placeholder="***********"
                            required
                          />
                          <i
                            onClick={togglePassword}
                            className={`toggle-password position-absolute fa ${
                              passwordShown ? "fa-eye" : "fa-eye-slash"
                            }`}
                            style={{
                              cursor: "pointer",
                              top: "10px",
                              right: "10px",
                            }}
                          ></i>
                        </div>
                      </div>
                      {/* </div> */}
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="rememberMe"
                          checked={values.rememberMe}
                          onChange={(e) =>
                            setValues((prev) => ({
                              ...prev,
                              rememberMe: e.target.checked,
                            }))
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          Remember Me
                        </label>
                      </div>
                      <br />
                      <button
                        type="submit"
                        className="btn btn-primary btnsubmit"
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
