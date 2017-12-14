/**
 * A base object class for an Experience object.
 */
class Experience {
  constructor (description) {
    this.description = description;
    this.startTime = new Date().getTime();
    this.endTime = undefined;
    this.details = [];
  }

  static readObject (jsonObject) {
    let experience = new Experience(jsonObject.description);
    if (jsonObject.startTime) { experience.startTime = jsonObject.startTime; }
    if (jsonObject.endTime) { experience.endTime = jsonObject.endTime; }
    for (let detailsItem of jsonObject.details) {
      experience.details.push(Experience.readObject(detailsItem));
    }
    return experience
  }

  attach (experience) {
    this.details.push(experience);
  }

  complete () {
    this.endTime = new Date().getTime();
  }

  get duration () {
    return this.endTime - this.startTime
  }

  toString () {
    return `"${this.description}" experience duration is ${this.duration} ms`
  }
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = commonjsGlobal.crypto || commonjsGlobal.msCrypto; // for IE 11
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

var rngBrowser = rng;

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

var bytesToUuid_1 = bytesToUuid;

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rngBrowser)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid_1(rnds);
}

var v4_1 = v4;

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
    let uuid = `${LocalStorageAdapter.defaults.prefix}${v4_1()}`;

    browser.storage.local.set({[uuid]: experience}).then(
      () => {
        console.log(`Experience has been written to the local storage successfully`);
      },
      (error) => {
        console.error(`Cannot write experience to the local storage because of the following error: ${error}`);
      }
    );
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
      console.error(`Cannot read data from the local storage because of the following error: ${error}`);
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

class Monitor {
  constructor (monitoringDataList) {
    this.monitored = new Map();
    if (monitoringDataList) {
      for (let monitoringData of monitoringDataList) {
        this.monitored.set(monitoringData.monitoredFunction, monitoringData);
      }
    }
  }

  static track (object, monitoringDataList) {
    return new Proxy(object, new Monitor(monitoringDataList))
  }

  get (target, property, receiver) {
    if (this.monitored.has(property)) {
      let monitoringData = this.monitored.get(property);
      if (monitoringData.hasOwnProperty('asyncWrapper')) {
        return Monitor.asyncWrapper.call(this, target, property, monitoringData.asyncWrapper, monitoringData)
      } else {
        console.error(`Only async wrappers are supported by monitor`);
      }
    }
    return target[property]
  }

  monitor (functionName, functionConfig) {
    this.monitored.set(functionName, functionConfig);
  }

  static syncWrapper (target, property, experience) {
    console.log(`${property}() sync method has been called`);
    const origMethod = target[property];
    return function (...args) {
      let result = origMethod.apply(this, args);
      console.log(`${property}() sync method has been completed`);
      experience.complete();
      console.log(`${experience}`);
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
    console.log(`${property}() async method has been requested`);
    return async function (...args) {
      try {
        return await actionFunction(this, target, property, args, monitoringData, LocalStorageAdapter)
      } catch (error) {
        console.error(`${property}() failed: ${error.value}`);
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
    let experience = new Experience(monitoringData.experience);
    console.log(`${property}() async method has been called`);
    // Last item in arguments list is a transaction
    args.push(experience);
    let result = await target[property].apply(monitor, args);
    // resultObject.value is a returned message, experience object is in a `experience` property
    experience = result.state;
    experience.complete();
    console.log(`${property}() completed with success, experience is:`, experience);

    storage.write(experience);
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
    let experience = new Experience(monitoringData.experience);
    console.log(`${property}() async method has been called`);
    let resultObject = await target[property].apply(monitor, args);
    experience.complete();
    resultObject.state.attach(experience);
    console.log(`${property}() completed with success, experience is: ${experience}`);
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
    console.log(`${property}() async method has been called`);
    // First argument is always a request object, last argument is a state (Experience) object
    args[0].experience = args[args.length - 1];
    let result = await target[property].apply(monitor, args);
    console.log(`${property}() completed with success`);
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
    console.log(`${property}() async method has been called`);
    // First argument is an incoming request object
    if (args[0].experience) {
      args.push(Experience.readObject(args[0].experience));
    } else {
      console.warn(`This message has no experience data attached. Experience data will not be recorded`);
    }
    let result = await target[property].apply(monitor, args);
    console.log(`${property}() completed with success`);
    return result
  }
}

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
    this.localStorage = localStorage;
    this.remoteStorage = remoteStorage;
    this.qtyThreshold = qtyThreshold;
    window.setInterval(this.checkExperienceStorage.bind(this), interval);
  }

  /**
   * Runs at a specified interval and check if any new experience objects has been recorded to the local storage.
   * If number of experience records exceeds a threshold, sends all experiences to the remote server and
   * removes them from local storage.
   * @return {Promise.<void>}
   */
  async checkExperienceStorage () {
    console.log(`Experience storage check`);
    let records = await this.localStorage.readAll();
    let keys = Object.keys(records).filter((element) => element.indexOf(this.localStorage.defaults.prefix) === 0);
    if (keys.length > this.qtyThreshold) {
      await this.sendExperiencesToRemote();
    }
  }

  /**
   * If there are any experiences in the local storage, sends all of them to a remote server and, if succeeded,
   * removes them from a local storage.
   * @return {Promise.<*>}
   */
  async sendExperiencesToRemote () {
    try {
      let records = await this.localStorage.readAll();
      let values = Object.values(records);
      let keys = Object.keys(records).filter((element) => element.indexOf(this.localStorage.defaults.prefix) === 0);
      if (keys.length > 0) {
        // If there are any records in a local storage
        await this.remoteStorage.write(values);
        await this.localStorage.remove(keys);
      } else {
        console.log(`No data in local experience storage`);
      }
    } catch (error) {
      console.error(`Cannot send experiences to a remote server: ${error}`);
      return error
    }
  }
}

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
      If you see this message then something is probably goes wrong`);
    return new Promise()
  }
}

/**
 * This is a test implementation of a remote experience store adapter. It does not send anything anywhere
 * and just records experiences that are passed to it.
 */
class TestAdapter extends RemoteStorageAdapter {
  /**
   * Imitates storing of one or several experiences on a remote server.
   * @param {Experience[]} experiences - An array of experiences to store remotely.
   * @return {Promise} - A promise that is fulfilled when a value is stored on a remote server successfully
   * and is rejected when storing on a remote server failed.
   */
  static write (experiences) {
    return new Promise((resolve, reject) => {
      if (!experiences) {
        reject(new Error(`experience cannot be empty`));
        return
      }
      if (!Array.isArray(experiences)) {
        reject(new Error(`experiences must be an array`));
        return
      }
      console.log('Experience sent to a remote server:');
      for (let experience of experiences) {
        console.log(experience);
      }
      resolve();
    })
  }
}

export { Experience, Monitor, Transporter, LocalStorageAdapter as StorageAdapter, TestAdapter };
