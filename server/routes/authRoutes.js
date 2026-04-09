import express from "express";
import { login } from "../controllers/authControllers.js";
const auth = express.Router();

auth.post("/login", login);

export default auth;
