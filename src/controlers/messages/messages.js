var Sequelize = require("sequelize");
const Op = Sequelize.Op;
let fs = require("fs");
let os = require("os"),
  dir_home = os.homedir();

var moment = require("moment");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

var models = require("../../models/index");
const utils = require("../../utils/utils");

const uploadFiles = async (req, res, next) => {
  console.log("");
  if (!req.files?.imageData) {
    return res.status(422).json({
      success: false,
      message: "Please select a file to upload.",
    });
  }
  let fileName = `Attachments${new Date().getTime()}${
    req.files.imageData.name
  }`;
  let file = req.files.imageData;
  var location = `${dir_home}/realTimeChatUploads/`;
  fs.mkdirSync(location, { recursive: true });
  file.mv(`${dir_home}/realTimeChatUploads/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ success: false, error: err });
    return res.status(200).json({
      success: true,
      msg: "File has been uploaded successfully.",
      url: `/realTimeChatUploads/${fileName}`,
    });
  });
};
const getMessages = async (req, res, next) => {
  if (!req.query.userId) {
    return res
      .status(422)
      .json({ success: false, message: "Please provide user id" });
  }
  let chatDetails = await models.chats.findOne({
    where: {
      user1Id: [req.user.id, req.query.userId],
      user2Id: [req.user.id, req.query.userId],
    },
  });
  if (chatDetails) {
    let messages = await models.messages.findAll({
      where: {
        chatId: chatDetails.id,
      },
    });
    return res.status(200).json({ success: true, data: messages });
  }
  return res.status(200).json({ success: true, data: [] });
};
const messageSave = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(422).json({ success: true, err: err.array() });
    }
    let time = moment.utc();
    const { message, attachmentUrl } = req.body;
    console.log("message", message);
    let chatId = null;
    if (!req.body?.chatId) {
      // Create one chat history between loggedin user and receiver user if not present.
      const [row, created] = await models.chats.findOrCreate({
        where: {
          user1Id: [req.user.id, req.body.userId],
          user2Id: [req.user.id, req.body.userId],
        },
        defaults: {
          user1Id: req.user.id,
          user2Id: req.body.userId,
          isActive: true,
          createdAt: time,
          updatedAt: time,
        },
      });
      if (row) {
        chatId = row.id;
      }
    } else {
      // then assing chat id.
      chatId = req.body?.chatId;
    }
    let messageData = await models.messages.create({
      message,
      chatId,
      senderUserId: req.user.id,
      receiverUserId: req.body.userId,
      attachmentUrl,
      isActive: true,
      createdAt: time,
      updatedAt: time,
    });
    res.io.emit(`message_${req.user.id}`, { data: messageData });
    res.io.emit(`message_${req.body.userId}`, { data: messageData });
    return res.status(201).json({
      success: true,
      message: "Message saved successfully.",
      chatId,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      error: new Error(error),
    });
  }
};
module.exports = {
  uploadFiles,
  messageSave,
  getMessages,
};
