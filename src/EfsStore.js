const fs = require("fs");

class EfsStore {
  constructor() {
    const _cpOptions = {
      recursive: true,
      overwrite: true,
    };
  }

  async sessionExists(options) {
    let hasExistingSession = await fs.existsSync(
      `${process.env.EFS_PATH}/session-${options.session}`
    );
    if (!hasExistingSession) {
      fs.mkdirSync(`${process.env.EFS_PATH}/session-${options.session}`);
    }
    return !!hasExistingSession;
  }

  async save(options) {
    fs.cpSync(
      `${process.env.DATA_PATH || "/tmp/session"}`,
      `${process.env.EFS_PATH}/session-${options.session}`,
      _cpOptions
    );
  }

  async extract(options) {
    fs.cpSync(
      `${process.env.EFS_PATH}/session-${options.session}`,
      `${process.env.DATA_PATH || "/tmp/session"}`,
      _cpOptions
    );
  }

  async delete(options) {
    fs.rmdirSync(`${process.env.EFS_PATH}/session-${options.session}`, {
      recursive: true,
    });
  }
}

module.exports = EfsStore;
