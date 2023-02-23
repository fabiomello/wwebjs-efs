const fs = require("fs");
const path = require("path");
const decompress = require("decompress");
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
      fs.createReadStream(`${options.session}.zip`)
        .pipe(
          fs.createWriteStream(
            path.join(process.env.EFS_PATH, `${options.session}.zip`)
          )
        )
        .on("error", (err) => reject(err))
        .on("close", () => resolve());
    });
  }

  async extract(options) {
    console.log("Extracting session");
    var zipPipe = new Promise((resolve, reject) => {
      try {
        decompress(`${options.session}.zip`, process.env.EFS_PATH).then(() => {
          resolve();
        });
      } catch {
        reject();
      }
    });
    return zipPipe;
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
