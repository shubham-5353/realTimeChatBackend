module.exports = (sequelize, DataTypes) => {
  var chats = sequelize.define(
    "chats",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user1Id: {
        type: DataTypes.INTEGER(16),
        allowNull: false,
      },
      user2Id: {
        type: DataTypes.INTEGER(16),
        allowNull: false,
      },
      chatInitiateBy: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
      tableName: "chats",
      timestamps: false,
    }
  );

  return chats;
};
