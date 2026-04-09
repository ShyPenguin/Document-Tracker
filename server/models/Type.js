import mongoose from "mongoose";

const typeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
      minLength: 1,
      trim: true,
    },
  },
  { timestamps: true }
);

const Type = mongoose.model("Type", typeSchema);
export default Type;
