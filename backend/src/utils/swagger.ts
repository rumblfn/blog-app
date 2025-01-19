import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const swaggerDocument = YAML.load(path.join(__dirname, "../../swagger.yaml"));

export const setupSwagger = (app: Express) => {
  const options = {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  app.use("/api/docs", swaggerUi.serve);
  app.get("/api/docs", swaggerUi.setup(swaggerDocument, options));
};
