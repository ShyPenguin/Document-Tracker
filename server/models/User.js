import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 50,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    office: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Office",
    },
    //refreshTokens: [{ token: { type: String, required: true } }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
