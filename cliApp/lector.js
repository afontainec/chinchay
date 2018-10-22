#!/usr/bin/env node

const program = require('commander');
const intrepeter = require('../cliApp/intrepeter');

program
  .version('0.0.1');


program
  .command('new-mvc')
  .alias('new')
  .description('Create new MVC')
  .option('-v, --view [v]', 'include a view elemet')
  .action((table_name, options) => {
    intrepeter.new(table_name, options);
  });

program
  .command('qualify')
  .alias('q')
  .description('get all the repositories of a particular organization')
  .option('-n, --number [n]', 'number of times to simulate')
  .option('-c, --country [country]', 'country to qualify')
  .option('-r, --round [round]', 'round from which start to simulate the matches')
  .option('-p, --position [position]', 'position from to which it has to get to qualify')
  .option('-m, --mode [mode]', 'mode to select match to pull down')
  .action((options) => {
    console.log('qualify');
  });

program
    .command('simulate')
    .alias('s')
    .description('get all the repositories of a particular organization')
    .option('-n, --number [n]', 'number of times to simulate')
    .option('-r, --round [round]', 'round from which start to simulate the matches')
    .action((options) => {
      interpreter.simulate(options.number, options.round);
    });


program
  .on('--help', () => {
    console.log('  For the RF requested:');
    console.log();
    console.log(' RF2:');
    console.log('    $ saffie repositories github -o rails');
    console.log(' RF3:');
    console.log('    $ saffie has-repository github -o rails');
    console.log('    $ saffie last-commits github -o github');
    console.log();
  });

program
  .command('*')
  .action((env) => {
    console.log('Command does not exists "%s"', env);
  });

program.parse(process.argv);
