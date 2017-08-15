(function webpackUniversalModuleDefinition(root, factory) {
   //Test Comment
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
   //Test Comment
	else if(typeof define === 'function' && define.amd)
		define([], factory);
   //Test Comment
	else if(typeof exports === 'object')
		exports["flash.lib"] = factory();
   //Test Comment
	else
		root["flash.lib"] = factory();
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  commandSeparator: '|'
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Flash = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _state = __webpack_require__(2);

var _command = __webpack_require__(3);

var _command2 = _interopRequireDefault(_command);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Flash = exports.Flash = function () {
  function Flash(iota, name) {
    _classCallCheck(this, Flash);

    Object.assign(this, { iota: iota, name: name });
  }

  _createClass(Flash, [{
    key: 'initialize',
    value: function initialize(seed, depth, depositAmount, settlementAddress, securityLevel) {
      var state = {
        pending: {
          addressesToCosign: {}
        },
        users: {},
        publicLedger: {
          depth: depth,
          remainderAddress: null,
          depositAmount: depositAmount,
          addressIndex: 0
        }

        // Add the first user
      };state.users[this.name] = {
        index: 0,
        balance: 0,
        stake: 0,
        settlementAddress: settlementAddress,
        securityLevel: securityLevel

        // + 1 for remainderAddress
      };state.pending.addressesToCosign[this.name] = (0, _state.generateAddressDigests)(this.iota, seed, depth + 1, 0, securityLevel);

      // TODO: create a custom serialization function instead of JSON.stringify.
      return new _command2.default(this, state, 'initialize', JSON.stringify(state));
    }
  }, {
    key: 'stateIsInitialized',
    value: function stateIsInitialized() {
      return this.state.publicLedger.remainderAddress !== null;
    }
  }, {
    key: 'executeCommand',
    value: function executeCommand(serialData) {
      var firstSepIndex = serialData.indexOf(_constants2.default.commandSeparator);
      var command = serialData.substring(0, firstSepIndex);
      var args = serialData.substring(firstSepIndex + 1, serialData.length).split(_constants2.default.commandSeparator);

      console.log('command: \'' + command + '\'');

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
  }, {
    key: 'finalizeAddresses',
    value: function finalizeAddresses() {
      // First find the order finalization
      var addressesToCosign = this.state.pending.addressesToCosign;
      var users = this.state.users;
      var namesArr = Object.keys(users);
      namesArr.sort(function (a, b) {
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
      var digestsPerUser = namesArr.map(function (name) {
        return addressesToCosign[name];
      });
      var iota = this.iota;
      var addresses = addressesToCosign[this.name].map(function (_, i) {
        var digestsForIndex = digestsPerUser.map(function (digests) {
          return digests[i];
        });
        return (0, _state.finalizeAddress)(iota, digestsForIndex);
      });
      return new _command2.default(this, this.state, 'newAddresses', addresses.join(","));
    }
  }, {
    key: 'join',
    value: function join(seed, settlementAddress, securityLevel) {
      if (this.stateIsInitialized()) {
        throw new Error("You can't add new users to an initialized channel. Please withdraw the funds and create a new channel if you want to add more users.");
      } else {
        if (name in this.state.users) {
          throw new Error('User ' + name + ' already exists. Please choose a different name.');
        }
        if (Object.keys(this.state.pending.addressesToCosign).length > 0) {
          var newUser = {
            index: Object.keys(this.state.users).length,
            balance: 0,
            stake: 0,
            settlementAddress: settlementAddress,
            securityLevel: securityLevel
          };
          var addressesToCosign = (0, _state.generateAddressDigests)(this.iota, seed, this.state.publicLedger.depth + 1, 0, securityLevel);
          return new _command2.default(this, this.state, 'join', this.name, JSON.stringify(newUser), JSON.stringify(addressesToCosign));
        } else {
          throw new Error("You can't join a channel with an empty addressesToCosign. Please create an initial channel first.");
        }
      }
    }
  }]);

  return Flash;
}();

window.Flash = Flash;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var generateAddressDigests = exports.generateAddressDigests = function generateAddressDigests(iota, seed, amount, index, securityLevel) {
  var addressesToCosign = Object.assign([], Array(amount).fill().map(function (_, i) {
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

var finalizeAddress = exports.finalizeAddress = function finalizeAddress(iota, digests) {
  // Multisig address class
  var Address = iota.multisig.address;
  var finalAddress = new Address();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = digests[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var digest = _step.value;

      finalAddress.absorb(digest.trytes);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  finalAddress = finalAddress.finalize();
  return finalAddress;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Command = function () {
  function Command(flash, returnValue, command) {
    _classCallCheck(this, Command);

    this.command = command;
    this.flash = flash;

    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    this.args = args;
    this.returnValue = returnValue;
    Command.validateCommand([command].concat(args));
  }

  _createClass(Command, [{
    key: "toSerial",
    value: function toSerial() {
      return [this.command].concat(this.args).join(_constants2.default.commandSeparator);
    }
  }, {
    key: "executeSelf",
    value: function executeSelf() {
      this.flash.executeCommand(this.toSerial());
      return this;
    }
  }], [{
    key: "validateCommand",
    value: function validateCommand(cmd) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = cmd[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var arg = _step.value;

          if (arg.indexOf("|") > -1) {
            throw new Error("You cannot have a '" + _constants2.default.commandSeparator + "' in commands. Please remove '" + _constants2.default.commandSeparator + "' from the following command argument: " + arg);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return Command;
}();

exports.default = Command;

/***/ })
/******/ ]);
});