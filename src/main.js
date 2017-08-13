import { seedGen } from "./utils"

export class Flash {
  state = {}

  initialize(maxAmountOfTransactions, depositAmount, settlementAddress, securityLevel) {
    this.state = generateState(depositAmount, settlementAddress, securityLevel)
  }

  join() {

  }

  static generateState(depositAmount, settlementAddress, securityLevel) {
    var myseed = seedGen(81)
    return {
      mySeed,
      publicLedger: {
        remainderAddress: iota.multisig.getDigest(myseed, 0, securityLevel)
        depositAmount: depositAmount
        addressIndex: 1,
        stakes: [],
        balances: [],
        settlementAddresses: [settlementAddress],
        securityLevels: [securityLevel],
      }
    }
  }
}
