import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Messenger API",
    description: "Auto-generated API documentation",
  },
  host: "localhost:5000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/*.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
