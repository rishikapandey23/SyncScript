const express = require("express");
const {
  createDocument,
  documentCreatedByParticularUser,
  documentSharedWithParticularUser,
  updateDocument,
  getDocumentById,
  updateSharedList,
} = require("../controllers/document.controller");
const authenticateToken = require("../middleware/user.middleware");
const router = express.Router();

router.post("/create", createDocument);

router.put("/update/:documentId", updateDocument);

router.get("/created_by_user/:userId", documentCreatedByParticularUser);

router.get("/shared_with_user/:userId", documentSharedWithParticularUser);

router.get("/", [authenticateToken], getDocumentById);

router.put("/update/shared/:documentId", updateSharedList);

module.exports = router;
