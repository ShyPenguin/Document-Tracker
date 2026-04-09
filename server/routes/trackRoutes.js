import express from "express";
import {
  addDocumentHistoryRecord,
  deleteDocumentHistoryRecord,
  getDocumentTrack,
} from "../controllers/trackControllers.js";

const track = express.Router();

track
  .route("/:id")
  .get(getDocumentTrack)
  .post(addDocumentHistoryRecord)
  .delete(deleteDocumentHistoryRecord);

export default track;
