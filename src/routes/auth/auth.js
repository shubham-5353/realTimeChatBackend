var express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const authController = require("../../controlers/auth/auth");

/**
 *
 * user sign up
 */
router.post(
  "/user/signUp",
  [
    check("name").trim().isLength({ min: 1 }).withMessage("name is required"),
    check("gender")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Gender is required"),
    check("mobileNumber")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Valid mobile number is required"),
    check("password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("password is required"),
    check("email")
      .isEmail()
      .toLowerCase()
      .trim()
      .withMessage("Enter Valid Email Address"),
  ],
  authController.userSignUp
);

/**
 *
 * user login
 */
router.post(
  "/user/login",
  [
    check("email")
      .isEmail()
      .toLowerCase()
      .trim()
      .withMessage("Enter Valid Email Address"),
    check("password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("password is required"),
  ],
  authController.userLogin
);

module.exports = router;
