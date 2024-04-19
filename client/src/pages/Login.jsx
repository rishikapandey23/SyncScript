import React, { useEffect, useState } from "react";
import Button from "../utility/Button";
import "./Login.scss";
import { isError, useMutation } from "react-query";
import { checkUser } from "../Apis/login.api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUserId } from "../store/user.slice";
import { usePostApiCaller } from "../Apis/api";
import { Button as Btn } from 'primereact/button';
import Cookies from "js-cookie";

const token = localStorage.getItem("authToken");

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

  // const mutation = useMutation(checkUser, {
  //   onSuccess: (data, variables, context) => {
  //     console.log(data);
  //     localStorage.setItem("authToken", data?.data?.authorization);
  //     dispatch(addUserId(data?.data?._id));
  //     navigate("/");
  //   },
  // });

  const loginApi = usePostApiCaller(process.env.REACT_APP_SERVER_BASE_URL + "/user/login");

  useEffect(() => {
    if(loginApi.isError === null && loginApi.isLoading === null) return;
    if(loginApi.isLoading) return;
    if(loginApi.isError) {
      console.log("Error in fetching data from the server", loginApi.isError);
      return;
    } 
    if(loginApi.data !== null) {
      Cookies.set("authToken", loginApi.data?.authorization);
      // localStorage.setItem("authToken", loginApi.data?.authorization);
      dispatch(addUserId(loginApi.data?._id));
      navigate("/");
    }
  }, [loginApi])

  const handleChange = (e) => {
    setUserLoginInfo({
      ...userLoginInfo,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    console.log("this is user info", userLoginInfo);
    console.log("this is error message", errorMessage);
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
        console.log("inside username");
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

  console.log("this is error message outside", errorMessage);

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

    // console.log(userLoginInfo);
    // mutation.mutate(userLoginInfo);

    loginApi.postData(userLoginInfo);
  };

  // console.log(mutation);

  return (
    <div className="login-page-main-container">
      <div className="login-left-section"></div>
      <div className="login-container">
        <div className="login-heading">
          <h1>Welcome to Google docs.</h1>
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
      </div>
    </div>
  );
};

export default Login;
