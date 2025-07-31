import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next.js API Documentation",
      version: "1.0.0",
      description: "Swagger API documentation for My Project",
    },
    servers: [{ url: "https://saas-nextjs-int.vercel.app" }],
  },
  apis: [path.join(process.cwd(), "app/api/**/*.ts")],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
