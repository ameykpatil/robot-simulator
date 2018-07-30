
const _ = require('lodash')
const joi = require('joi')
const constants = require('../constants/constants')
const facings = constants.FACINGS

/**
 * robot object
 * @type {{x: number, y: number, f: string, isOnline: boolean}}
 */
const robot = {
  x: -1,
  y: -1,
  f: 'INVALID',
  isOnline: true
}

//robot schema to validate against
const robotSchema = joi.object().keys({
  x: joi.number().integer().min(0).max(4).required(),
  y: joi.number().integer().min(0).max(4).required(),
  f: joi.string().equal(_.values(facings)).required(),
  isOnline: joi.boolean()
})

//orientation object which specifies the corresponding left & right facings
const orientation = {
  [facings.NORTH] : {LEFT: facings.WEST, RIGHT: facings.EAST},
  [facings.EAST] : {LEFT: facings.NORTH, RIGHT: facings.SOUTH},
  [facings.WEST] : {LEFT: facings.SOUTH, RIGHT: facings.NORTH},
  [facings.SOUTH] : {LEFT: facings.EAST, RIGHT: facings.WEST},
}


/**
 * returns true if the robot is initialized
 * @returns {boolean}
 */
const isRobotOnTable = function() {
  return robot.f !== 'INVALID'
}

/**
 * returns true if the robot is online
 * @returns {boolean}
 */
const isOnline = function() {
  return robot.isOnline
}

/**
 * returns the current position of the robot
 * @returns {*}
 */
const getCurrentPosition = function() {
  return _.cloneDeep(robot)
}

/**
 * places the robot on the table at specified x, y position
 * & facing towards given f
 * @param x
 * @param y
 * @param f
 */
const place = function(x, y, f) {
  const isOnline = true
  const newRobot = {x, y, f, isOnline}
  const result = joi.validate(newRobot, robotSchema)
  if (!result.error) {
    robot.x = x
    robot.y = y
    robot.f = f
    robot.isOnline = isOnline
  }
}

/**
 * turns the robot to the left
 */
const left = function() {
  if (isRobotOnTable()) {
    robot.f = orientation[robot.f].LEFT
  }
}

/**
 * turns the robot to the right
 */
const right = function() {
  if (isRobotOnTable()) {
    robot.f = orientation[robot.f].RIGHT
  }
}

/**
 * moves the robot forward by 1 position
 * it moves in the direction where the robot is currently facing
 */
const move = function() {
  if (!isRobotOnTable()) {
    return
  }
  newRobot = _.clone(robot)
  switch (robot.f) {
    case facings.NORTH:
      newRobot.y = newRobot.y + 1
      break
    case facings.EAST:
      newRobot.x = newRobot.x + 1
      break
    case facings.WEST:
      newRobot.x = newRobot.x - 1
      break
    case facings.SOUTH:
      newRobot.y = newRobot.y - 1
      break
  }
  const result = joi.validate(newRobot, robotSchema)
  if (!result.error) {
    robot.x = newRobot.x
    robot.y = newRobot.y
  }
}

/**
 * reports the current position of the robot
 * @returns {*}
 */
const report = function() {
  if (isRobotOnTable()) {
    return getCurrentPosition()
  }
  return
}

/**
 * 
 * @returns {boolean}
 */
const toggle = function() {
  robot.isOnline = !robot.isOnline
  return robot.isOnline
}

module.exports = {
  isOnline,
  place,
  left,
  right,
  move,
  report,
  toggle
}