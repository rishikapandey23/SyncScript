import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../store/user.slice";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import "./HomePage.scss";
import { Avatar, IconButton } from "@mui/material";
import Modal from "../utility/Modal";
import { createDocument as api } from "../Apis/createDocument.api";
import { getDocumentOfUser } from "../Apis/getDocumentOfUser.api";
import { addDocs, addSingleDoc, deleteDoc } from "../store/document.slice";
import { useGetApiCaller, useDeleteApiCaller } from "../Apis/api";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import { changeIsTemplate } from "../store/template.slice";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

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
        dispatch(addSingleDoc(data));
        setCreateDocument({
          document: { title: "", createdBy: user._id },
          isClicked: false,
        });
        setIsModelOpen(false);
        navigate(`/document/${data._id}`);
      },
      onError: (error) => {
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
      createDocumentQuery.mutate();
    }
  }, [createDocument.isClicked]);

  useEffect(() => {
    const token = Cookies.get("authToken");
    getUserData.fetchApi(
      token && !user.id ? { headers: { Authorization: token } } : null
    );
  }, []);

  return (
    <div className="homepage-main-container">
      <HomePageNavbar profilePicture={user.profilePicture} email={user.email} />
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

const HomePageNavbar = ({ profilePicture, email }) => {
  const docs = useSelector((state) => state.document.docs);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
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


  return (
    <div className="homepage-navbar-container">
      <div className="homepage-navbar-logo-container">
        <DescriptionIcon
          sx={{ width: "50px" }}
          fontSize="large"
          color="primary"
        />
        <h1>Syncscript</h1>
      </div>
      <div className="homepage-searchbar-container">
        <SearchIcon fontSize="medium" sx={{ color: "gray" }} />
        <input onChange={searchHandler} type="text" placeholder="Search" />
        <ShowSearchResults filteredData={filteredData} />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Avatar
            sx={{ marginRight: "1rem", cursor: "pointer" }}
            src={profilePicture}
          />
          {isHovered && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: "1rem",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                padding: "1rem",
                boxShadow:
                  "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
              }}
            >
              <p>{email}</p>
              <Button
                onClick={() => {
                  Cookies.remove("authToken");
                  navigate("/login");
                }}
                style={{ cursor: "pointer" }}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
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
      <div
        className="new-document-template"
        onClick={() => {
          dispatch(changeIsTemplate(true));
          setIsModelOpen(!isModalOpen);
        }}
      >
        Resume
      </div>
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

const DocumentOfUser = ({ title, userId}) => {
  const dispatch = useDispatch();

  const {isLoading, isError, data, fetchApi} = useDeleteApiCaller(process.env.REACT_APP_SERVER_BASE_URL + "/document/delete/" + userId);

  useEffect(() => {
    if (isLoading) return;
    if (isError) {
      alert("Error occured while deleting the document");
      return;
    }
    if (data) {
      dispatch(deleteDoc(userId));
    }
  }, [data, isError, isLoading])

  const handleDeleteClick = (event) => {
    event.preventDefault()
    event.stopPropagation(); // Prevent the click event from propagating to the parent Link component
    fetchApi(); 
  };

  return (
    <Link className="link" to={`/document/${userId}`}>
      <div
        style={{ width: "100%", display: "flex", justifyContent: "space-between"}}
        className="individual-document-of-user"
        onClick={() => {
          dispatch(changeIsTemplate(false));
        }}
      >
        <p className="document-name">{title}</p>
        
          <IconButton onClick={handleDeleteClick}>
            <DeleteIcon style={{zIndex: "100"}} color="error" />
          </IconButton>
        
      </div>
    </Link>
  );
};

const Footer = () => {
  return (
    <div className="footer-main-container">
      <span>Syncscript</span>Created and designed by <span> Rishika || Gopal || Narasimha</span>
    </div>
  );
};

export default HomePage;
