import express from "express";
import { createType, getTypes, updateType, deleteType, getType } from "../controllers/typeControllers.js";
const type = express.Router();

type.get("/", getTypes);
type.post("/", createType);
type.put("/:id", updateType);
type.delete("/:id", deleteType);
type.get("/:id", getType)

export default type;
