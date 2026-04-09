import Type from "../models/Type.js";
import {
  errorId,
  errorMaximumRequired,
  errorUnique,
} from "./helpers/errorHandling.js";
export const getTypes = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Type.countDocuments();

    if (total < 1) {
      return res.status(404).json({ msg: "Empty Record" });
    }

    if (startIndex >= total) {
      return res.status(404).json({ msg: "There's no next page" });
    }

    const types = await Type.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .exec();

    if (!types) {
      return res.status(404).json({ msg: "Empty Record" });
    }
    res.status(200).json({
      data: types,
      currentPage: Number(page),
      numberOfPage: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const createType = async (req, res) => {
  try {
    const type = new Type({
      name: req.body.name,
    });

    await type.save();
    res.status(200).json(type);
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

export const updateType = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ msg: "The name is missing" });
    }

    const type = await Type.findById(req.params.id);

    if (!type) {
      return res.status(404).json({ msg: "Type not found" });
    }

    type.name = req.body.name;

    await type.save();

    res.status(200).json(type);
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

export const deleteType = async (req, res) => {
  try {
    const deleteType = await Type.findByIdAndDelete(req.params.id);
    if (!deleteType) {
      return res.status(404).json({ msg: "Type not found" });
    }

    res.status(200).json({ msg: `Type with ID ${req.params.id} deleted` });
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err);
      return res.status(400).json({ msg: err.message });
    }

    res.status(500).json({ msg: err.message });
  }
};

export const getType = async (req, res) => {
  try {
    const singleType = await Type.findById(req.params.id);

    if (!singleType) {
      return res.status(404).json({ msg: "Type not found" });
    }

    res.status(200).json(singleType);
  } catch (err) {
    if (err.name === "CastError") {
      err.message = errorId(err);
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: err.message });
  }
};
