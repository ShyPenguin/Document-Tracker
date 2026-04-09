import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).populate("office").exec();

    if (!user) {
      return res.status(401).json({ msg: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        username: user.username,
        role: user.role,
        office: user.office.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    const userInfo = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
      office: user.office.name,
    };
    res.status(201).json({ token, userInfo });
  } catch (err) {
    res.status(500).json({ msg: "Error logging in user" });
  }
};
