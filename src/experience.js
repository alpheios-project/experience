/**
 * A base object class for an Experience object.
 */
export default class Experience {
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
