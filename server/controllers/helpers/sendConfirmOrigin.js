import DocumentHistory from "../../models/DocumentHistory.js";
import {
  sendDocumentStatus,
  receivingDocumentStatus,
  confirmingDocumentStatus,
} from "./documentStatuses.js";
import Office from "../../models/Office.js";
import Document from "../../models/Document.js";

export const originDocumentHistory = async (document) => {
  const documentHistory = new DocumentHistory({
    document: document._id,
    date: document.date,
    office: document.office,
    action: "Created",
    remarks: "Document recently created",
  });

  return documentHistory;
};
export const sendDocument = async (req) => {
  const document = req.document;
  const prevOffice = await Office.findById(req.prevOffice);
  const releasedOffice = await Office.findOne({ name: req.releasedOffice });

  if (!releasedOffice) {
    throw new Error(
      `The Office: ${req.releasedOffice} that you are sending does not exist!`
    );
  }

  if (prevOffice.name == releasedOffice.name) {
    throw new Error(
      `Sending to it's current place is not allowed. ${prevOffice.name} to ${releasedOffice.name}`
    );
  }

  const documentHistory = new DocumentHistory({
    document: document._id,
    date: req.date,
    office: releasedOffice._id,
    action: "Send",
    remarks: req.remarks,
  });
  const newDocumentHistory = await documentHistory.save();
  document.documentHistory.push(newDocumentHistory._id);
  await document.save();

  await sendDocumentStatus(document._id, prevOffice._id, req.date);
  await receivingDocumentStatus(document._id, releasedOffice._id, req.date);

  return newDocumentHistory;
};

export const confirmDocument = async (req) => {
  const document = req.document;
  const prevOffice = await Office.findById(req.prevOffice);
  const receivedOffice = await Office.findOne({
    name: req.receivedOffice,
  });

  if (!receivedOffice) {
    throw new Error(
      `The Office: ${req.receivedOffice} that you are confirming does not exist!`
    );
  }
  if (prevOffice.name !== receivedOffice.name)
    throw new Error(
      `Confirming the document from another place is not allowed. ${prevOffice.name} to ${receivedOffice.name}`
    );

  const documentHistory = new DocumentHistory({
    document: document._id,
    date: req.date,
    office: receivedOffice._id,
    action: "Confirmed",
    remarks: req.remarks,
  });
  const newDocumentHistory = await documentHistory.save();
  document.documentHistory.push(newDocumentHistory._id);
  await document.save();

  confirmingDocumentStatus(document._id, receivedOffice._id, req.date);

  return newDocumentHistory;
};
