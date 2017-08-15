import {generateAddressDigests, finalizeAddress} from './helpers/state'
import Command from './helpers/command'
import constants from './constants'

export class Flash {
  constructor(iota, name) {
    Object.assign(this, { iota, name })
  }

  initialize(seed, depth, depositAmount, settlementAddress, securityLevel) {
    var state = {
      pending: {
        addressesToCosign: {}
      },
      users: {},
      publicLedger: {
        depth,
        remainderAddress: null,
        depositAmount: depositAmount,
        addressIndex: 0
      }
    }

    // Add the first user
    state.users[this.name] = {
      index: 0,
      balance: 0,
      stake: 0,
      settlementAddress,
      securityLevel
    }

    // + 1 for remainderAddress
    state.pending.addressesToCosign[this.name] = generateAddressDigests(this.iota, seed, depth + 1, 0, securityLevel)

    // TODO: create a custom serialization function instead of JSON.stringify.
    return new Command(this, state, 'initialize', JSON.stringify(state))
  }

  stateIsInitialized() {
    return this.state.publicLedger.remainderAddress !== null
  }

  executeCommand(serialData) {
    var firstSepIndex = serialData.indexOf(constants.commandSeparator)
    var command = serialData.substring(0, firstSepIndex)
    var args = serialData.substring(firstSepIndex + 1, serialData.length).split(constants.commandSeparator)

    console.log(`command: '${command}'`);

    switch (command) {
      case 'initialize':
        this.state = JSON.parse(args[0])
        break

      case 'join':
        var name = args[0]
        var newUser = JSON.parse(args[1])
        var addressesToCosignForNewUser = JSON.parse(args[2])
        this.state.pending.addressesToCosign[name] = addressesToCosignForNewUser
        this.state.users[name] = newUser
        console.log(this.state);
        break
    }
  }

  finalizeAddresses() {
    // First find the order finalization
    var addressesToCosign = this.state.pending.addressesToCosign
    var users = this.state.users
    var namesArr = Object.keys(users)
    namesArr.sort((a, b) => {
      return users[a].index - users[b].index
    })

    var masterLength = addressesToCosign[this.name].length
    for(var i = 0; i < namesArr.length; i++) {
      if(i > 0) {
        // We check the length of all other user's digests to the master user
        if(addressesToCosign[namesArr[i]].length !== masterLength) {
          throw new Error("Different users have different lengths of digests to sign. Make sure you synchronized the addresses correctly.")
        }
      }
    }

    // TODO: Validate index of each address
    var digestsPerUser = namesArr.map((name) => {
      return addressesToCosign[name]
    })
    var iota = this.iota
    var addresses = addressesToCosign[this.name].map((_, i) => {
      var digestsForIndex = digestsPerUser.map((digests) => {
        return digests[i]
      })
      return finalizeAddress(iota, digestsForIndex)
    })
    return new Command(this, this.state, 'newAddresses', addresses.join(","))
  }

  join(seed, settlementAddress, securityLevel) {
    if (this.stateIsInitialized()) {
      throw new Error("You can't add new users to an initialized channel. Please withdraw the funds and create a new channel if you want to add more users.")
    } else {
      if (name in this.state.users) {
        throw new Error(`User ${name} already exists. Please choose a different name.`)
      }
      if (Object.keys(this.state.pending.addressesToCosign).length > 0) {
        var newUser = {
          index: Object.keys(this.state.users).length,
          balance: 0,
          stake: 0,
          settlementAddress,
          securityLevel
        }
        var addressesToCosign = generateAddressDigests(this.iota, seed, this.state.publicLedger.depth + 1, 0, securityLevel)
        return new Command(this, this.state, 'join', this.name, JSON.stringify(newUser), JSON.stringify(addressesToCosign))
      } else {
        throw new Error("You can't join a channel with an empty addressesToCosign. Please create an initial channel first.")
      }
    }
  }
}

window.Flash = Flash
