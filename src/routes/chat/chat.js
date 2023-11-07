var express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const chatController = require("../../controlers/chats/chats");

var utils = require("../../utils/utils");
/**
 *
 * list of available users
 */
router.get("/user/list", utils.verifyJWTToken, chatController.getUsersList);

module.exports = router;
