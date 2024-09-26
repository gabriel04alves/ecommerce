import express, { Express } from "express";
import cors from "cors";
import { PORT } from "./config/secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

const app: Express = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          postalCode: true,
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}, ${addr.postalCode}`;
        },
      },
    },
  },
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`View the DB at http://localhost:5555/`);
});
