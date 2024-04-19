import Cookies from "js-cookie";

// const token = localStorage.getItem("authToken");
const token = Cookies.get("authToken");

export const checkUser = async (postData) => {
  console.log("triggeredkdfdfd------------------------------------------------------")
  const URL = process.env.REACT_APP_SERVER_BASE_URL + "/user/login";
  console.log("this is tokemn ", token)
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? token : null,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const headers = await response.headers;

  return { data, headers };
};