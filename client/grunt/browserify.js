var _ = require('lodash');

var options = {
  browserifyOptions: {
    debug: true
  },
  transform: [
    [ 'babelify'/*, { 'stage': 2 }*/ ],
    [ "hbsfy", { "extensions": [ "hbs" ] } ],
  ],
};

module.exports = {
  app: {
    options: options,
    files: {
      'dist/<%= pkg.name %>.js': ['src/index.js'],
    }
  }
};
