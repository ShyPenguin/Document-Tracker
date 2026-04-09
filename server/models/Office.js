import mongoose from "mongoose";

const officeSchema = mongoose.Schema(
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

const Office = mongoose.model("Office", officeSchema);
export default Office;
