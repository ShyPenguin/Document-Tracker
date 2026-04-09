import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import cors from "cors";
import helmet from "helmet";
import departmentRoutes from "./routes/departmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import root from "./routes/root.js";
import {
  verifyToken,
  roleAuth,
  deptAuth,
} from "./middlewares/authMiddleWare.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

/* DATABASE */
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3001);
    console.log("Connected to Mongoose");
  })
  .catch((err) => console.log(err));

/* ROUTES */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "public")));
app.use("/", root);
app.use("/auth", authRoutes);
app.use("/admin", verifyToken, roleAuth("admin"), adminRoutes);
app.use(
  "/departments/:department",
  verifyToken,
  roleAuth(["user", "admin"]),
  deptAuth,
  departmentRoutes
);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ msg: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});
