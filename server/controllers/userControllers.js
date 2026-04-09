import User from "../models/User.js";
import bcrypt from "bcrypt";
import Office from "../models/Office.js";
import {
  errorMaximumRequired,
  errorUnique,
  errorId,
} from "./helpers/errorHandling.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, username, password, role, office } = req.body;

    if (!office) throw new Error("The office is missing");
    if (!password) throw new Error("The password is missing");

    const hashedPassword = await bcrypt.hash(password, 10);

    const userOffice = await Office.findOne({ name: office });
    if (!userOffice)
      throw new Error(`Office ${req.body.office} does not exist!`);

    const user = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      role,
      office: userOffice._id,
    });

    await user.save();
    const response = {
      _id: user._id,
      firstName,
      lastName,
      username,
      password,
      role,
      office: userOffice.name,
    };
    res.status(201).json(response);
  } catch (err) {
    if (err.errors) {
      err.message = errorMaximumRequired(err);
    }

    if (err.code && err.code === 11000) {
      err.message = errorUnique(err);
    }

    res.status(400).json({ msg: err.message });
  }
};

export const viewListofEmployee = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await User.countDocuments();

    if (total < 1) {
      return res.status(404).json({ msg: "Empty Record" });
    }

    if (startIndex >= total) {
      return res.status(404).json({ msg: "There's no next page" });
    }

    const users = await User.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .populate("office")
      .exec();

    res.status(200).json({
      data: users,
      currentPage: Number(page),
      numberOfPage: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const findSpecificUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("office");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err);
    }
    res.status(404).json({ msg: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({
      msg: `User ${user.firstName} ${user.lastName} deleted successfully`,
    });
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err, "Delete");
    }

    res.status(404).json({ msg: err.message });
  }
};
