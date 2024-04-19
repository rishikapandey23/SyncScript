import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.bubble.css";
import DocumentNavbar from "./components/DocumentNavbar";
import { useSelector, useDispatch } from "react-redux";
import "./Editor.scss";
import { useMutation, useQuery } from "react-query";
import { updateDocument } from "./Apis/updateDocument.api";
import { getDocumentById } from "./Apis/getDocumentById.api";
import { useGetApiCaller } from "./Apis/api";
import { toast } from "react-toastify";
import { addUser } from "./store/user.slice";
import { resume } from "./template/resume";
import "../src/template/resume.scss";
import Cookies from "js-cookie";
import Modal from "./utility/Modal";
import { Button } from "@mui/material";

const getDocumentInformation = (id, docs) => {
  const document = docs.find((doc) => doc._id === id);
  return document;
};

const Editor = () => {
  const [socket, setSocket] = useState(null);
  const { id } = useParams();
  const quillRef = useRef(null);
  const docs = useSelector((state) => state.document.docs);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const template = useSelector((state) => state.template);
  const [isModalOpen, setIsModalOpen] = useState(false);

  localStorage.setItem("template", "resume");

  const [document, setDocument] = useState({
    isFetched: false,
    docInfo: {},
  });

  const [content, setContent] = useState(document?.docInfo?.content || "");

  useEffect(() => {
    setContent(document?.docInfo?.content);
    console.log("this is content", document?.docInfo?.content);
  }, [document?.docInfo?.content]);

  const updateDocumentQuery = useMutation(updateDocument, {
    onSuccess: (data) => {
      console.log("Document updated successfully", data);
      toast("Document updated successfully");
    },
  });

  const getDocumentQuery = useQuery(
    "getting_document_by_id",
    () => getDocumentById(id, user._id),
    {
      enabled: false,
    }
  );
  const dataSavedInLocalStorage = JSON.parse(localStorage.getItem("content"));

  const templateName = template.isTemplate ? "resume" : "default";
  const getDocById = useGetApiCaller(
    process.env.REACT_APP_SERVER_BASE_URL +
    `/document?documentId=${id}&userId=${user._id}&template=${templateName}`);

  const checkIfReadOnlyOrNot = (array, createdBy, requestUserId) => {
    console.log("this is created by", createdBy, user);
    if (createdBy === user._id || createdBy === requestUserId) {
      setIsReadOnly(false);
    }
    for (let i = 0; i < array?.length; i++) {
      if (array[i]?._id === user?._id) {
        if (array[i]?.accessType === "Edit") {
          setIsReadOnly(false);
        }
      }
    }
  };

  useEffect(() => {
    // const token = localStorage.getItem("authToken");
    const token = Cookies.get("authToken");
    const userId = user._id;
    if (!token && !userId) {
      navigate("/login");
    }
    const headers = {
      Authorization: token && !userId ? token : null,
    };
    console.log("this is headers", headers);
    getDocById.fetchApi({ headers: headers });
  }, []);

  useEffect(() => {
    if (getDocById.isLoading === null && getDocById.isError) return;
    if (getDocById.isLoading) return;
    if (getDocById.isError) {
      console.log("Error in fetching data from the server", getDocById.data);
      console.log(getDocById?.data);
      if (getDocById?.data?.status === 401) {
        navigate("/login");
      }
      return;
    }
    if (getDocById.data) {
      console.log("this is get document query", getDocById.data);
      if (getDocById.data.message === "Invalid token") {
        navigate("/login");
        return;
      }
      console.log(getDocById.data, "this is get document by id data");
      if (user.id === null) {
        dispatch(addUser({ _id: getDocById.data.requestUserId }));
      }
      checkIfReadOnlyOrNot(
        getDocById.data.sharedWith,
        getDocById.data.createdBy,
        getDocById.data.requestUserId
      );

      console.log("helllo", dataSavedInLocalStorage, getDocById);
      if(Array.isArray(dataSavedInLocalStorage) && dataSavedInLocalStorage.length > 0) {
      for (const data of dataSavedInLocalStorage) {

        console.log(
          "helllo",
          data.documentId,
          id,
          data.userId,
          user._id,
          data.savedAt,
          getDocById.data.updatedAt,
          data.savedAt > getDocById.data.updatedAt
        );
        if (
          data.documentId === id &&
          data.userId === user._id &&
          data.savedAt > getDocById.data.updatedAt
        ) {
          console.log("helllo inside");
          setIsModalOpen(true);
          break;
        }
      }
      }
      setDocument({
        isFetched: true,
        docInfo: getDocById.data,
      });
    }
  }, [getDocById.data, getDocById.isLoading, getDocById.isError, user._id]);

  useEffect(() => {
    console.log("this is get document query", getDocumentQuery);
    if (getDocumentQuery.isLoading) return;
    if (getDocumentById.isError) {
      console.log(
        "Error in fetching data from the server",
        getDocumentQuery.data
      );
      if (getDocumentQuery?.data?.message === "Invalid token") {
        navigate("/login");
      }
      return;
    }
    if (getDocumentQuery.data) {
      console.log("this is get document query", getDocumentQuery.data);
      if (getDocumentQuery.data.message === "Invalid token") {
        navigate("/login");
        return;
      }
      setDocument({
        isFetched: true,
        docInfo: getDocumentQuery.data,
      });
    }
  }, [
    getDocumentQuery.data,
    getDocumentQuery.isLoading,
    getDocumentQuery.isError,
  ]);

  useEffect(() => {
    const socketServer = io(process.env.REACT_APP_SERVER_BASE_URL, {
      query: {
        documentId: id,
      },
      auth: {
        token: Cookies.get("authToken"),
      },
    });
    setSocket(socketServer);
    socketServer.on("connect", () => {
      console.log("Connected to server");
    });

    return () => {
      console.log("Disconnected from server");
      socketServer.disconnect();
    };
  }, [id]);

  const handleTextChange = (content, delta, source, editor) => {
    if (isReadOnly) {
      console.log("jdfdfddddddddddddddddddddddddddddddddddddd");
      return;
    }
    setContent(quillRef?.current?.value);
    const latestDataSavedInLocalStorage = JSON.parse(
      localStorage.getItem("content")
    );
    if (
      Array.isArray(latestDataSavedInLocalStorage) &&
      latestDataSavedInLocalStorage.length > 0
    ) {
      let flag = false;
      for (let i = 0; i < latestDataSavedInLocalStorage.length; i++) {
        if (
          latestDataSavedInLocalStorage[i].documentId === id &&
          latestDataSavedInLocalStorage[i].userId === user._id
        ) {
          latestDataSavedInLocalStorage[i].content = quillRef?.current?.value;
          latestDataSavedInLocalStorage[i].savedAt = new Date();
          localStorage.setItem(
            "content",
            JSON.stringify(latestDataSavedInLocalStorage)
          );
          flag = true;
          break;
        }
      }
      if (!flag) {
        const dataToBeSavedInLocalStorage = {
          userId: user._id,
          documentId: id,
          content: quillRef?.current?.value,
          savedAt: new Date(),
        };
        latestDataSavedInLocalStorage.push(dataToBeSavedInLocalStorage);
        localStorage.setItem(
          "content",
          JSON.stringify(latestDataSavedInLocalStorage)
        );
      }
    } else {
      const dataToBeSavedInLocalStorage = [
        {
          userId: user._id,
          documentId: id,
          content: quillRef?.current?.value,
          savedAt: new Date(),
        },
      ];
      localStorage.setItem(
        "content",
        JSON.stringify(dataToBeSavedInLocalStorage)
      );
    }

    if (source === "user") {
      socket?.emit("send-changes", {
        delta: delta,
        documentId: id,
      });
    }
  };

  const handleReceiveChanges = (delta) => {
    // Update the editor content with received changes
    if (quillRef.current) {
      quillRef.current.getEditor().updateContents(delta);
    }
  };

  useEffect(() => {
    socket?.on("receive-changes", handleReceiveChanges);
  }, [socket]);

  console.log("this si quill ref", quillRef?.current?.value);

  const documentBody = (title) => {
    return {
      title,
      content: quillRef?.current?.value,
    };
  };

  const fetchTemplate = () => {
    console.log("this is template start", resume);
    const template = resume;
    const quill = quillRef.current.getEditor();
    quill.setContents(quill.clipboard.convert(template));
    setContent(quillRef?.current?.value);
    console.log("this is template end", quillRef?.current?.value);
  };

  // useEffect(() => {
  //   if (template.isTemplate) {
  //     console.log("this is template", template.isTemplate);
  //     fetchTemplate();
  //   }
  // }, []);

  console.log("this is template content value:", content);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div className="editor-main-div">
        <DocumentNavbar
          profilePicture={user.profilePicture}
          title={document?.docInfo?.title}
          documentId={id}
          triggerSaveApi={(title) =>
            updateDocumentQuery.mutate({
              documentId: id,
              documentInformation: documentBody(title),
            })
          }
        />
        <Modal isOpen={isModalOpen}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              padding: "20px",
            }}
          >
            <p>You have unsaved changes. Do you want to keep them?</p>
            <div style={{
              display: "flex",
              justifyContent:"end",
              gap: "1rem"
            }}>
            <Button
              variant="contained"
              onClick={() => {
                let localContent = "";
                for (const data of dataSavedInLocalStorage) {
                  if (data.documentId === id && data.userId === user._id) {
                    localContent = data.content;
                    break;
                  }
                }
                setDocument({
                  isFetched: true,
                  docInfo: { ...getDocById.data, content: localContent },
                });
                setIsModalOpen(false);
              }}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setDocument({
                  isFetched: true,
                  docInfo: getDocById.data,
                });
                setIsModalOpen(false);
              }}
            >
              No
            </Button>
            </div>
          </div>
        </Modal>
        <ReactQuill
          value={content}
          ref={quillRef}
          theme="snow"
          placeholder="Write something ..."
          onChange={handleTextChange}
          readOnly={isReadOnly}
          modules={{
            toolbar: [
              [{ font: [] }],
              [{ header: [1, 2, 3] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ script: "sub" }, { script: "super" }],
              ["blockquote", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
              ["link", "image", "video"],
              ["clean"],
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Editor;