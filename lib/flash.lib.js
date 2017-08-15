(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
  commandSeparator: '|'
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_state__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_command__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__constants__);




class Flash {
  constructor(iota, name) {
    Object.assign(this, { iota, name });
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

      // Add the first user
    };state.users[this.name] = {
      index: 0,
      balance: 0,
      stake: 0,
      settlementAddress,
      securityLevel

      // + 1 for remainderAddress
    };state.pending.addressesToCosign[this.name] = Object(__WEBPACK_IMPORTED_MODULE_0__helpers_state__["b" /* generateAddressDigests */])(this.iota, seed, depth + 1, 0, securityLevel);

    // TODO: create a custom serialization function instead of JSON.stringify.
    return new __WEBPACK_IMPORTED_MODULE_1__helpers_command__["a" /* default */](this, state, 'initialize', JSON.stringify(state));
  }

  stateIsInitialized() {
    return this.state.publicLedger.remainderAddress !== null;
  }

  executeCommand(serialData) {
    var firstSepIndex = serialData.indexOf(__WEBPACK_IMPORTED_MODULE_2__constants___default.a.commandSeparator);
    var command = serialData.substring(0, firstSepIndex);
    var args = serialData.substring(firstSepIndex + 1, serialData.length).split(__WEBPACK_IMPORTED_MODULE_2__constants___default.a.commandSeparator);

    console.log(`command: '${command}'`);

    switch (command) {
      case 'initialize':
        this.state = JSON.parse(args[0]);
        break;

      case 'join':
        var name = args[0];
        var newUser = JSON.parse(args[1]);
        var addressesToCosignForNewUser = JSON.parse(args[2]);
        this.state.pending.addressesToCosign[name] = addressesToCosignForNewUser;
        this.state.users[name] = newUser;
        console.log(this.state);
        break;
    }
  }

  finalizeAddresses() {
    // First find the order finalization
    var addressesToCosign = this.state.pending.addressesToCosign;
    var users = this.state.users;
    var namesArr = Object.keys(users);
    namesArr.sort((a, b) => {
      return users[a].index - users[b].index;
    });

    var masterLength = addressesToCosign[this.name].length;
    for (var i = 0; i < namesArr.length; i++) {
      if (i > 0) {
        // We check the length of all other user's digests to the master user
        if (addressesToCosign[namesArr[i]].length !== masterLength) {
          throw new Error("Different users have different lengths of digests to sign. Make sure you synchronized the addresses correctly.");
        }
      }
    }

    // TODO: Validate index of each address
    var digestsPerUser = namesArr.map(name => {
      return addressesToCosign[name];
    });
    var iota = this.iota;
    var addresses = addressesToCosign[this.name].map((_, i) => {
      var digestsForIndex = digestsPerUser.map(digests => {
        return digests[i];
      });
      return Object(__WEBPACK_IMPORTED_MODULE_0__helpers_state__["a" /* finalizeAddress */])(iota, digestsForIndex);
    });
    return new __WEBPACK_IMPORTED_MODULE_1__helpers_command__["a" /* default */](this, this.state, 'newAddresses', addresses.join(","));
  }

  join(seed, settlementAddress, securityLevel) {
    if (this.stateIsInitialized()) {
      throw new Error("You can't add new users to an initialized channel. Please withdraw the funds and create a new channel if you want to add more users.");
    } else {
      if (name in this.state.users) {
        throw new Error(`User ${name} already exists. Please choose a different name.`);
      }
      if (Object.keys(this.state.pending.addressesToCosign).length > 0) {
        var newUser = {
          index: Object.keys(this.state.users).length,
          balance: 0,
          stake: 0,
          settlementAddress,
          securityLevel
        };
        var addressesToCosign = Object(__WEBPACK_IMPORTED_MODULE_0__helpers_state__["b" /* generateAddressDigests */])(this.iota, seed, this.state.publicLedger.depth + 1, 0, securityLevel);
        return new __WEBPACK_IMPORTED_MODULE_1__helpers_command__["a" /* default */](this, this.state, 'join', this.name, JSON.stringify(newUser), JSON.stringify(addressesToCosign));
      } else {
        throw new Error("You can't join a channel with an empty addressesToCosign. Please create an initial channel first.");
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["Flash"] = Flash;


window.Flash = Flash; // Ugly but webpack libray definition is currently not linking to window for browsers (see: https://stackoverflow.com/questions/34736771/webpack-umd-library-return-object-default)

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const generateAddressDigests = (iota, seed, amount, index, securityLevel) => {
  var addressesToCosign = Object.assign([], Array(amount).fill().map((_, i) => {
    var obj = {
      depth: i,
      index: index,
      trytes: iota.multisig.getDigest(seed, index, securityLevel)
    };
    index++;
    return obj;
  }));
  return addressesToCosign;
};
/* harmony export (immutable) */ __webpack_exports__["b"] = generateAddressDigests;


const finalizeAddress = (iota, digests) => {
  // Multisig address class
  var Address = iota.multisig.address;
  var finalAddress = new Address();
  for (var digest of digests) {
    finalAddress.absorb(digest.trytes);
  }
  finalAddress = finalAddress.finalize();
  return finalAddress;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = finalizeAddress;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__constants__);


class Command {
  constructor(flash, returnValue, command, ...args) {
    this.command = command;
    this.flash = flash;
    this.args = args;
    this.returnValue = returnValue;
    Command.validateCommand([command].concat(args));
  }

  toSerial() {
    return [this.command].concat(this.args).join(__WEBPACK_IMPORTED_MODULE_0__constants___default.a.commandSeparator);
  }

  executeSelf() {
    this.flash.executeCommand(this.toSerial());
    return this;
  }

  static validateCommand(cmd) {
    for (var arg of cmd) {
      if (arg.indexOf("|") > -1) {
        throw new Error(`You cannot have a '${__WEBPACK_IMPORTED_MODULE_0__constants___default.a.commandSeparator}' in commands. Please remove '${__WEBPACK_IMPORTED_MODULE_0__constants___default.a.commandSeparator}' from the following command argument: ${arg}`);
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Command;


/***/ })
/******/ ]);
});
//# sourceMappingURL=flash.lib.js.map