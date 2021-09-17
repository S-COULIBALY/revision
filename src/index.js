const { Console } = require("console");
const express = require("express");
//import express from "express"

const PORT = process.env.PORT || 3300;
const app = express();

const start = (port) => {
  if (!PORT) {
    throw new Error("The port is missing. Please define it.");
  }
  app.listen(port, () => {
    console.log(`server started on ${port}`);
  });
};

module.exports = { start };

/* -------------------------------------- Joi pour les validation ---------------------------------------------*/
const Joi = require("joi");

/*
On décrit un schéma, la structure qu'on attend, qu'on devrait recevoir (souvent object)
ex : système d'inscription
username, adresse mail, age, password
*/

const schema = Joi.object({
  username: Joi.string().min(5).max(30).required(),
  password: Joi.string().min(8).max(32).required(),
  age: Joi.number().integer().required(),
  email: Joi.string().email().required(),
});

//ça nous donne un object assez illisible MAIS qui a une méthode validate
//console.log(schema);

const subscribe = {
  username: "Nicoclock",
  password: "12345678",
  age: 23,
  email: "nico@oclock.io",
};

//quand tout va bien, on reçoit un object qui a une prop value qui contient nos data
//ça sert pas à grand-chose là ... bah non, tout va bien ! C'est quand ça foire que ça devien intéressant
const { error } = schema.validate(subscribe);
console.log("Data valides ?", !error);

if (error) {
  console.log(error.message);
}
