var Sequelize = require("sequelize");
const Op = Sequelize.Op;

var moment = require("moment");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

var models = require("../../models/index");
var utils = require("../../utils/utils");
const userSignUp = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(422).json({ success: true, err: err.array() });
    }
    const { name, mobileNumber, password, email, gender } = req.body;
    let time = moment.utc();
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    let userInfo = await models.users.findOne({ where: { email: email } });
    if (userInfo) {
      return res.status(409).json({
        status: false,
        message: "Please login ! user already exists.",
      });
    }
    await models.users.create({
      name,
      email,
      mobileNumber,
      gender,
      salt,
      password: hashedPassword,
      isActive: true,
      createdAt: time,
      updatedAt: time,
    });
    return res.status(201).json({
      success: true,
      message: "User sinup successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      error: new Error(error),
    });
  }
};

const userLogin = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(422).json({ success: true, err: err.array() });
    }
    const { email, password } = req.body;
    let userInfo = await models.users.findOne({
      where: { email: email, isActive: true },
    });
    userInfo = JSON.parse(JSON.stringify(userInfo));
    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: "Email is not registerd ! Please try to signup",
      });
    }
    let passwordIsValid = await bcrypt.compareSync(password, userInfo.password);

    //Check if password is Valid or not
    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password !",
      });
    }
    let jwtToken = await utils.getJWTToken(userInfo);
    return res.status(200).json({
      success: true,
      userInfo: {
        userId: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        gender: userInfo.gender,
        mobileNumber: userInfo.mobileNumber,
      },
      authToken: jwtToken,
      message: "You have successfully login.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: new Error(error),
    });
  }
};

module.exports = { userLogin, userSignUp };
