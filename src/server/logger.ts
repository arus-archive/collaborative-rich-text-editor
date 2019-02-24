import * as fs from "fs";
import * as path from "path";
import * as winston from "winston";

import CONFIG from "./config";

if (!fs.existsSync(CONFIG.LOG_PATH)) {
  fs.mkdirSync(CONFIG.LOG_PATH);
}

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File(
      {
        filename: path.join(CONFIG.LOG_PATH, "error.log"),
        level: "error",
      },
    ),
    new winston.transports.File(
      {
        filename: path.join(CONFIG.LOG_PATH, "combined.log"),
      },
    ),
  ],
});

if (CONFIG.NODE_ENV === "development") {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
