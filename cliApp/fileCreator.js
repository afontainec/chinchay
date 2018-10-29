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

  create(values) {
    const f = async () => {
      const string = await this.getSample();
      const file = this.compileString(string, values);
      await this.makeFile(file, this.filePath);
    };
    return f();
  }

  makeFile(file, filePath) {
    if (!fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory);
    }
    return writeFile(filePath, file);
  }

  compileString(string, values) {
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
