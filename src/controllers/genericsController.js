const models = require("../models");

/*-------------------------------convert Param To ModelName method ---------------------*/
const convertParamToModelName = (param) => {
  const modelName = param.charAt(0).toUpperCase() + param.slice(1, -1);
  return modelName;
};
/*---------------------------------get all Item----------------------------------------*/
const genericController = {
  async getAllItems(request, response, next) {
    console.log(request.params); // "/api/:modelName"
    console.log(request.params["modelName"]);

    const modelName = convertParamToModelName(request.params["modelName"]);
    console.log(modelName);

    console.log(models); //const models = require("../models")
    console.log(models[modelName]);

    try {
      if (!models[modelName]) {
        response.send(
          `Error, l'element au nom ${request.params["modelName"]} n'existe pas`
        );
        next();
        return;
      }
      const items = await models[modelName].findAll();
      response.send(items);
    } catch (error) {
      console.trace(error);
      response.status(500).json(error.errors || "error");
    }
  },
};
