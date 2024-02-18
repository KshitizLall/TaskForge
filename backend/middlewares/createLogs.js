const fs = require("fs").promises;
const path = require("path");
const moment = require("moment-timezone");

async function logRequestResponse(req, res, next) {
  try {
    const currentTimeIST = moment().tz("Asia/Kolkata");
    const currentTimeUSA = currentTimeIST.clone().tz("America/New_York");
    const timestampIST = currentTimeIST.format("YYYY-MM-DD HH:mm:ss");
    const timestampUSA = currentTimeUSA.format("YYYY-MM-DD HH:mm:ss");

    const logDirectory = path.join(__dirname, "../logs/");
    await fs.mkdir(logDirectory, { recursive: true });

    const indianLogFile = path.join(logDirectory, "log_indian_time.txt");
    const usaLogFile = path.join(logDirectory, "log_usa_time.txt");

    await fs.appendFile(
      indianLogFile,
      `\n${timestampIST}: ${req.ip}: ${req.method}: ${req.path}`
    );
    await fs.appendFile(
      usaLogFile,
      `\n${timestampUSA}: ${req.ip}: ${req.method}: ${req.path}`
    );

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { logRequestResponse };
