export const getDocumentOfUser = async (userId) => {
    const URL = process.env.REACT_APP_SERVER_BASE_URL + "/document/created_by_user/" + userId;
    const documents = await fetch(URL);
    return await documents.json();
}