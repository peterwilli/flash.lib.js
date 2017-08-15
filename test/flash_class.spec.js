import chai from 'chai';
import Flash from '../lib/flash.lib.js';
import IOTA from 'iota.lib.js'
chai.expect();

const expect = chai.expect;

var iota = new IOTA({
  provider: "http://52.58.212.188:14700"
})
describe('Given an instance of the Flash-class', function() {
  // Crypto can take long...
  this.timeout(20000)

  var flash1
  before(() => {
    flash1 = new Flash(iota, 'Peter')
  });

  it('initialization should return a Command-class', () => {
    var seed1 = "ABCDEF"
    var initializeCmd = flash1.initialize(seed1, 5, 100, "SETTLEMENT99", 2)
    expect(initializeCmd).to.have.property('toSerial')
    describe('when doing executeSelf on initialize command', () => {
      it('should still return a command', () => {
        var executedSelf = initializeCmd.executeSelf()
        expect(executedSelf).to.have.property('toSerial')
        describe('when requesting stateIsInitialized in a new class', () => {
          it('should return false', () => {
            expect(flash1.stateIsInitialized()).to.be.equal(false);
          });
        });
      })
    })
  });
});
