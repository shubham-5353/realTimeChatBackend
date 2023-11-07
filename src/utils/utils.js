var jwt = require("jsonwebtoken");

const getJWTToken = async (userInfo) => {
  let token = jwt.sign(userInfo, process.env.JWTSECRECT, { expiresIn: "1h" });
  return token;
};

const verifyJWTToken = async (req, res, next) => {
  let token = req.headers["authorization"];
  try {
    token = token.replace("Bearer ", "");
    let decodedData = jwt.verify(token, process.env.JWTSECRECT);
    req.user = decodedData;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
      error,
    });
  }
};
module.exports = {
  getJWTToken,
  verifyJWTToken,
};
