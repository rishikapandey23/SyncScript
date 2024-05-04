import React, { useEffect, useState } from "react";
import Button from "../utility/Button";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUserId } from "../store/user.slice";
import { usePostApiCaller } from "../Apis/api";
import Cookies from "js-cookie";

const Login = () => {
  const [userLoginInfo, setUserLoginInfo] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    username: "",
    password: "",
  });

  const [buttonClicked, setButtonClicked] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginApi = usePostApiCaller(
    process.env.REACT_APP_SERVER_BASE_URL + "/user/login"
  );

  useEffect(() => {
    if (loginApi.isError === null && loginApi.isLoading === null) return;
    if (loginApi.isLoading) return;
    if (loginApi.isError) {
      return;
    }
    if (loginApi.data !== null) {
      Cookies.set("authToken", loginApi.data?.authorization);
      dispatch(addUserId(loginApi.data?._id));
      navigate("/");
    }
  }, [loginApi]);

  const handleChange = (e) => {
    setUserLoginInfo({
      ...userLoginInfo,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (buttonClicked) {
      if (userLoginInfo.username !== "") {
        setErrorMessage((prev) => {
          return {
            ...prev,
            username: "",
          };
        });
      }
      if (userLoginInfo.password !== "") {
        setErrorMessage((prev) => {
          return {
            ...prev,
            password: "",
          };
        });
      }
      if (userLoginInfo.username === "") {
        setErrorMessage((prev) => {
          return {
            ...prev,
            username: "Username is required",
          };
        });
      }
      if (userLoginInfo.password === "") {
        setErrorMessage((prev) => {
          return {
            ...prev,
            password: "Password is required",
          };
        });
      }
    }
  }, [userLoginInfo, buttonClicked]);

  const formSubmitHandler = (e) => {
    e.preventDefault();

    setButtonClicked(true);

    if (userLoginInfo.username === "") {
      setErrorMessage({
        username: "Username is required",
        password: "",
      });
      return;
    }

    if (userLoginInfo.password === "") {
      setErrorMessage({
        username: "",
        password: "Password is required",
      });
      return;
    }

    loginApi.postData(userLoginInfo);
  };

  return (
    <div className="login-page-main-container">
      <div className="login-container">
        <div className="login-heading">
          <h1>Welcome to Syncscript.</h1>
          <h3>Please sign in to continue</h3>
        </div>
        <form onSubmit={formSubmitHandler}>
          <div className="input-div">
            <input
              name="username"
              onChange={handleChange}
              value={userLoginInfo.username}
              type="text"
              placeholder="Username"
            />
            <p>{errorMessage.username}</p>
          </div>
          <div className="input-div">
            <input
              name="password"
              onChange={handleChange}
              value={userLoginInfo.password}
              type="password"
              placeholder="Password"
            />
            <p>{errorMessage.password}</p>
          </div>
          <Button type="submit">LOG IN</Button>
        </form>
        <div className="signup-link">
          <p>Don't have account?</p>
          <Link className="link" to="/signup">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;