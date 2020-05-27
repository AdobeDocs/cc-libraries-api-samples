const fs = require("fs").promises;

const writeLog = async (error) => {
  const filename = Date.now() + ".json";

  let content;
  if (error.toJSON) {
    content = error.toJSON();
  } else if (error.stack) {
    content = { stack: error.stack };
  } else {
    content = { message: error };
  }

  try {
    await fs.mkdir("logs");
  } catch (error) {
    console.log("Unable to write error log file", error);
  }

  try {
    await fs.writeFile(`logs/${filename}`, JSON.stringify(content));
  } catch (error) {
    console.log("Unable to write error log file", error);
  }
};

module.exports = { writeLog };
