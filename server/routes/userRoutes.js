import express from "express";
import {
  viewListofEmployee,
  register,
  findSpecificUser,
  deleteUser,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", viewListofEmployee);
router.post("/", register);
router.get("/:id", /* auth, roleAuth(["admin", "user"]), */ findSpecificUser);
router.delete("/:id", /* auth, roleAuth(["admin"]), */ deleteUser);

export default router;
