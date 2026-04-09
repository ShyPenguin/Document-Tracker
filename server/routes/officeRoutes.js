import express from "express";
import {
  createOffice,
  fetchOffice,
  fetchOffices,
  updateOffice,
  deleteOffice,
} from "../controllers/officeControllers.js";
const office = express.Router();

office.get("/", fetchOffices);
office.post("/", createOffice);

office.get("/:id", fetchOffice);
office.put("/:id", updateOffice);
office.delete("/:id", deleteOffice);

export default office;
