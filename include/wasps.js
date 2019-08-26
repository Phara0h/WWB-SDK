const fasq = require('fasquest');

class Wasps {
  constructor(config) {

    this.config = config;
  }

  get hostUrl() {
    return this.config.getHivePath();
  }

     async WaspList() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `wasp/list`,
            json: true,
        };
        return await fasq.request(options)
    }

     async WaspBoopSnoots() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `wasp/boop/snoots`,
        };
        return await fasq.request(options)
    }

     async WaspHeartbeatPort(port) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `wasp/heartbeat/${port}`,
            json: true,
        };
        return await fasq.request(options)
    }

     async WaspCheckinPort(port) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `wasp/checkin/${port}`,
            json: true,
        };
        return await fasq.request(options)
    }

     async WaspReportinIdFailed(body, id) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `wasp/reportin/${id}/failed`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }

     async WaspReportinId(body, id) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: this.hostUrl + `wasp/reportin/${id}`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }
}
module.exports = Wasps;
