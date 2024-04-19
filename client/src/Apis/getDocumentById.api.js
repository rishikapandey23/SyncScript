import Cookies from "js-cookie";

export const getDocumentById = async (documentId, userId) => {
    const URL = process.env.REACT_APP_SERVER_BASE_URL + `/document?documentId=${documentId}&userId=${userId}`;
    // const token = localStorage.getItem("authToken");
    const token = Cookies.get("authToken");
    const response = await fetch(URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? token : null,
        },
    });
    if (!response.ok) {
        console.log(response);
        throw new Error("Network response was not ok");
    }
    return await response.json();
}