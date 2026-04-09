import express from "express";
import {
  getDocumentStatuses,
  getNumberOfDocuments,
  send,
  confirm,
  revertStatus,
  filterDocumentStatuses,
} from "../controllers/departmentControllers.js";
import documentRoutes from "./documentRoutes.js";
import { getDocumentTrack } from "../controllers/trackControllers.js";
const department = express.Router({ mergeParams: true });

department.use("/documents", documentRoutes);
department.get("/", getNumberOfDocuments);
department.get("/track/:id", getDocumentTrack);
department.get("/:status", getDocumentStatuses);
department.get("/:status/filter", filterDocumentStatuses);
department.post("/:id/confirm", confirm);
department.post("/:id/send", send);
department.delete("/:id/revert", revertStatus);
export default department;
