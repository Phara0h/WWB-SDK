const fasq = require('fasquest');

class Wasp {
  constructor(config) {

    this.config = config;
  }


    //  async Boop() {
    //     var options = {
    //         method: 'GET',
    //         resolveWithFullResponse: true,
    //         simple: false,
    //         uri: hostUrl + "/" + `boop`,
    //     };
    //     return await fasq.request(options)
    // }
    //
    //  async Die() {
    //     var options = {
    //         method: 'DELETE',
    //         resolveWithFullResponse: true,
    //         simple: false,
    //         uri: hostUrl + "/" + `die`,
    //     };
    //     return await fasq.request(options)
    // }
    //
    //  async Fire(body) {
    //     var options = {
    //         method: 'PUT',
    //         resolveWithFullResponse: true,
    //         simple: false,
    //         uri: hostUrl + "/" + `fire`,
    //         body,
    //         json: true,
    //     };
    //     return await fasq.request(options)
    // }
}
module.exports = Wasp;
