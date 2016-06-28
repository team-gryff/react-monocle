

const program = require('commander');

program.arguments('<file>')
  .option('-u, --username <username>' , 'The user to authenticate as')
  .option('-p, --password <password>', 'The user\'s password')
  .action(function(file){
    console.log(program);
    console.log(file);
    console.log('%s');
    console.log('%s');
    
  })
  .parse(process.argv);


