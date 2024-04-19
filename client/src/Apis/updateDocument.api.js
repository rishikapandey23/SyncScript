import Cookies from "js-cookie";

export const updateDocument = async ({documentId, documentInformation}) => {
    const URL = process.env.REACT_APP_SERVER_BASE_URL + "/document/update/" + documentId;
    // const token = localStorage.getItem("authToken");
    const token = Cookies.get("authToken");
    // console.log("this is doc info", documentInformation)
    console.log("this is doc info", documentInformation)
    const response = await fetch(URL, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: token ? token : null
        },
        body: JSON.stringify(documentInformation)
    });
    return await response.json();
}