
const _ = require('lodash')
const joi = require('joi')
const constants = require('../constants/constants')
const facings = constants.FACINGS
const commands = constants.COMMANDS

const robot = {
  x: -1,
  y: -1,
  f: 'INVALID',
  isOnline: false
}

const robotSchema = joi.object().keys({
  x: joi.number().integer().min(0).max(4).required(),
  y: joi.number().integer().min(0).max(4).required(),
  f: joi.string().equal(_.values(facings)).required(),
  isOnline: joi.boolean()
})

const orientation = {
  [facings.NORTH] : {LEFT: facings.WEST, RIGHT: facings.EAST},
  [facings.EAST] : {LEFT: facings.NORTH, RIGHT: facings.SOUTH},
  [facings.WEST] : {LEFT: facings.SOUTH, RIGHT: facings.NORTH},
  [facings.SOUTH] : {LEFT: facings.EAST, RIGHT: facings.WEST},
}

const isRobotOnTable = function() {
  return robot.f !== 'INVALID'
}

const getCurrentPosition = function() {
  return _.cloneDeep(robot)
}

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

const left = function() {
  if (isRobotOnTable()) {
    robot.f = orientation[robot.f].LEFT
  }
}

const right = function() {
  if (isRobotOnTable()) {
    robot.f = orientation[robot.f].RIGHT
  }
}

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

const report = function() {
  if (isRobotOnTable()) {
    return getCurrentPosition()
  }
  return
}

module.exports = {
  place,
  left,
  right,
  move,
  report
}