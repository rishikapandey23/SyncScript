import React, { useEffect, useState } from "react";
import Button from "../utility/Button";
import "./Signup.scss";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

const createPost = async (postData) => {
  const URL = process.env.REACT_APP_SERVER_BASE_URL + "/user/signup";
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Network response was not ok");
  }

  return await response.json();
};

const Signup = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [buttonClicked, setButtonClicked] = useState(false);

  const mutation = useMutation(createPost);

  useEffect(() => {
    if (mutation.isError || mutation.loading) return;

    if (mutation.data) {
      navigate("/login");
    }
  }, [mutation.isError, mutation.data, mutation.isLoading]);

  useEffect(() => {
    if (buttonClicked) {
      if (userData.name === "") {
        setErrorMessage((prev) => {
          return {
            ...prev,
            name: "Name is required",
          };
        });
      } else {
        setErrorMessage((prev) => {
          return {
            ...prev,
            name: "",
          };
        });
      }
      if (userData.username === "") {
        setErrorMessage((prev) => {
          return {
            ...prev,
            username: "Username is required",
          };
        });
      } else {
        setErrorMessage((prev) => {
          return {
            ...prev,
            username: "",
          };
        });
      }
      if (userData.email === "") {
        setErrorMessage((prev) => {
          return {
            ...prev,
            email: "Email is required",
          };
        });
      } else {
        setErrorMessage((prev) => {
          return {
            ...prev,
            email: "",
          };
        });
      }
      if (userData.password === "") {
        setErrorMessage((prev) => {
          return {
            ...prev,
            password: "Password is required",
          };
        });
      } else {
        setErrorMessage((prev) => {
          return {
            ...prev,
            password: "",
          };
        });
      }
    }
  }, [userData, errorMessage, buttonClicked]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setButtonClicked(true);
    if (
      errorMessage.name !== "" ||
      errorMessage.username !== "" ||
      errorMessage.email !== "" ||
      errorMessage.password !== ""
    ) {
      return;
    }
    mutation.mutate(userData);
  };

  return (
    <div className="signup-page-main-container">
      <div className="signup-left-section"></div>
      <div className="signup-container">
        <div className="signup-heading">
          <h1>Welcome to Google docs.</h1>
          <h3>Please sign up to continue</h3>
        </div>
        <form onSubmit={formSubmitHandler}>
          <div className="input-div">
            <input
              onChange={handleChange}
              value={userData.name}
              name="name"
              type="text"
              placeholder="Name"
            />
            <p>{errorMessage.name}</p>
          </div>
          <div className="input-div">
            <input
              onChange={handleChange}
              value={userData.username}
              name="username"
              type="text"
              placeholder="Username"
            />
            <p>{errorMessage.username}</p>
          </div>
          <div className="input-div">
            <input
              onChange={handleChange}
              value={userData.email}
              name="email"
              type="text"
              placeholder="Email"
            />
            <p>{errorMessage.email}</p>
          </div>
          <div className="input-div">
            <input
              onChange={handleChange}
              value={userData.password}
              name="password"
              type="password"
              placeholder="Password"
            />
            <p>{errorMessage.password}</p>
          </div>
          <div className="input-div">
            <input
              onChange={handleChange}
              value={userData.profilePicture}
              name="profilePicture"
              type="text"
              placeholder="Enter link of profile picture"
            />
            <p>{errorMessage.password}</p>
          </div>

          <Button type="submit">
            {mutation.isLoading ? "Loading" : "Sign up"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
