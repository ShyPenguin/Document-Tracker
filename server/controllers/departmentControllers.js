import Document from "../models/Document.js";
import DocumentStatus from "../models/DocumentStatus.js";
import DocumentHistory from "../models/DocumentHistory.js";
import Office from "../models/Office.js";
import { addDocumentHistoryRecord } from "./trackControllers.js";
import { updateDocumentStatus } from "./helpers/documentStatuses.js";
//Helpers for this controlelr
const getNumberOfStatuses = async (officeId, status) => {
  const numberOfDocuments = await DocumentStatus.countDocuments({
    office: officeId,
    status: status,
  });
  return numberOfDocuments;
};

const validateStatus = (status) => {
  if (
    status == "Outgoing" ||
    status == "Incoming" ||
    status == "Returning" ||
    status == "Received" ||
    status == "Returned" ||
    status == "Created"
  )
    return true;

  return false;
};

export const getNumberOfDocuments = async (req, res) => {
  try {
    const office = await Office.findOne({ name: req.params.department });
    const numberOfOutgoing = await getNumberOfStatuses(office._id, "Outgoing");
    const numberOfIncoming = await getNumberOfStatuses(office._id, "Incoming");
    const numberOfReturning = await getNumberOfStatuses(
      office._id,
      "Returning"
    );
    const numberOfReceived = await getNumberOfStatuses(office._id, "Received");
    const numberOfReturned = await getNumberOfStatuses(office._id, "Returned");
    const numberOfCreated = await getNumberOfStatuses(office._id, "Created");
    res.status(200).json({
      Outgoing: numberOfOutgoing,
      Incoming: numberOfIncoming,
      Returning: numberOfReturning,
      Received: numberOfReceived,
      Returned: numberOfReturned,
      Created: numberOfCreated,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getDocumentStatuses = async (req, res) => {
  try {
    if (!validateStatus(req.params.status)) {
      return res
        .status(400)
        .json({ msg: "The requested Status does not exist" });
    }

    const office = await Office.findOne({ name: req.params.department });

    const query = {
      office: office._id,
      status:
        req.params.status === "Received"
          ? { $in: ["Received", "Created"] }
          : req.params.status,
    };

    const page = req.query.page || 1;
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await DocumentStatus.countDocuments(query);

    if (startIndex >= total) {
      return res.status(404).json({ msg: "There's no next page" });
    }

    const documentStatuses = await DocumentStatus.find(query)
      .sort({ date: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .populate({
        path: "document",
        populate: [
          { path: "type", model: "Type" },
          {
            path: "documentHistory",
            model: "documentHistory",
            populate: { path: "office", model: "Office", select: "name" },
          },
        ],
      })
      .exec();

    if (documentStatuses.length < 1) {
      return res.status(404).json({ msg: "Empty Record" });
    }

    const documents = documentStatuses.map((docStatus) => {
      let index = docStatus.document.documentHistory.findLastIndex(
        (element) => element.office.id == office.id
      );

      const document = docStatus.document;
      if (docStatus.status === "Outgoing") index += 1;

      const remarks = document.documentHistory[index].remarks
        ? document.documentHistory[index].remarks
        : "";

      let senderIndex;

      if (docStatus.status === "Incoming" || docStatus.status === "Returning") {
        senderIndex = index - 1;
      } else if (
        docStatus.status === "Received" ||
        docStatus.status === "Returned"
      ) {
        senderIndex = index - 2;
      } else {
        senderIndex = index;
      }

      const senderRecord = document.documentHistory[senderIndex];
      const officeName = senderRecord.office.name;

      return {
        id: document._id,
        title: document.title,
        type: document.type.name,
        remarks: remarks,
        office: officeName,
        date: docStatus.date,
      };
    });

    res.status(200).json({
      data: documents,
      currentPage: Number(page),
      numberOfPage: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err);
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: err.message });
  }
};

export const filterDocumentStatuses = async (req, res) => {
  try {
    if (!validateStatus(req.params.status)) {
      return res
        .status(400)
        .json({ msg: "The requested Status does not exist" });
    }

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    if (
      startDate &&
      endDate &&
      new Date(endDate).getTime() < new Date(startDate).getTime()
    ) {
      return res
        .status(404)
        .json({ msg: "End date should be after or equal to the start date" });
    }

    const office = await Office.findOne({ name: req.params.department });

    const query = {
      office: office._id,
      status:
        req.params.status === "Received"
          ? { $in: ["Received", "Created"] }
          : req.params.status,
    };

    if (startDate) query.date = { ...query.date, $gte: new Date(startDate) };
    if (endDate) query.date = { ...query.date, $lte: new Date(endDate) };

    const page = req.query.page || 1;
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await DocumentStatus.countDocuments(query);
    if (total < 1) {
      return res.status(404).json({ msg: "Empty Record" });
    }
    if (startIndex >= total) {
      return res.status(404).json({ msg: "There's no next page" });
    }

    const documentStatuses = await DocumentStatus.find(query)
      .populate({
        path: "document",
        populate: [
          { path: "type", model: "Type" },
          {
            path: "documentHistory",
            model: "documentHistory",
            populate: { path: "office", model: "Office", select: "name" },
          },
        ],
      })
      .sort({ date: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .exec();

    const documents = documentStatuses.map((docStatus) => {
      let index = docStatus.document.documentHistory.findLastIndex(
        (element) => element.office.id == office.id
      );

      const document = docStatus.document;
      if (docStatus.status === "Outgoing") index += 1;

      const remarks = document.documentHistory[index].remarks
        ? document.documentHistory[index].remarks
        : "";

      let senderIndex;

      if (docStatus.status === "Incoming" || docStatus.status === "Returning") {
        senderIndex = index - 1;
      } else if (
        docStatus.status === "Received" ||
        docStatus.status === "Returned"
      ) {
        senderIndex = index - 2;
      } else {
        senderIndex = index;
      }

      const senderRecord = document.documentHistory[senderIndex];
      const officeName = senderRecord.office.name;

      return {
        id: document._id,
        title: document.title,
        type: document.type.name,
        remarks: remarks,
        office: officeName,
        date: docStatus.date,
      };
    });

    res.status(200).json({
      data: documents,
      currentPage: Number(page),
      numberOfPage: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err);
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: err.message });
  }
};

export const confirm = async (req, res) => {
  req.body.action = "Confirmed";

  await addDocumentHistoryRecord(req, res);
};

export const send = async (req, res) => {
  req.body.action = "Send";
  await addDocumentHistoryRecord(req, res);
};

export const revertStatus = async (req, res) => {
  try {
    const office = await Office.findOne({ name: req.params.department });
    const document = await Document.findById(req.params.id)
      .populate("documentHistory")
      .exec();

    const documentHistory = document.documentHistory;
    const index = documentHistory.findLastIndex(
      (element) => element.office == office.id
    );

    if (index === -1) {
      return res.status(403).json({
        msg: "Your office is not authorized to modify this document's status",
      });
    }
    if (index + 2 < documentHistory.length) {
      throw new Error("This document's status can't be modified");
    }

    const documentHistoryRecord = documentHistory.pop();
    const prevDocumentHistoryRecord =
      document.documentHistory[document.documentHistory.length - 1];
    if (documentHistoryRecord.action === "Created") {
      throw new Error("This document's status can't be revert.");
    }

    const documentStatus = await DocumentStatus.findOne({
      document: document._id,
      office: office._id,
    });
    if (!documentStatus) {
      return res.status(500).json({ msg: "Document Status does not exist" });
    }
    if (
      documentStatus.status == "Incoming" ||
      documentStatus.status == "Returning"
    ) {
      return res.status(403).json({
        msg: "Your office is not authorized to modify this document's status",
      });
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
    if (err.message === "This document's status can't be revert.") {
      const message =
        "This document's status can't be revert since it's recently created.";
      return res.status(400).json({ msg: message });
    }
    if (err.message === "This document's status can't be modified") {
      const message =
        "This document's status can't be modified since it has been confirmed on the other side";
      return res.status(400).json({ msg: message });
    }
    res.status(500).json({ msg: err.message });
  }
};
