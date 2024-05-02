const Document = require("../Schema/document.model");
const mongoose = require("mongoose");
const { resume } = require("../constants/template");

const createDocument = async (req, res) => {
  const documentInformation = req.body;

  try {
    // Create the document
    const newDocument = await Document.create(documentInformation);

    // Send the new document as a response
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDocument = async (req, res) => {
  const documentId = req.params.documentId;
  const documentInformation = req.body;

  try {
    const updatedDocument = await Document.findByIdAndUpdate(
      documentId,
      documentInformation,
      { new: true }
    );
    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const documentCreatedByParticularUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const documents = await Document.find({ createdBy: userId });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const documentSharedWithParticularUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const documents = await Document.find({ sharedWith: { $in: [userId] } });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDocumentById = async (req, res) => {
  const documentId = req.query.documentId;
  let userId = req.query.userId;
  const template = req.query.template;

  console.log("userId", userId, documentId);

  if (req.user) {
    userId = req.user._id;
  }

  try {
    let document = await Document.findById(documentId);
    console.log(document.createdBy, userId);
    if (
      document.createdBy.toString() !== userId &&
      !document.sharedWith.some((item) => item._id.toString() === userId)
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this document" });
    }
    document = document.toObject();
    if (template === "resume") {
      res
        .status(200)
        .json({ ...document, requestUserId: userId, content: resume });
      return;
    }
    res.status(200).json({ ...document, requestUserId: userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDocumentById = async (req, res) => {
  const documentId = req.params.documentId;

  try {
    await Document.findByIdAndDelete(documentId);
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSharedList = async (req, res) => {
  const documentId = req.params.documentId;
  const sharedWithUsers = req.body.sharedWith;
  console.log("sharedWith", sharedWithUsers);

  try {
    // const updatedDocument = await Document.findByIdAndUpdate(
    //   documentId,
    //   { $push: { sharedWith: sharedWithUsers } },
    //   { new: true }
    // );
    const doc = await Document.findById(documentId);
    console.log("doc", doc.sharedWith);
    for (let j = 0; j < sharedWithUsers.length; j++) {
      let flag = false;
      for (let i = 0; i < doc.sharedWith.length; i++) {
        if (doc.sharedWith[i]._id.toString() === sharedWithUsers[j]._id) {
          flag = true;
          console.log("inside if", sharedWithUsers.accessType);
          doc.sharedWith[i].accessType = sharedWithUsers[j].accessType;
        }
      }
      if (!flag) {
        console.log("inside else");
        doc.sharedWith.push(sharedWithUsers[j]);
      }
    }

    await doc.save();
    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDocument,
  documentCreatedByParticularUser,
  documentSharedWithParticularUser,
  updateDocument,
  getDocumentById,
  updateSharedList,
  deleteDocumentById,
};
