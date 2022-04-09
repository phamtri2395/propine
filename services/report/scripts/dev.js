// eslint-disable-next-line
const concurrently = require('concurrently');

concurrently([
  {
    command: 'nodemon',
    name: 'Compile',
    prefixColor: 'green.dim',
  },
  {
    command: 'serverless offline start',
    name: 'Serverless',
    prefixColor: 'yellow.dim',
  },
]);
