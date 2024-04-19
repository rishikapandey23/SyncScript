import {
  Avatar,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import Modal from "../utility/Modal";
import { io } from "socket.io-client";
import { usePutApiCaller } from "../Apis/api";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const DocumentNavbar = ({
  title,
  profilePicture,
  triggerSaveApi,
  documentId,
}) => {
  const [documentTitle, setDocumentTitle] = useState(title);
  const [isModalOpen, setIsModelOpen] = useState(false);

  useEffect(() => {
    setDocumentTitle(title);
  }, [title]);

  const buttonStyle = {
    padding: "1rem 2rem",
    border: "none",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        // padding : "1rem"
        padding: "1rem 0",
        position: "relative",
        backgroundColor: "#fff",
      }}
    >
      <input
        style={{
          width: "20%",
          marginLeft: "1rem",
          fontSize: "1.5rem",
          padding: "0 0.5rem",
          border: "none",
          backgroundColor: "#fff",
        }}
        type="text"
        placeholder="Update name"
        value={documentTitle}
        onChange={(e) => setDocumentTitle(e.target.value)}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/*<button
          style={{ ...buttonStyle, backgroundColor: "#435585" }}
          onClick={() => setIsModelOpen(!isModalOpen)}
        >
          Share
      </button>*/}
        <IconButton aria-label="delete" onClick={() => setIsModelOpen(!isModalOpen)}>
          <ShareIcon />
        </IconButton>
        <Modal isOpen={isModalOpen}>
          <ShareModalElement
            documentId={documentId}
            closeModal={() => setIsModelOpen(false)}
          />
        </Modal>
        {/*<button
          style={{ ...buttonStyle, backgroundColor: "#435585" }}
          onClick={() => triggerSaveApi(documentTitle)}
        >
          Save
      </button>*/}
        <Button
          variant="contained"
          onClick={() => triggerSaveApi(documentTitle)}
        >
          Save
        </Button>
        <Avatar
          sx={{ marginRight: "1rem", cursor: "pointer" }}
          src={profilePicture}
        />
      </div>
    </div>
  );
};

const ShareModalElement = ({ documentId, closeModal }) => {
  const temp = [
    {
      id: "1",
      name: "Rohit",
      profilePicture: "https://freerangestock.com/sample/120147/business",
    },
    {
      id: "2",
      name: "Rhifr10",
      profilePicture: "https://freerangestock.com/sample/120147/business",
    },
    {
      id: "3",
      name: "rddfhit9",
      profilePicture: "https://freerangestock.com/sample/120147/business",
    },
    {
      id: "4",
      name: "Rohit8",
      profilePicture: "https://freerangestock.com/sample/120147/business",
    },
    {
      id: "5",
      name: "Rohit3",
      profilePicture: "https://freerangestock.com/sample/120147/business",
    },
  ];

  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const URL =
    process.env.REACT_APP_SERVER_BASE_URL +
    "/document/update/shared/" +
    documentId;
  const updateSharedUsers = usePutApiCaller(URL);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_BASE_URL, {
      query: {
        documentId: "123",
      },
      auth: {
        token: Cookies.get("authToken"),
      }
    });
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if(updateSharedUsers.isError === null && updateSharedUsers.isLoading === null) return;
    if(updateSharedUsers.isLoading) return;
    if(updateSharedUsers.isError) {
      toast.error("Error occured while sharing document");
    }
    if(updateSharedUsers.data !== null) {
      toast.success("Document shared successfully");
    }
  }, [updateSharedUsers.data, updateSharedUsers.isError, updateSharedUsers.isLoading]);

  useEffect(() => {}, []);

  const buttonClickHandler = () => {
    console.log("this is selected users", selectedUsers);
    const userIdsOfSelectedUsers = selectedUsers.map((item) => {
      return { _id: item._id, accessType: item.accessType };
    });
    updateSharedUsers.updateData({ sharedWith: userIdsOfSelectedUsers });
  };

  useEffect(() => {
    if (searchValue === "") {
      setFilteredData(null);
      return;
    }
    console.log(socket.id);
    socket.emit("suggestions", {
      socketId: socket.id,
      username: searchValue,
    });
    socket.on("suggestions", (data) => {
      const filter = data.filter((item) => {
        return item.username.toLowerCase().includes(searchValue.toLowerCase());
      });
      setFilteredData(filter);
      console.log("this is data", data);
    });
  }, [searchValue]);


  const removeElements = (id) => {
    setSelectedUsers((prev) => {
      return prev.filter((item) => item._id !== id);
    });
  }

  return (
    <div
      style={{
        width: "500px",
        padding: "1rem",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 5px rgba(0,0,0,0.5)",
        display: "flex",
        height: "80%",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
        onClick={closeModal}
      >
        <CloseIcon sx={{ color: "red", cursor: "pointer" }} />
      </div>
      <h1>Share with others</h1>
      <div style={{ width: "100%", height: "80%" }}>
        <div
          style={{
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {selectedUsers.map((item) => {
              console.log("this is my item", selectedUsers)
              return <IndividualNames name={item.username} _id={item._id} closeIconHandler={removeElements} />;
            })}
          </div>
          <input
            style={{
              width: "95%",
              padding: "0 2.5%",
              height: "50px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              outline: "none",
              fontSize: "1rem",
            }}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Enter username"
          />
        </div>
        {filteredData !== null && (
          <div
            style={{
              width: "100%",
              height: "70%",
              overflowY: "overlay",
              overflowX: "hidden",
              marginBottom: "0",
            }}
          >
            {filteredData.map((item) => {
              return (
                <IndividualPersonTile
                  key={item.id}
                  {...item}
                  changeUser={setSelectedUsers}
                  sharedWithUsers={selectedUsers}
                />
              );
            })}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          width: "100%",
        }}
      >
        <button
          style={{
            padding: "1rem 2rem",
            backgroundColor: "#31304D",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "1rem",
            fontSize: "1rem",
          }}
          onClick={buttonClickHandler}
        >
          Share
        </button>
      </div>
    </div>
  );
};

const IndividualPersonTile = ({
  profilePicture,
  username,
  _id,
  changeUser,
  sharedWithUsers,
}) => {
  const [tileIsSelected, setTileIsSelected] = useState(false);
  const [accessType, setAccessType] = useState("Read only");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  useEffect(() => {
    if (sharedWithUsers.some((item) => item._id === _id)) {
      setTileIsSelected(true);
    } else {
      setTileIsSelected(false);
    }
  }, [sharedWithUsers]);

  const checkboxHandler = (e) => {
    setTileIsSelected(e.target.checked);
    if (e.target.checked) {
      changeUser((prev) => {
        return [
          ...prev,
          { username, _id: _id, profilePicture, accessType: accessType },
        ];
      });
    } else {
      changeUser((prev) => {
        return prev.filter((item) => item._id !== _id);
      });
    }
  };

  const handleChange = (e) => {
    if (sharedWithUsers.some((item) => item._id === _id)) {
      setTileIsSelected(true);
    }
    const temp = [...sharedWithUsers];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i]._id === _id) {
        temp[i].accessType = e.target.value;
      }
    }
    changeUser(temp);
    console.log("check this buddy", temp);
    setAccessType(e.target.value);
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: tileIsSelected ? "#F0F3FF" : "#fff",
        width: "95%",
        padding: "1rem 2.5%",
        border: "1px solid #ccc",
      }}
    >
      <div
        style={{
          display: "flex",
          marginLeft: "1rem",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <input
          style={{
            height: "20px",
            width: "20px",
            cursor: "pointer",
          }}
          type="checkbox"
          onChange={checkboxHandler}
          checked={tileIsSelected}
        />
        <FormControl sx={{ padding: "0" }} fullWidth>
          <InputLabel id="demo-simple-select-label">Access</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={accessType}
            label="Access"
            onChange={handleChange}
          >
            <MenuItem value="Read only">Read only</MenuItem>
            <MenuItem value="Edit">With Edit access</MenuItem>
          </Select>
        </FormControl>
        <Avatar
          sx={{
            height: "30px",
            width: "30px",
            cursor: "pointer",
          }}
          src={profilePicture}
          alt="user"
        />
      </div>
      <p style={{}}>{username}</p>
    </div>
  );
};

const IndividualNames = ({ name, _id, closeIconHandler }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        border: "1px solid #ccc",
        padding: "0 0.5rem",
        marginBottom: "1rem",
        cursor: "pointer",
      }}
    >
      <p>{name}</p>
      <div
        style={{
          
        }}
      >
        <CloseIcon sx={{color: "red"}} onClick={() => closeIconHandler(_id)} />
      </div>
    </div>
  );
};

export default DocumentNavbar;
