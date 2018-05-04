(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/uuid/lib/bytesToUuid.js":
/*!***********************************************!*\
  !*** ../node_modules/uuid/lib/bytesToUuid.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),

/***/ "../node_modules/uuid/lib/rng-browser.js":
/*!***********************************************!*\
  !*** ../node_modules/uuid/lib/rng-browser.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/uuid/v4.js":
/*!**********************************!*\
  !*** ../node_modules/uuid/v4.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "../node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "../node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ "../node_modules/webpack/buildin/global.js":
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/global.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./experience.js":
/*!***********************!*\
  !*** ./experience.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Experience; });
/**
 * A base object class for an Experience object.
 */
class Experience {
  constructor (description) {
    this.description = description
    this.startTime = undefined
    this.endTime = undefined
    this.details = []
  }

  static readObject (jsonObject) {
    let experience = new Experience(jsonObject.description)
    if (jsonObject.startTime) { experience.startTime = jsonObject.startTime }
    if (jsonObject.endTime) { experience.endTime = jsonObject.endTime }
    for (let detailsItem of jsonObject.details) {
      experience.details.push(Experience.readObject(detailsItem))
    }
    return experience
  }

  attach (experience) {
    this.details.push(experience)
  }

  start () {
    this.startTime = new Date().getTime()
    return this
  }

  complete () {
    this.endTime = new Date().getTime()
    return this
  }

  get duration () {
    return this.endTime - this.startTime
  }

  toString () {
    return `"${this.description}" experience duration is ${this.duration} ms`
  }
}


/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: Experience, Monitor, ObjectMonitor, Transporter, StorageAdapter, TestAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _experience__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./experience */ "./experience.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Experience", function() { return _experience__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _monitor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./monitor */ "./monitor.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Monitor", function() { return _monitor__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _object_monitor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./object-monitor */ "./object-monitor.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ObjectMonitor", function() { return _object_monitor__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _transporter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./transporter */ "./transporter.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Transporter", function() { return _transporter__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _local_storage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./local/storage */ "./local/storage.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StorageAdapter", function() { return _local_storage__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _remote_test_adapter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./remote/test-adapter */ "./remote/test-adapter.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TestAdapter", function() { return _remote_test_adapter__WEBPACK_IMPORTED_MODULE_5__["default"]; });











/***/ }),

/***/ "./local/storage.js":
/*!**************************!*\
  !*** ./local/storage.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LocalStorageAdapter; });
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid/v4 */ "../node_modules/uuid/v4.js");
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_0__);
/* global browser */



/**
 * Represents an adapter for a local storage where experiences are accumulated before a batch of
 * experiences is sent to a remote server and is removed from a local storage.
 * Currently a `browser.storage.local` local storage is used.
 */
class LocalStorageAdapter {
  /**
   * Returns an adapter default values
   * @return {{prefix: string}}
   */
  static get defaults () {
    return {
      // A prefix used to distinguish experience objects from objects of other types
      prefix: 'experience_'
    }
  }

  /**
   * Stores a single experience to the local storage.
   * @param {Experience} experience - An experience object to be saved.
   */
  static write (experience) {
    // Keys of experience objects has an `experience_` prefix to distinguish them from objects of other types.
    let uuid = `${LocalStorageAdapter.defaults.prefix}${uuid_v4__WEBPACK_IMPORTED_MODULE_0___default()()}`

    browser.storage.local.set({[uuid]: experience}).then(
      () => {
        console.log(`Experience has been written to the local storage successfully`)
      },
      (error) => {
        console.error(`Cannot write experience to the local storage because of the following error: ${error}`)
      }
    )
  }

  /**
   * Reads all experiences that are present in a local storage.
   * @return {Promise.<{key: Experience}, Error>} Returns a promise that resolves with an object
   * containing key: value pairs for each experience stored and rejects with an Error object.
   */
  static async readAll () {
    try {
      return await browser.storage.local.get()
    } catch (error) {
      console.error(`Cannot read data from the local storage because of the following error: ${error}`)
      return error
    }
  }

  /**
   * Removes experience objects with specified keys from a local storage.
   * @param {String[]} keys - an array of keys that specifies what Experience objects need to be removed.
   * @return {Promise.<*|{minArgs, maxArgs}>} A Promise that will be fulfilled with no arguments
   * if the operation succeeded. If the operation failed, the promise will be rejected with an error message.
   */
  static async remove (keys) {
    return browser.storage.local.remove(keys)
  }
}


/***/ }),

/***/ "./monitor.js":
/*!********************!*\
  !*** ./monitor.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Monitor; });
/* harmony import */ var _experience__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./experience */ "./experience.js");
/* harmony import */ var _local_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./local/storage */ "./local/storage.js");



class Monitor {
  constructor (monitoringDataList) {
    this.monitored = new Map()
    if (monitoringDataList) {
      for (let monitoringData of monitoringDataList) {
        this.monitored.set(monitoringData.monitoredFunction, monitoringData)
      }
    }
  }

  static track (object, monitoringDataList) {
    return new Proxy(object, new Monitor(monitoringDataList))
  }

  get (target, property, receiver) {
    if (this.monitored.has(property)) {
      let monitoringData = this.monitored.get(property)
      if (monitoringData.hasOwnProperty('asyncWrapper')) {
        return Monitor.asyncWrapper.call(this, target, property, monitoringData.asyncWrapper, monitoringData)
      } else {
        console.error(`Only async wrappers are supported by monitor`)
      }
    }
    return target[property]
  }

  monitor (functionName, functionConfig) {
    this.monitored.set(functionName, functionConfig)
  }

  static syncWrapper (target, property, experience) {
    console.log(`${property}() sync method has been called`)
    const origMethod = target[property]
    return function (...args) {
      let result = origMethod.apply(this, args)
      console.log(`${property}() sync method has been completed`)
      experience.complete()
      console.log(`${experience}`)
      return result
    }
  }

  /**
   * A wrapper around asynchronous functions that create new experience. A wrapped function is called
   * as a direct result of a user action: use of UI controls, etc.
   * @param target
   * @param property
   * @param actionFunction
   * @param monitoringData
   * @return {Function}
   */
  static asyncWrapper (target, property, actionFunction, monitoringData) {
    console.log(`${property}() async method has been requested`)
    return async function (...args) {
      try {
        return await actionFunction(this, target, property, args, monitoringData, _local_storage__WEBPACK_IMPORTED_MODULE_1__["default"])
      } catch (error) {
        console.error(`${property}() failed: ${error.value}`)
        throw error
      }
    }
  }

  /**
   * A wrapper around asynchronous functions that create new experience. A wrapped function is called
   * as a direct result of a user action: use of UI controls, and such.
   * @param monitor
   * @param target
   * @param property
   * @param args
   * @param monitoringData
   * @param storage
   * @return {Promise.<*>}
   */
  static async recordExperience (monitor, target, property, args, monitoringData, storage) {
    let experience = new _experience__WEBPACK_IMPORTED_MODULE_0__["default"](monitoringData.experience)
    console.log(`${property}() async method has been called`)
    // Last item in arguments list is a transaction
    args.push(experience)
    let result = await target[property].apply(monitor, args)
    // resultObject.value is a returned message, experience object is in a `experience` property
    experience = result.state
    experience.complete()
    console.log(`${property}() completed with success, experience is:`, experience)

    storage.write(experience)
    return result
  }

  /**
   * A wrapper around functions that are indirect result of user actions. Those functions are usually a part of
   * functions that create user experience.
   * @param monitor
   * @param target
   * @param property
   * @param args
   * @param monitoringData
   * @return {Promise.<*>}
   */
  static async recordExperienceDetails (monitor, target, property, args, monitoringData) {
    let experience = new _experience__WEBPACK_IMPORTED_MODULE_0__["default"](monitoringData.experience)
    console.log(`${property}() async method has been called`)
    let resultObject = await target[property].apply(monitor, args)
    experience.complete()
    resultObject.state.attach(experience)
    console.log(`${property}() completed with success, experience is: ${experience}`)
    return resultObject
  }

  /**
   * This is a wrapper around functions that handle outgoing messages that should have an experience object attached
   * @param monitor
   * @param target
   * @param property
   * @param args
   * @return {Promise.<*>}
   */
  static async attachToMessage (monitor, target, property, args) {
    console.log(`${property}() async method has been called`)
    // First argument is always a request object, last argument is a state (Experience) object
    args[0].experience = args[args.length - 1]
    let result = await target[property].apply(monitor, args)
    console.log(`${property}() completed with success`)
    return result
  }

  /**
   * This is a wrapper around functions that handle incoming messages with an experience object attached.
   * @param monitor
   * @param target
   * @param property
   * @param args
   * @return {Promise.<*>}
   */
  static async detachFromMessage (monitor, target, property, args) {
    console.log(`${property}() async method has been called`)
    // First argument is an incoming request object
    if (args[0].experience) {
      args.push(_experience__WEBPACK_IMPORTED_MODULE_0__["default"].readObject(args[0].experience))
    } else {
      console.warn(`This message has no experience data attached. Experience data will not be recorded`)
    }
    let result = await target[property].apply(monitor, args)
    console.log(`${property}() completed with success`)
    return result
  }
}


/***/ }),

/***/ "./object-monitor.js":
/*!***************************!*\
  !*** ./object-monitor.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ObjectMonitor; });
/* harmony import */ var _experience__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./experience */ "./experience.js");
/* harmony import */ var _local_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./local/storage */ "./local/storage.js");



const experienceActions = {
  START: Symbol('Experience start'),
  STOP: Symbol('Experience stop')
}

const eventTypes = {
  CONSTRUCT: Symbol('Construct'),
  GET: Symbol('Get'),
  SET: Symbol('Set')
}

class ObjectMonitor {
  constructor (options = {}) {
    this.experienceDescription = ''
    for (let event of Object.values(ObjectMonitor.events)) {
      this[event] = []
    }

    if (options) {
      if (options.experience) { this.experienceDescription = options.experience }
      if (options.actions) {
        for (const action of options.actions) {
          this[action.event].push(action)
        }
      }
    }
  }

  static get actions () {
    return experienceActions
  }

  static get events () {
    return eventTypes
  }

  static track (object, options) {
    return new Proxy(object, new ObjectMonitor(options))
  }

  get (target, property) {
    for (let action of this[ObjectMonitor.events.GET]) {
      if (action.name === property) { this.experienceAction(action) }
    }
    return target[property]
  }

  set (target, property, value) {
    for (let action of this[ObjectMonitor.events.SET]) {
      if (action.name === property) { this.experienceAction(action) }
    }
    target[property] = value
    return true // Success of a set operation
  }

  experienceAction (action) {
    if (action.action === ObjectMonitor.actions.START) {
      this.experience = new _experience__WEBPACK_IMPORTED_MODULE_0__["default"](this.experienceDescription).start()
      console.log(`Experience started`)
    } else if (action.action === ObjectMonitor.actions.STOP) {
      this.experience.complete()
      console.log(`Experience completed:`, this.experience)
      _local_storage__WEBPACK_IMPORTED_MODULE_1__["default"].write(this.experience)
    }
  }
}


/***/ }),

/***/ "./remote/adapter.js":
/*!***************************!*\
  !*** ./remote/adapter.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RemoteStorageAdapter; });
/**
 * Defines an API for storing experiences on a remote server, such as LRS.
 */
class RemoteStorageAdapter {
  /**
   * Stores one or several experiences on a remote server.
   * @param {Experience[]} experiences - An array of experiences to store remotely.
   * @return {Promise} - A promise that is fulfilled when a value is stored on a remote server successfully
   * and is rejected when storing on a remote server failed.
   */
  static write (experiences) {
    console.warn(`This method should be implemented within a subclass and should never be called directly.  
      If you see this message then something is probably goes wrong`)
    return new Promise()
  }
}


/***/ }),

/***/ "./remote/test-adapter.js":
/*!********************************!*\
  !*** ./remote/test-adapter.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TestAdapter; });
/* harmony import */ var _adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adapter */ "./remote/adapter.js");


/**
 * This is a test implementation of a remote experience store adapter. It does not send anything anywhere
 * and just records experiences that are passed to it.
 */
class TestAdapter extends _adapter__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /**
   * Imitates storing of one or several experiences on a remote server.
   * @param {Experience[]} experiences - An array of experiences to store remotely.
   * @return {Promise} - A promise that is fulfilled when a value is stored on a remote server successfully
   * and is rejected when storing on a remote server failed.
   */
  static write (experiences) {
    return new Promise((resolve, reject) => {
      if (!experiences) {
        reject(new Error(`experience cannot be empty`))
        return
      }
      if (!Array.isArray(experiences)) {
        reject(new Error(`experiences must be an array`))
        return
      }
      console.log('Experience sent to a remote server:')
      for (let experience of experiences) {
        console.log(experience)
      }
      resolve()
    })
  }
}


/***/ }),

/***/ "./transporter.js":
/*!************************!*\
  !*** ./transporter.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Transporter; });
/**
 * Responsible form transporting experiences from one storage to the other. Current implementation
 * sends a batch of experience objects to the remote server once a certain amount of them
 * is accumulated in a local storage.
 */
class Transporter {
  /**
   * Sets a transporter configuration.
   * @param {LocalStorageAdapter} localStorage - Represents local storage where experience objects are
   * accumulated before being sent to a remote server.
   * @param {RemoteStorageAdapter} remoteStorage - Represents a remote server that stores experience objects.
   * @param {number} qtyThreshold - A minimal number of experiences to be sent to a remote storage.
   * @param {number} interval - Interval, in milliseconds, of checking a local storage for changes
   */
  constructor (localStorage, remoteStorage, qtyThreshold, interval) {
    this.localStorage = localStorage
    this.remoteStorage = remoteStorage
    this.qtyThreshold = qtyThreshold
    window.setInterval(this.checkExperienceStorage.bind(this), interval)
  }

  /**
   * Runs at a specified interval and check if any new experience objects has been recorded to the local storage.
   * If number of experience records exceeds a threshold, sends all experiences to the remote server and
   * removes them from local storage.
   * @return {Promise.<void>}
   */
  async checkExperienceStorage () {
    console.log(`Experience storage check`)
    let records = await this.localStorage.readAll()
    let keys = Object.keys(records).filter((element) => element.indexOf(this.localStorage.defaults.prefix) === 0)
    if (keys.length > this.qtyThreshold) {
      await this.sendExperiencesToRemote()
    }
  }

  /**
   * If there are any experiences in the local storage, sends all of them to a remote server and, if succeeded,
   * removes them from a local storage.
   * @return {Promise.<*>}
   */
  async sendExperiencesToRemote () {
    try {
      let records = await this.localStorage.readAll()
      let values = Object.values(records)
      let keys = Object.keys(records).filter((element) => element.indexOf(this.localStorage.defaults.prefix) === 0)
      if (keys.length > 0) {
        // If there are any records in a local storage
        await this.remoteStorage.write(values)
        await this.localStorage.remove(keys)
      } else {
        console.log(`No data in local experience storage`)
      }
    } catch (error) {
      console.error(`Cannot send experiences to a remote server: ${error}`)
      return error
    }
  }
}


/***/ })

/******/ });
});
//# sourceMappingURL=alpheios-experience.js.map