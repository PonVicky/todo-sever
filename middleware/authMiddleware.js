// const jwt = require("jsonwebtoken");
// const config = require("../config/config");

// const authenticateToken = (req, res, next) => {
//   const token = req.headers["authorization"];
//   console.log(token);
//   if (!token) return res.status(401).json({ error: "Unauthorized!" });

//   jwt.verify(token, config.jwtSecret, (err, decoded) => {
//     if (err) return res.status(403).json({ error: "Forbidden" });
//     req.user = decoded;
//     next();
//   });
// };

// module.exports = { authenticateToken };

const jwt = require("jsonwebtoken");
const config = require("../config/config");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // ✅ extract only the token part

  if (!token) return res.status(401).json({ error: "Unauthorized!" });

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = decoded;
    next();
  });
};

module.exports = { authenticateToken };
