var fs = require("fs");
var path = require("path");

var Sequelize = require("sequelize");
var basename = path.basename(module.filename);

var config = {
  database: process.env.DBNAME,
  username: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  port: process.env.DBPORT,
  pool: {
    min: 1,
    max: 10,
  },
};
const db = {};
var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

sequelize.authenticate().then((errors) => {
  if (errors) {
    console.log("Sequelize Error: ", errors);
  }
});

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename;
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
