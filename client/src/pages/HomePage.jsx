import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getUserById } from "../Apis/getUserData.api";
import { addUser } from "../store/user.slice";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import "./HomePage.scss";
import { Avatar, Button } from "@mui/material";
import Modal from "../utility/Modal";
import { createDocument as api } from "../Apis/createDocument.api";
import { getDocumentOfUser } from "../Apis/getDocumentOfUser.api";
import { addDocs, addSingleDoc } from "../store/document.slice";
import { useGetApiCaller } from "../Apis/api";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import { changeIsTemplate } from "../store/template.slice";

const HomePage = () => {
  const user = useSelector((state) => state.user);
  const docs = useSelector((state) => state.document.docs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createDocument, setCreateDocument] = useState({
    document: {
      title: "",
      createdBy: user._id ? user._id : user?.payload?._id,
    },
    isClicked: false,
  });

  const [isModalOpen, setIsModelOpen] = useState(false);
  const requiredId = user.id ? user.id : "undefined_ok";
  const getUserData = useGetApiCaller(
    process.env.REACT_APP_SERVER_BASE_URL + "/user/user_data/" + requiredId
  );

  useEffect(() => {
    if (getUserData.isError === null && getUserData.isLoading === null) return;
    if (getUserData.isLoading) return;
    if (getUserData.isError) {
      console.log(
        "Error in fetching data from the server",
        getUserData.isError
      );
      navigate("/login");
      return;
    }
    if (getUserData.data !== null) {
      if (getUserData.data.message === "Invalid token") {
        navigate("/login");
      } else {
        dispatch(addUser(getUserData?.data?.user));
      }
    }
  }, [getUserData.data, getUserData.isError, getUserData.isLoading]);

  const createDocumentQuery = useMutation(
    () => api({ ...createDocument.document, createdBy: user._id }),
    {
      onSuccess: (data) => {
        console.log("document created successfully", data);
        // console.log("document created successfully");
        dispatch(addSingleDoc(data));
        setCreateDocument({
          document: { title: "", createdBy: user._id },
          isClicked: false,
        });
        setIsModelOpen(false);
        navigate(`/document/${data._id}`);
      },
      onError: (error) => {
        console.log(error, "error occured");
        alert("Error occured while creating document");
        setCreateDocument({
          document: { title: "", createdBy: user._id },
          isClicked: false,
        });
      },
    }
  );

  const getAllDocsOfUser = useQuery(
    "all_docs_of_user",
    () => getDocumentOfUser(user._id),
    {
      enabled: user._id !== null && user._id !== undefined,
    }
  );

  useEffect(() => {
    if (getAllDocsOfUser.isLoading) return;
    if (getAllDocsOfUser.isError) {
      console.log("error occured while fetching all docs of user");
      return;
    }
    if (getAllDocsOfUser.data) {
      dispatch(addDocs(getAllDocsOfUser.data));
    }
  }, [
    getAllDocsOfUser.data,
    getAllDocsOfUser.isError,
    getAllDocsOfUser.isLoading,
  ]);

  useEffect(() => {
    if (createDocument.isClicked) {
      console.log("check this------------------", createDocument);
      console.log("user id", user._id);
      createDocumentQuery.mutate();
    }
  }, [createDocument.isClicked]);

  useEffect(() => {
    // const token = localStorage.getItem("authToken");
    const token = Cookies.get("authToken");
    getUserData.fetchApi(
      token && !user.id ? { headers: { Authorization: token } } : null
    );
  }, []);

  return (
    <div className="homepage-main-container">
      <HomePageNavbar profilePicture={user.profilePicture} />
      <CreateDocument
        setIsModelOpen={setIsModelOpen}
        isModalOpen={isModalOpen}
      />
      <Modal isOpen={isModalOpen}>
        <CreateNewDocumentModal
          createDocument={createDocument}
          setCreateDocument={setCreateDocument}
          setIsModelOpen={setIsModelOpen}
        />
      </Modal>
      <div className="your-documents-container">
        <h1>Your documents</h1>
        {getAllDocsOfUser.isLoading ? (
          <h1>Loading ...</h1>
        ) : (
          docs.map((doc) => (
            <DocumentOfUser key={doc._id} title={doc.title} userId={doc._id} />
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

const HomePageNavbar = ({ profilePicture }) => {
  const docs = useSelector((state) => state.document.docs);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const searchHandler = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (searchValue === "") {
      setFilteredData(null);
      return;
    }
    const filter = docs.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filter);
  }, [searchValue]);

  console.log(filteredData);

  return (
    <div className="homepage-navbar-container">
      <div className="homepage-navbar-logo-container">
        <DescriptionIcon
          sx={{ width: "50px" }}
          fontSize="large"
          color="primary"
        />
        <h1>Docs</h1>
      </div>
      <div className="homepage-searchbar-container">
        <SearchIcon fontSize="medium" sx={{ color: "gray" }} />
        <input onChange={searchHandler} type="text" placeholder="Search" />
        <ShowSearchResults filteredData={filteredData} />
      </div>
      <Avatar
        sx={{
          height: "50px",
          width: "50px",
          cursor: "pointer",
          marginRight: "1rem",
        }}
        src={profilePicture}
        alt="user"
      />
    </div>
  );
};

const ShowSearchResults = ({ filteredData }) => {
  return (
    <div className="search-results-main-container">
      {filteredData?.map((item) => (
        <Link className="link" to={`/document/${item._id}`}>
          <p>{item.title}</p>
        </Link>
      ))}
    </div>
  );
};

const CreateDocument = ({ setIsModelOpen, isModalOpen }) => {
  
  return (
    <div className="create-document-main-container">
      <div className="create-document">
        <h3>Start a new document</h3>
        <div className="new-document-main-container">
          <NewDocumentTemplate
            setIsModelOpen={setIsModelOpen}
            isModalOpen={isModalOpen}
          />
        </div>
      </div>
    </div>
  );
};

const NewDocumentTemplate = ({ setIsModelOpen, isModalOpen }) => {
  const dispatch = useDispatch();
  return (
    <React.Fragment>
    <div
      className="new-document-template"
      onClick={() => {
        dispatch(changeIsTemplate(false));
        setIsModelOpen(!isModalOpen);
      }}
    >
      <AddIcon sx={{ fontSize: "8rem" }} />
    </div>
    <div className="new-document-template" onClick={() => {
      dispatch(changeIsTemplate(true))
      setIsModelOpen(!isModalOpen)
    }}>Resume</div>
    </React.Fragment>
  );
};

const CreateNewDocumentModal = ({
  createDocument,
  setCreateDocument,
  setIsModelOpen,
}) => {
  const [title, setTitle] = useState("");

  const formSubmitHandler = (e) => {
    e.preventDefault();
    console.log("clicked");
    setCreateDocument({
      document: { ...createDocument.document, title: title },
      isClicked: true,
    });
  };
  return (
    <div className="create-new-document-modal-main-container">
      <div className="close-icon" onClick={() => setIsModelOpen(false)}>
        <CloseIcon />
      </div>
      <h1>Create a new document</h1>
      <form onSubmit={formSubmitHandler}>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          placeholder="Document name"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

const DocumentOfUser = ({ title, userId }) => {
  const dispatch = useDispatch();
  return (
    <Link className="link" to={`/document/${userId}`}>
      <div style={{ width: "100%" }} className="individual-document-of-user" onClick={() => {
        dispatch(changeIsTemplate(false));
      }}>
        <p className="document-name">{title}</p>
      </div>
    </Link>
  );
};

const Footer = () => {
  return (
    <div className="footer-main-container">
      Created and designed by <span> Rishika ❤️</span>
    </div>
  );
};

export default HomePage;
