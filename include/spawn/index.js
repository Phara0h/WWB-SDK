const Aws = require('./aws');
const Local = require('./local');


module.exports = function (config)
{
  return {
    Aws: new Aws(config),
    Local: new Local(config)
  }
};
