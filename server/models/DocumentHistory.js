import mongoose from "mongoose";

const documentHistorySchema = mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Document",
    },
    date: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    office: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      maxLength: 700,
      required: true,
    },
  },
  { timestamps: true }
);
const DocumentHistory = mongoose.model(
  "documentHistory",
  documentHistorySchema
);
export default DocumentHistory;
