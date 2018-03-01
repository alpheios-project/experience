import Experience from './experience'
import Storage from './local/storage'

export default class Monitor {
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
        return await actionFunction(this, target, property, args, monitoringData, Storage)
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
    let experience = new Experience(monitoringData.experience)
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
    let experience = new Experience(monitoringData.experience)
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
      args.push(Experience.readObject(args[0].experience))
    } else {
      console.warn(`This message has no experience data attached. Experience data will not be recorded`)
    }
    let result = await target[property].apply(monitor, args)
    console.log(`${property}() completed with success`)
    return result
  }
}
