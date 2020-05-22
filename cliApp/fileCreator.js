const fs = require('fs');
const path = require('path');
const {
  promisify,
} = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class fileCreator {

  constructor(samplePath, directory, filename) {
    this.samplePath = samplePath;
    this.directory = directory;
    this.filePath = path.join(directory, filename);
  }

  getSample() {
    return readFile(this.samplePath, 'utf8');
  }

  create(values, rewrite) {
    const f = async () => {
      const string = await this.getSample();
      const file = fileCreator.compileString(string, values);
      await this.makeFile(file, this.filePath, rewrite);
    };
    return f();
  }

  makeFile(file, filePath, rewrite) {
    if (!fs.existsSync(this.directory)) {
      fileCreator.mkDirByPathSync(this.directory);
    }
    if (!rewrite && fs.existsSync(filePath)) {
      return console.log(`ERROR: file: ${filePath} already exists.`); // eslint-disable-line no-console
    }
    return writeFile(filePath, file);
  }

  static mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
    const { sep } = path;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';

    return targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir);
      try {
        fs.mkdirSync(curDir);
      } catch (err) {
        if (err.code === 'EEXIST') { // curDir already exists!
          return curDir;
        }

        // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
        if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
          throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
        }

        const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
        if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) { //eslint-disable-line
          throw err; // Throw if it's just the last created dir.
        }
      }

      return curDir;
    }, initDir);
  }

  static compileString(string, values) {
    const keys = Object.keys(values);
    for (let i = 0; i < keys.length; i++) {
      const inTextKey = '\\$' + keys[i] + '\\$'; // eslint-disable-line
      const search = new RegExp(inTextKey, 'g');
      string = string.replace(search, values[keys[i]]);
    }
    return string;
  }
}


module.exports = fileCreator;
