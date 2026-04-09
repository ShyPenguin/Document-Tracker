import Office from "../models/Office.js";
import {
  errorId,
  errorMaximumRequired,
  errorUnique,
} from "./helpers/errorHandling.js";

export const fetchOffices = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Office.countDocuments();
    if (total < 1) {
      return res.status(404).json({ msg: "Empty Record" });
    }

    if (startIndex >= total) {
      return res.status(404).json({ msg: "There's no next page" });
    }

    const offices = await Office.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .exec();

    if (!offices) {
      return res.status(404).json({ msg: "Empty Record" });
    }
    res.status(200).json({
      data: offices,
      currentPage: Number(page),
      numberOfPage: Math.ceil(total / LIMIT),
    });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

export const fetchOffice = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);

    if (!office) {
      return res.status(404).json({ msg: "Office not found" });
    }

    res.status(200).json(office);
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err);
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: err.message });
  }
};

export const createOffice = async (req, res) => {
  try {
    const office = new Office({
      name: req.body.name,
    });

    await office.save();
    res.status(200).json(office);
  } catch (err) {
    if (err.errors) {
      err.message = errorMaximumRequired(err);
      return res.status(400).json({ msg: err.message });
    }

    if (err.code && err.code === 11000) {
      err.message = errorUnique(err);
      return res.status(400).json({ msg: err.message });
    }

    res.status(500).json({ msg: err.message });
  }
};

export const updateOffice = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ msg: "The name is missing" });
    }

    const office = await Office.findById(req.params.id);

    if (!office) {
      return res.status(404).json({ msg: "Office not found" });
    }

    office.name = req.body.name;

    await office.save();

    res.status(200).json(office);
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

    res.status(500).json({ msg: err.message });
  }
};

export const deleteOffice = async (req, res) => {
  try {
    const deleteOffice = await Office.findByIdAndDelete(req.params.id);
    if (!deleteOffice) {
      return res.status(404).json({ msg: "Office not found" });
    }

    res.status(200).json({ msg: `Office with ID ${req.params.id} deleted` });
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err);
      return res.status(400).json({ msg: err.message });
    }

    res.status(500).json({ msg: err.message });
  }
};
