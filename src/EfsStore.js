const fs = require("fs");

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
    var zipPipe = new Promise((resolve, reject) => {
      fs.createReadStream(
        path.join(process.env.EFS_PATH, `${options.session}.zip`)
      )
        .pipe(fs.createWriteStream(options.path))
        .on("error", (err) => reject(err))
        .on("close", () => resolve());
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
