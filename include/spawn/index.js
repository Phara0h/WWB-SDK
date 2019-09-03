const Aws = require('./aws');
const DigitalOcean = require('./digitalocean');
const Local = require('./local');


module.exports = function (config)
{
  return {
    Aws: new Aws(config),
    DigitalOcean: new DigitalOcean(config),
    Local: new Local(config)
  }
};
