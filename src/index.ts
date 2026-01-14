import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import { BASE_URL, PORT } from "./database/config/config.ts";
import { errorHandlerMiddleware } from "./middleware/error-handler.ts";
import apiRouter from "./routes/index.ts";

const httpLogger = pinoHttp({
  transport: {
    options: {
      colorize: true,
    },
    target: "pino-pretty", // Use pino-pretty for development console output
  },
  useLevel: "info", // Set the desired log level for HTTP requests
});

const app = express();

app.use(helmet());
app.use(httpLogger);
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(BASE_URL, apiRouter);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
