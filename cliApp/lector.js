#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander');
const path = require('path');
const fs = require('fs');
const intrepeter = require('../cliApp/intrepeter');


const content = fs.readFileSync(path.join(__dirname, '../package.json')).toString();

program
  .version(JSON.parse(content).version);


program
  .command('new-mvc')
  .alias('new')
  .description('Create new MVC')
  .option('-f, --frontend [v]', 'define frontend')
  .option('-b, --backend [v]', 'define backend')
  .option('-m, --middleware [v]', 'Protect routes with chinchay middleware and thewall')
  .action((table_name, options) => {
    intrepeter.new(table_name, options);
  });

// program
//   .command('qualify')
//   .alias('q')
//   .description('get all the repositories of a particular organization')
//   .option('-n, --number [n]', 'number of times to simulate')
//   .option('-c, --country [country]', 'country to qualify')
//   .option('-r, --round [round]', 'round from which start to simulate the matches')
//   .option('-p, --position [position]', 'position from to which it has to get to qualify')
//   .option('-m, --mode [mode]', 'mode to select match to pull down')
//   .action(() => {
//     console.log('qualify');
//   });
//
// program
//     .command('simulate')
//     .alias('s')
//     .description('get all the repositories of a particular organization')
//     .option('-n, --number [n]', 'number of times to simulate')
//     .option('-r, --round [round]', 'round from which start to simulate the matches')
//     .action(() => {
//     });


program
  .on('--help', () => {
    console.log('  For help visit https://afontainec.github.io/chinchay/');
  });

program
  .command('*')
  .action((env) => {
    console.log('Command does not exists "%s"', env);
  });

program.parse(process.argv);
