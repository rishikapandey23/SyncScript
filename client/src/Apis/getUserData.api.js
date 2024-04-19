import Cookies from "js-cookie";

// const token = localStorage.getItem("authToken");
const token = Cookies.get("authToken");

export const getUserById = async (id) => {
  console.log("inside getUserById@@@@@@@@@@@@@@@@@@", id);
  const userId = (id) ? id : "undefined_ok";
  const URL = process.env.REACT_APP_SERVER_BASE_URL + "/user/user_data/" + userId;
  // console.log(URL);
  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? token : null,
    },
  });

  // if (!response.ok) {
  //   console.log(response);
  //   throw new Error("Network response was not ok --");
  // }

  const data = await response.json();

  return data;
};