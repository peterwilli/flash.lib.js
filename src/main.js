import { stateInitializeAddresses } from 'helpers/state'

export class Flash {
  state = {}

  initialize(seed, depth, depositAmount, settlementAddress, securityLevel) {
    this.state = Flash.generateState(seed, depth, depositAmount, settlementAddress, securityLevel)
  }

  stateIsInitialized() {
    return this.state.publicLedger.remainderAddress !== null
  }

  join(name, digest) {
    if(!this.stateIsInitialized()) {
      addressesToCosign
    }
  }

  static generateState(seed, depth, depositAmount, settlementAddress, securityLevel) {
    var state = {
      publicLedger: {
        depth,
        addressesToCosign: [],
        remainderAddress: null,
        depositAmount: depositAmount,
        addressIndex: 0,
        stakes: [],
        balances: [],
        settlementAddresses: [settlementAddress],
        securityLevels: [securityLevel],
      }
    }
    stateInitializeAddresses(seed, depth, state)
    return state
  }
}
