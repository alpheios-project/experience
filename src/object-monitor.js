import Experience from './experience'
import Storage from './local/storage'

const experienceActions = {
  START: Symbol('Experience start'),
  STOP: Symbol('Experience stop')
}

const eventTypes = {
  CONSTRUCT: Symbol('Construct'),
  GET: Symbol('Get'),
  SET: Symbol('Set')
}

export default class ObjectMonitor {
  constructor (options = {}, logger = null) {
    this.logger = logger
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

  static track (object, options, logger = null) {
    return new Proxy(object, new ObjectMonitor(options, logger))
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
      this.experience = new Experience(this.experienceDescription).start()
      if (this.logger) {
        this.logger.log(`Experience started`)
      } else {
        console.log(`Experience started`)
      }
    } else if (action.action === ObjectMonitor.actions.STOP) {
      this.experience.complete()

      if (this.logger) {
        this.logger.log(`Experience completed:`, this.experience)
      } else {
        console.log(`Experience completed:`, this.experience)
      }
      Storage.write(this.experience, this.logger)
    }
  }
}
