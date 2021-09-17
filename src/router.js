const pageNotFound = require("./src/middlewares/pageNotFound_404");
const express = require("express");
const router = express.Router();

// require de controllers

// En dernièrre ressort, la page 404 (Page not found)
router.use(pageNotFound);
