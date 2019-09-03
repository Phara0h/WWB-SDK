const fasq = require('fasquest');

class Hive {
  constructor(config) {

    this.config = config;
  }

  get hostUrl() {
    return this.config.getHivePath();
  }

     WaitForComplete() {
       return new Promise((resolve,reject)=>{
         var int = setInterval(async ()=>{
           try {
             var res = await this.HiveStatusDone();
             if(res.statusCode == 200) {
               resolve(true);
               clearInterval(int);
             }
           } catch (e) {}
        },500)
       })
     }
     async HiveStatusDone() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `hive/status/done`,
            json: true,
        };
        return fasq.request(options)
    }

     async HiveStatusReportField(field) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `hive/status/report/${field}`,
            json: true,
        };
        return fasq.request(options)
    }

     async HiveStatusReport() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `hive/status/report`,
            json: true,
        };
        return fasq.request(options)
    }

     async HiveStatus() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `hive/status`,
            json: true,
        };

        return fasq.request(options)
    }

     async HiveSpawnLocalAmount(amount) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `hive/spawn/local/${amount}`,
        };
        return fasq.request(options)
    }

     async HiveTorchLocal() {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `hive/torch`,
            json: true,
        };
        return fasq.request(options)
    }

     async HiveTorch() {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `hive/torch`,
        };
        return fasq.request(options)
    }

     async HivePoke(body) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `hive/poke`,
            body,
            json: true,
        };
        return fasq.request(options)
    }
}

module.exports = Hive;
