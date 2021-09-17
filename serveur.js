const server = require("./src/index");
//import start from "./src/index";
require("dotenv").config();

const PORT = process.env.PORT || 3300;

server.start(PORT);
