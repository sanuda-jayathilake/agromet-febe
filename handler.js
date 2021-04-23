"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const userTable = process.env.USER_TABLE;
const { uuid } = require("uuidv4");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("./config");

function response(statusCode, message) {
    return {
      statusCode: statusCode,
      body: JSON.stringify(message),
    };
  }
  function sortByDate(a, b) {
    if (a.createdAt > b.createdAt) {
      return -1;
    } else return 1;
  }
  module.exports.registerUser = (event, context, callback) => {
    const reqBody = JSON.parse(event.body);
    const hashedPassword = bcrypt.hashSync(reqBody.password, 10);
    const userRegisterObject = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      email: reqBody.email,
      password: hashedPassword,
      firstName: reqBody.firstName,
      lastName: reqBody.lastName,
    };
    return db
      .put({
        TableName: userTable,
        Item: userRegisterObject,
      })
      .promise()
      .then(() => {
        callback(null, response(201, userRegisterObject));
      })
      .catch((err) => response(null, response(err.statusCode, err)));
  };
