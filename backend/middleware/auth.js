const jwt = require("jsonwebtoken"); 
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "d96XSqTg35Af");
    const userId = decodedToken.userId;
    req.auth = {
      userId,
    };
    next();
  } catch (error) {
    res.status(403).json({ error });
  }
};
