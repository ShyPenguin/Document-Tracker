import express from "express";
import userRoutes from "./userRoutes.js";
import typeRoutes from "./typeRoutes.js";
import officeRoutes from "./officeRoutes.js";
import documentRoutes from "./documentRoutes.js";
import trackRoutes from "./trackRoutes.js";
const admin = express.Router();

// verify user and role
admin.use("/users", userRoutes);
admin.use("/types", typeRoutes);
admin.use("/offices", officeRoutes);
admin.use("/documents", documentRoutes);
admin.use("/track", trackRoutes);

export default admin;
