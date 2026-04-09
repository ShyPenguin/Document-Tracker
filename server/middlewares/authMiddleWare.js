import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ msg: "Access Denied" });
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const roleAuth = (roles) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ msg: "Unauthorized Role" });
      } else {
        next();
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };
};

export const deptAuth = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      return next();
    }

    if (!req.params.department || req.params.department !== req.user.office)
      return res.status(403).json({ msg: "Unauthorized Department" });

    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
