import React from "react";
import "./Modal.scss";

const Modal = ({ children, isOpen }) => {
  return isOpen ? <div className="modal">{children}</div> : null;
};

export default Modal;
