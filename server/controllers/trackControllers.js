import DocumentHistory from "../models/DocumentHistory.js";
import Document from "../models/Document.js";
import { updateDocumentStatus } from "./helpers/documentStatuses.js";
import { confirmDocument, sendDocument } from "./helpers/sendConfirmOrigin.js";
import {
  errorId,
  errorUnique,
  errorMaximumRequired,
} from "./helpers/errorHandling.js";

export const getDocumentTrack = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate({
        path: "documentHistory",
        populate: { path: "office", model: "Office" },
      })
      .exec();

    if (!document) {
      return res.status(404).json({ msg: "Document not found" });
    }

    res.status(200).json(document.documentHistory);
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err, "get");
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: err.message });
  }
};

export const deleteDocumentHistoryRecord = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("documentHistory")
      .exec();

    if (!document) {
      return res.status(404).json({ msg: "Document not found" });
    }
    let documentHistoryRecord = document.documentHistory.pop();
    const prevDocumentHistoryRecord =
      document.documentHistory[document.documentHistory.length - 1];
    if (documentHistoryRecord.action === "Created") {
      throw new Error("This record can't be deleted.");
    }

    await updateDocumentStatus(
      document._id,
      documentHistoryRecord.office,
      prevDocumentHistoryRecord.date
    );
    if (documentHistoryRecord.action == "Send") {
      await updateDocumentStatus(
        document._id,
        prevDocumentHistoryRecord.office,
        prevDocumentHistoryRecord.date
      );
    }

    await documentHistoryRecord.deleteOne();
    await document.save();

    res.status(200).json(document.documentHistory);
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err);
      return res.status(400).json({ msg: err.message });
    }

    if (err.message === "This record can't be deleted.") {
      err.message = "To delete this, you must delete the whole document itself";
      return res.status(400).json({ msg: err.message });
    }

    res.status(500).json({ msg: err.message });
  }
};

export const addDocumentHistoryRecord = async (req, res) => {
  try {
    //Body: action, date, office, remarks
    //If User is User with Action then Office is the user's office;

    if (
      req.body.action !== "Confirmed" &&
      req.body.action !== "Send" &&
      req.body.action !== "Created"
    ) {
      return res.status(400).json({
        msg: `${req.body.action} is not valid. Choose only Confirmed or Send as action`,
      });
    }
    const document = await Document.findById(req.params.id)
      .populate({
        path: "documentHistory",
        populate: { path: "office", model: "Office" },
      })
      .exec();

    if (!document) {
      return res.status(404).json({ msg: "Document not found" });
    }

    const docHlength = document.documentHistory.length;
    const documentHistoryRecord = document.documentHistory[docHlength - 1];

    if (
      req.params.department &&
      req.params.department !== documentHistoryRecord.office.name
    ) {
      return res.status(403).json({
        msg: "Your office is not authorized to confirm/send this document",
      });
    }
    const currAction = req.body.action;
    const prevAction = documentHistoryRecord.action;

    let newDocumentHistory;

    const date = new Date(req.body.date);
    if (date.getTime() < new Date(documentHistoryRecord.date).getTime()) {
      const message = `The requested date ${date.toLocaleDateString()} is not possible since it is earlier than the previous document history record`;
      return res.status(400).json({ msg: message });
    }
    if (
      currAction === "Send" &&
      (prevAction === "Confirmed" || prevAction === "Created")
    ) {
      newDocumentHistory = await sendDocument({
        document: document,
        date: date,
        prevOffice: documentHistoryRecord.office,
        releasedOffice: req.body.office,
        remarks: req.body.remarks ? req.body.remarks : "N/A",
      });
    } else if (currAction === "Confirmed" && prevAction === "Send") {
      //If department user
      if (req.params.department) {
        req.body.office = req.params.department;
      }

      newDocumentHistory = await confirmDocument({
        document: document,
        date: date,
        prevOffice: documentHistoryRecord.office,
        receivedOffice: req.body.office,
        remarks: req.body.remarks ? req.body.remarks : "N/A",
      });
    } else {
      const message = `The Action: ${currAction} in adding a document history record failed since the previous action is ${prevAction}`;
      return res.status(400).json({ msg: message });
    }

    res.status(201).json(newDocumentHistory);
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err);
      return res.status(400).json({ msg: err.message });
    }

    if (err.code && err.code === 11000) {
      err.message = errorUnique(err);
      return res.status(400).json({ msg: err.message });
    }

    if (err.errors) {
      err.message = errorMaximumRequired(err);
      return res.status(400).json({ msg: err.message });
    }

    if (err.message.includes("The Office:")) {
      return res.status(400).json({ msg: err.message });
    }

    if (err.message.includes("Sending to it's")) {
      return res.status(400).json({ msg: err.message });
    }

    if (err.message.includes("Confirming the document from another place")) {
      return res.status(400).json({ msg: err.message });
    }

    res.status(500).json({ msg: err.message });
  }
};
