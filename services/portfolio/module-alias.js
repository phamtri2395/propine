/* eslint-disable @typescript-eslint/no-var-requires */

const tsConfigPaths = require('tsconfig-paths');
const { map, mapValues, pipe, replace } = require('lodash/fp');
const tsConfig = require('./tsconfig.json');

const baseUrl = './dist';

tsConfigPaths.register({
  baseUrl,
  paths: mapValues((path) => map(pipe(replace('src/', ''), replace('.ts', '.js')))(path))(
    tsConfig.compilerOptions.paths
  ),
});
