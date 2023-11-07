var Sequelize = require("sequelize");
const Op = Sequelize.Op;

var moment = require("moment");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

var models = require("../../models/index");
const utils = require("../../utils/utils");

const getUsersList = async (req, res, next) => {
  try {
    let condition = {
      [Op.not]: {
        email: req.user.email,
      },
    };

    if (req.query?.seach) {
      condition = Object.assign(condition, {
        [Op.or]: {
          name: { [Op.like]: `%${req.query.seach}%` },
          email: { [Op.like]: `%${req.query.seach}%` },
          mobileNumber: { [Op.like]: `%${req.query.seach}%` },
        },
      });
    }
    let usersList = await models.users.findAll({
      where: condition,
    });
    return res.status(200).json({
      status: true,
      data: usersList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: new Error(error),
    });
  }
};

module.exports = {
  getUsersList,
};
