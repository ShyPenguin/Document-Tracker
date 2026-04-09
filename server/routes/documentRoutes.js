import express from "express";
import {
  createDocument,
  getDocumentDetails,
  getDocuments,
  updateDocument,
  deleteDocument,
  searchDocument,
} from "../controllers/documentControllers.js";
const document = express.Router({ mergeParams: true });

document.get("/", getDocuments);
document.get("/search", searchDocument);

document.post("/", createDocument);
document
  .route("/:id")
  .get(getDocumentDetails)
  .put(updateDocument)
  .delete(deleteDocument);

export default document;
