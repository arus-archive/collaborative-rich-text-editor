import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "production";
const LOG_PATH = process.env.LOG_PATH || path.join(__dirname, "..", "..", "..", "log");

const PORT = process.env.PORT || 3000;
const STATIC_PATH = process.env.STATIC_PATH || path.join(__dirname, "../../");
// const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/collaborative-rich-text-editor-db?auto_reconnect=true`;


const CONFIG = {
  LOG_PATH,
  // MONGODB_URI,
  NODE_ENV,
  PORT,
  STATIC_PATH,
};

export default CONFIG;
