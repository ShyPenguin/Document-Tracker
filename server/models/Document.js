import mongoose from "mongoose";

const documentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
    },
    description: {
      type: String,
      required: true,
      maxLength: 150,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Type",
    },
    purpose: {
      type: String,
      required: true,
      maxLength: 150,
    },
    date: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    office: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Office",
    },
    documentHistory: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "documentHistory",
    },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
