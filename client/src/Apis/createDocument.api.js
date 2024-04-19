export const createDocument = async (data) => {
    console.log("this is muy data", data)
    const URL = process.env.REACT_APP_SERVER_BASE_URL + "/document/create";
    const document = await fetch(URL, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(data)
    })

    console.log(document)

    if(!document.ok) {
        throw new Error("Network response was not ok");
    }

    return await document.json();
}