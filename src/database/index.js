const { Sequelize, DataTypes } = require("sequelize");
const Author = require("./author");
const Category = require("./category");
const Review = require("./review");
const Article = require("./article");

const sequelize = new Sequelize( //AUTHORIIZES AND STARTS SEQUELIZE
  process.env.PGDATABASE, //DATABASE NAME
  process.env.PGUSER, //PG USERNAME
  process.env.PGPASSWORD, //PG PASSWORD
  {
    host: process.env.PGHOST, //HOST NAME
    dialect: "postgres", //THIS IS THE LANGUAGE THAT WE ARE USING WITH SEQUELIZE
  }
);

const models = {
  //OBJECT CONTAINING MODELS OF THE TABLES
  Author: Author(sequelize, DataTypes),
  Category: Category(sequelize, DataTypes),
  Review: Review(sequelize, DataTypes),
  Article: Article(sequelize, DataTypes),
};

//GOES THROUGH EACH KEY OF THE MODEL OBJECT ABOVE (e.g. Author: Author(sequelize, DataTypes)) AND CREATES TABLE RELATIONS DEPENDING ON CODE INSIDE EACH MODEL
Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    //IF THE WORD ASSOCIATE IS PRESENT INSIDE THE MODEL, IT WILL RUN THE FOLLOWING CODE
    models[modelName].associate(models); //RUNS THE .associate INSIDE THE MODEL, WHICH IS CODE THAT DEFINES THE TABLES RELATIONS
  }
});

models.sequelize = sequelize; //PUTS TABLE MODELS INTO SEQUELIZE
models.Sequelize = Sequelize; //IDK WHAT THIS DOES :(

sequelize
  .authenticate() //TESTS IF SEQUELIZE IS CONNECTED TO OUR DATABASE
  .then(() =>
    console.log(
      "------------------------------------------ Connection established ------------------------------------------"
    )
  )
  .catch((e) => {
    console.log(
      "------------------------------------------ Connection failed ------------------------------------------"
    ),
      console.log(e);
  });

module.exports = models; //EXPORTS SEQUELIZE CONTAINING TABLE MODELS TO SERVER.JS