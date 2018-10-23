const path = require('path');
const fs = require('fs');

const {
  promisify,
} = require('util');
const config = require('../.chainfile');

const samplePath = path.join(__dirname, '../', 'example', 'controller.js');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class iCreate {
  constructor(samplePath) {
    this.samplePath = samplePath;
  }

  getSample() {
    return readFile(samplePath, 'utf8');
  }

  createFile(values) {
    const f = async () => {
      const string = await this.getSample();
      const file = this.compileString(string, values);
      const filepath = this.filePath();
      await this.makeFile(file, filepath);
    };
    return f();
  }

  makeFile(file, filePath) {
    return await writeFile(filePath, file);
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


module.exports = iCreate;
