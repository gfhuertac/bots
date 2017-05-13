// local libraries
const sh = require('../messenger_iotbot/smart_home');

// 3rd part libraries

// Global variables

// the front door testing
describe("Front door", function() {
  this.timeout(0);

  before(function(done) {
    sh.sh_init(done);
  });

  it("opens the front door", function(done) {
    sh.fd_open(function(err) {
      done(err);
    });
  });
});
