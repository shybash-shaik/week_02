import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFile = path.join(__dirname, "../logs/app.log");

const logger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const log = {
      method: req.method,
      url: req.originalUrl,
      time: new Date().toISOString(),
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
    };
    fs.appendFileSync(logFile, JSON.stringify(log) + "\n");
  });

  next();
};

export default logger;
