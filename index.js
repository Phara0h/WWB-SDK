const Config = require('./include/config');
const Hive = require('./include/hive');
const Wasp = require('./include/wasp');


class SDK {
    constructor(config) {
       this.config = new Config(config);
       this.Hive = new Hive(this.config);
       this.Wasp = new Wasp(this.config);
       this.Spawn = require('./include/spawn')(this.config);
    }
}

module.exports = SDK;
