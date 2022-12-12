const fs = require("fs");

class EfsStore {
  constructor() {
    const _dir = `${process.env.EFS_PATH}/session-${options.session}`;
    const _cpOptions = {
      recursive: true,
      overwrite: true,
    };
  }

  async sessionExists(options) {
    let hasExistingSession = await fs.existsSync(_dir);
    if (!hasExistingSession) {
      fs.mkdirSync(_dir);
    }
    return !!hasExistingSession;
  }

  async save(options) {
    fs.cpSync(`${process.env.DATA_PATH || "/tmp/session"}`, _dir, _cpOptions);
  }

  async extract(options) {
    fs.cpSync(_dir, `${process.env.DATA_PATH || "/tmp/session"}`, _cpOptions);
  }

  async delete(options) {
    fs.rmdirSync(`${process.env.EFS_PATH}/session-${options.session}`, {
      recursive: true,
    });
  }
}

module.exports = EfsStore;
