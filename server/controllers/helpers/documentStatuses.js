import DocumentHistory from "../../models/DocumentHistory.js";
import DocumentStatus from "../../models/DocumentStatus.js";

const OUTGOING = "Outgoing";
const INCOMING = "Incoming";
const RETURNING = "Returning";
const RECEIVED = "Received";
const RETURNED = "Returned";
const CREATED = "Created";

export const originDocumentStatus = async (document) => {
  const documentStatus = new DocumentStatus({
    document: document._id,
    office: document.office,
    status: CREATED,
    date: document.date,
  });

  return documentStatus;
};
export const sendDocumentStatus = async (documentId, officeId, date) => {
  const documentStatus = await DocumentStatus.findOne({
    document: documentId,
    office: officeId,
  });

  if (!documentStatus) throw new Error("Document Status does not exist");

  documentStatus.status = OUTGOING;
  documentStatus.date = date;
  const newDocumentStatus = await documentStatus.save();
  return newDocumentStatus;
};

export const receivingDocumentStatus = async (documentId, officeId, date) => {
  let documentStatus;
  documentStatus = await DocumentStatus.findOne({
    document: documentId,
    office: officeId,
  });

  if (documentStatus && documentStatus.status === OUTGOING) {
    documentStatus.status = RETURNING;
    documentStatus.date = date;
  } else {
    documentStatus = new DocumentStatus({
      document: documentId,
      office: officeId,
      status: INCOMING,
      date: date,
    });
  }

  const newDocumentStatus = await documentStatus.save();
  return newDocumentStatus;
};

export const confirmingDocumentStatus = async (documentId, officeId, date) => {
  const documentStatus = await DocumentStatus.findOne({
    document: documentId,
    office: officeId,
  });

  if (!documentStatus) throw new Error("Document Status does not exist");

  if (documentStatus.status === RETURNING) {
    documentStatus.status = RETURNED;
  } else {
    documentStatus.status = RECEIVED;
  }
  documentStatus.date = date;
  const newDocumentStatus = await documentStatus.save();
  return newDocumentStatus;
};

//Update document status when a history record is about to get deleted
export const updateDocumentStatus = async (documentId, officeId, date) => {
  const documentStatus = await DocumentStatus.findOne({
    document: documentId,
    office: officeId,
  });

  if (!documentStatus) throw new Error("Document Status does not exist");

  switch (documentStatus.status) {
    case RECEIVED:
      documentStatus.status = INCOMING;
      documentStatus.date = date;
      await documentStatus.save();
      break;
    case RETURNED:
      documentStatus.status = RETURNING;
      documentStatus.date = date;
      await documentStatus.save();
      break;
    case RETURNING:
      documentStatus.status = OUTGOING;
      documentStatus.date = date;
      await documentStatus.save();
      break;
    case CREATED:
    case INCOMING:
      await documentStatus.deleteOne();
      break;
    case OUTGOING:
      documentStatus.date = date;
      await updateDocumentStatusOutgoing(documentStatus);
      break;
  }

  return documentStatus;
};

export const updateDocumentStatusOutgoing = async (documentStatus) => {
  const documentHistoryLog = await DocumentHistory.find({
    document: documentStatus.document,
    office: documentStatus.office,
  }).sort({ createdAt: -1 });

  if (documentHistoryLog.length > 2) {
    documentStatus.status = RETURNED;
  } else if (
    documentHistoryLog.length == 1 &&
    documentHistoryLog[0].action === CREATED
  ) {
    documentStatus.status = CREATED;
  } else {
    documentStatus.status = RECEIVED;
  }

  await documentStatus.save();
};
