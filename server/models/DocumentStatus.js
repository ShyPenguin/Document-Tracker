import mongoose from "mongoose";

const documentStatusSchema = mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Document",
    },
    office: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Office",
    },
    status: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
      required: true,
    },
  },
  { timestamps: true }
);

const DocumentStatus = mongoose.model("documentStatus", documentStatusSchema);
export default DocumentStatus;
