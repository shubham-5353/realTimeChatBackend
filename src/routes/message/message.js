var express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const messageController = require("../../controlers/messages/messages");

var utils = require("../../utils/utils");

/**
 *
 * upload file attchments
 */
router.post(
  "/messages/uploadAttchments",
  utils.verifyJWTToken,
  messageController.uploadFiles
);

/**
 *
 * Save message
 */
router.post(
  "/messages/send",
  utils.verifyJWTToken,
  messageController.messageSave
);

/**
 *
 * Get message
 */
router.get(
  "/messages/list",
  utils.verifyJWTToken,
  messageController.getMessages
);
module.exports = router;
