const fs = require("fs");
const path = require("path");

class EfsStore {
  constructor() {}

  async sessionExists(options) {
    let hasExistingSession = await fs.existsSync(
      path
        .join(process.env.EFS_PATH, `${options.session}.zip`)
        .replace(/\\/g, "/")
    );
    return !!hasExistingSession;
  }

  async save(options) {
    try {
      await new Promise((resolve, reject) => {
        fs.createReadStream(`${options.session}.zip`)
          .pipe(
            fs.createWriteStream(
              path.join(process.env.EFS_PATH, `${options.session}.zip`)
            )
          )
          .on("error", (err) => reject(err))
          .on("close", () => resolve());
      });
    } catch (err) {
      console.log("Error saving zip", err);
    }
  }

  async extract(options) {
    try {
      return new Promise((resolve, reject) => {
        fs.createReadStream(
          path.join(process.env.EFS_PATH, `${options.session}.zip`)
        )
          .pipe(fs.createWriteStream(options.path))
          .on("error", (err) => reject(err))
          .on("close", () => resolve());
      });
    } catch (err) {
      console.log("Error extracting zip", err);
      return undefined;
    }
  }

  async delete(options) {
    fs.rmSync(path.join(process.env.EFS_PATH, `${options.session}.zip`));
  }
}

module.exports = EfsStore;
