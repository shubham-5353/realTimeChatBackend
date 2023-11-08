module.exports = (sequelize, DataTypes) => {
  var messages = sequelize.define(
    "messages",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      chatId: {
        type: DataTypes.INTEGER(16),
        allowNull: false,
      },
      senderUserId: {
        type: DataTypes.INTEGER(16),
        allowNull: false,
      },
      receiverUserId: {
        type: DataTypes.INTEGER(16),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachmentUrl: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "messages",
      timestamps: false,
    }
  );

  return messages;
};
