import Document from "../models/Document.js";
import Type from "../models/Type.js";
import DocumentHistory from "../models/DocumentHistory.js";
import DocumentStatus from "../models/DocumentStatus.js";
import Office from "../models/Office.js";
import {
  errorMaximumRequired,
  errorUnique,
  errorId,
} from "./helpers/errorHandling.js";
import { originDocumentHistory } from "./helpers/sendConfirmOrigin.js";
import { originDocumentStatus } from "./helpers/documentStatuses.js";

export const getDocuments = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Document.countDocuments({});
    if (startIndex >= total) {
      return res.status(404).json({ msg: "There's no next page" });
    }

    const documents = await Document.find({})
      .sort({ date: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .populate("office")
      .populate("type")
      .exec();

    if (!documents) {
      return res.status(404).json({ msg: "Empty Record" });
    }

    res.status(200).json({
      data: documents,
      currentPage: Number(page),
      numberOfPage: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const searchDocument = async (req, res) => {
  try {
    const searchText = req.query.text || "";
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
    const titleQry = new RegExp(searchText, "i");
    const descriptionQry = new RegExp(searchText, "i");
    const purposeQry = new RegExp(searchText, "i");
    let typeId;
    let officeId;

    if (searchText) {
      const type = await Type.findOne({
        name: { $regex: searchText, $options: "i" },
      });
      if (type) typeId = type._id;
      const office = await Office.findOne({
        name: { $regex: searchText, $options: "i" },
      });
      if (office) officeId = office._id;
    }

    const query = {
      $or: [
        { title: titleQry },
        { description: descriptionQry },
        { purpose: purposeQry },
      ],
    };

    if (typeId) query.$or.push({ type: typeId });
    if (officeId) query.$or.push({ office: officeId });
    if (startDate) query.date = { $gte: new Date(startDate) };
    if (endDate) query.date = { ...query.date, $lte: new Date(endDate) };

    const page = req.query.page || 1;
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Document.countDocuments(query);

    if (total < 1) {
      return res.status(404).json({ msg: "Empty Record" });
    }

    if (startIndex >= total) {
      return res.status(404).json({ msg: "There's no next page" });
    }
    const documents = await Document.find(query)
      .sort({ date: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .populate("office")
      .populate("type")
      .exec();

    if (!documents) {
      return res.status(404).json({ msg: "Empty Record" });
    }

    res.status(200).json({
      data: documents,
      currentPage: Number(page),
      numberOfPage: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const createDocument = async (req, res) => {
  try {
    //Body: Type, Office, Title, Purpose, Descirption, Date (if empty default to now)
    //If User is User with Action then Office is the user's office
    if (!req.body.type) {
      return res.status(400).json({ msg: "The type is missing" });
    }
    const type = await Type.findOne({ name: req.body.type });
    if (!type) {
      return res.status(400).json({
        msg: `Document Type ${req.body.type} does not exist!`,
      });
    }

    //If department user
    if (req.params.department) {
      if (req.body.office && req.params.department !== req.body.office) {
        return res.status(403).json({
          msg: `${req.params.department} user is not authorized to create a document in ${req.body.office}`,
        });
      } else {
        req.body.office = req.params.department;
      }
    }
    if (!req.body.office) {
      return res.status(400).json({ msg: "The office is missing" });
    }

    const office = await Office.findOne({ name: req.body.office });
    if (!office) {
      return res.status(400).json({
        msg: `Office ${req.body.office} does not exist!`,
      });
    }

    const document = new Document({
      title: req.body.title,
      description: req.body.description,
      type: type._id,
      purpose: req.body.purpose,
      office: office._id,
      date: req.body.date ? new Date(req.body.date) : Date.now(),
    });

    const documentHistoryData = await originDocumentHistory(document);

    document.documentHistory.push(documentHistoryData._id);

    const documentStatus = await originDocumentStatus(document);

    await document.save();
    await documentHistoryData.save();
    await documentStatus.save();

    const response = {
      _id: document._id,
      title: document.title,
      description: document.description,
      type: type.name,
      purpose: document.purpose,
      office: office.name,
      date: document.date,
    };
    res.status(201).json(response);
  } catch (err) {
    if (err.code && err.code === 11000) {
      err.message = errorUnique(err);
      return res.status(400).json({ msg: err.message });
    }

    if (err.errors) {
      err.message = errorMaximumRequired(err);
      return res.status(400).json({ msg: err.message });
    }

    res.status(500).json({ msg: err.message });
  }
};

export const getDocumentDetails = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("office")
      .populate("type")
      .exec();

    if (!document) {
      return res.status(404).json({ msg: "Document not found" });
    }

    res.status(200).json(document);
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err);
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: err.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    // (if empty don't change)
    //Body: Type, Office, Title, Purpose, Descirption, Date
    //If User is User with Action then Office is the user's office
    const document = await Document.findById(req.params.id)
      .populate("office")
      .populate("type")
      .exec();

    if (!document) {
      return res.status(404).json({ msg: "Document not found" });
    }

    if (!req.body.type) req.body.type = document.type.name;
    if (!req.body.office) req.body.office = document.office.name;

    const type = await Type.findOne({ name: req.body.type });
    const office = await Office.findOne({ name: req.body.office });

    if (!type) {
      return res
        .status(400)
        .json({ msg: `Document Type ${req.body.type} does not exist!` });
    }

    if (!office) {
      return res
        .status(400)
        .json({ msg: `Office ${req.body.office} does not exist!` });
    }

    if (
      req.params.department &&
      req.params.department !== document.office.name
    ) {
      return res
        .status(403)
        .json({ msg: "You are not Authorized to update this document" });
    }
    const documentHistoryRecord = await DocumentHistory.findById(
      document.documentHistory[0]._id
    );
    const documentStatus = await DocumentStatus.findOne({
      document: document._id,
      office: documentHistoryRecord.office,
    });

    if (req.body.title) document.title = req.body.title;
    if (req.body.description) document.description = req.body.description;
    if (req.body.purpose) document.purpose = req.body.purpose;
    document.type = type._id;

    if (document.office.id !== office.id) {
      changeOffice(document, documentHistoryRecord, documentStatus, office._id);
    }

    if (req.body.date) {
      const date = new Date(req.body.date);
      changeDate(document, documentHistoryRecord, documentStatus, date);
    }

    await document.save();
    await documentStatus.save();
    await documentHistoryRecord.save();

    const response = {
      _id: document._id,
      title: document.title,
      description: document.description,
      type: type.name,
      purpose: document.purpose,
      office: office.name,
      date: document.date,
    };
    res.status(200).json(response);
  } catch (err) {
    if (err.errors) {
      err.message = errorMaximumRequired(err);
      return res.status(400).json({ msg: err.message });
    }

    if (err.code && err.code === 11000) {
      err.message = errorUnique(err);
      return res.status(400).json({ msg: err.message });
    }

    if (err.name === "CastError") {
      err.message = errorId(err);
      return res.status(400).json({ msg: err.message });
    }

    if (err.message === "Office can't be changed") {
      return res.status(400).json({
        msg: "Can't change document's origin office that has already been sent!",
      });
    }

    if (err.message === "Date can't be changed") {
      return res.status(400).json({
        msg: "Can't change document's origin date that has already been sent!",
      });
    }

    res.status(500).json({ msg: err.message });
  }
};

const changeOffice = (
  document,
  documentHistoryRecord,
  documentStatus,
  officeId
) => {
  if (document.documentHistory.length < 3) {
    document.office = officeId;
    documentHistoryRecord.office = officeId;
    documentStatus.office = officeId;
  } else {
    throw new Error("Office can't be changed");
  }
};

const changeDate = (document, documentHistoryRecord, documentStatus, date) => {
  if (document.documentHistory.length < 3) {
    document.date = date;
    documentHistoryRecord.date = date;
    documentStatus.date = date;
  } else {
    throw new Error("Date can't be changed");
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("office")
      .exec();

    if (!document) {
      return res.status(404).json({ msg: "Document not found" });
    }

    if (
      req.params.department &&
      req.params.department !== document.office.name
    ) {
      return res
        .status(403)
        .json({ msg: "You are not Authorized to delete this document" });
    }

    if (req.params.department && document.documentHistory.length > 2) {
      return res.status(400).json({
        msg: "This document can't be deleted since it has gone through other offices.",
      });
    }
    await DocumentHistory.deleteMany({
      document: document._id,
    });
    await DocumentStatus.deleteMany({
      document: document._id,
    });
    await document.deleteOne();
    res.status(200).json(document);
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err, "Delete");
      return res.status(400).json({ msg: err.message });
    }

    res.status(500).json({ msg: err.message });
  }
};
