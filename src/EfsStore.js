const fs = require("fs");
const path = require("path");
const { Parse } = require("unzipper");

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
    console.log("Saving session");
    await new Promise((resolve, reject) => {
      try {
        fs.createReadStream(
          path
            .join(process.env.EFS_PATH, `${options.session}.zip`)
            .replace(/\\/g, "/")
        )
          .pipe(fs.createWriteStream(process.env.DATA_PATH))
          .on("error", (err) => reject(err))
          .on("close", () => resolve());
      } catch {
        reject();
      }
    });
  }

  async extract(options) {
    console.log("Extracting session");
    const stream = createReadStream(
      path
        .join(process.env.EFS_PATH, `${options.session}.zip`)
        .replace(/\\/g, "/")
    ).pipe(Parse());

    return new Promise((resolve, reject) => {
      stream.on("entry", (entry) => {
        const writeStream = createWriteStream(process.env.DATA_PATH);
        return entry.pipe(writeStream);
      });
      stream.on("finish", () => resolve());
      stream.on("error", (error) => reject(error));
    });
  }

  async delete(options) {
    fs.rmSync(
      path
        .join(process.env.EFS_PATH, `${options.session}.zip`)
        .replace(/\\/g, "/")
    );
  }
}

module.exports = EfsStore;
