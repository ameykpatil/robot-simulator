'use strict'

const _ = require('lodash')
const joi = require('joi')
const boom = require('boom')
const validate = require('../router/validate')
const robotController = require('./robotController')
const robot = require('../models/robot')
const constants = require('../constants/constants')
const commands = constants.COMMANDS

/**
 * executes commands provided in a request
 * @param request
 * @param h
 * @returns {Promise<*>}
 */
const executeCommands = async function(request, h) {
  let output = []
  try {
    let reqCommands = request.payload.commands
    if (_.isArray(request.payload)) {
      reqCommands = convertFlatCommands(request.payload)
    }

    const isRobotOnline = await robotController.checkAndWaitForRobotToBeOnline()
    if (!isRobotOnline) {
      return {output: 'robot seems to be offline'}
    }

    for (const command of reqCommands) {
      const result = await executeCommand(command)
      if (result) {
        output.push(result)
      }
    }

    if (_.isArray(request.payload)) {
      output = convertOutput(output)
    }

    return output
  } catch (err) {
    console.log(err)
    return boom.boomify(err, {statusCode: 400, message: err.message, override: false})
  }
}

/**
 * executes single command provided
 * @param command
 * @returns {Promise<*>}
 */
const executeCommand = async function(command) {
  switch (command.command) {
    case commands.PLACE:
      robot.place(command.x, command.y, command.f)
      break
    case commands.LEFT:
      robot.left()
      break
    case commands.RIGHT:
      robot.right()
      break
    case commands.MOVE:
      robot.move()
      break
    case commands.REPORT:
      const position = robot.report()
      return position
  }
}

/**
 * converts all the given flat commands into structured commands
 * @param stringCommands
 * @returns {Array}
 */
const convertFlatCommands = function(stringCommands) {
  const reqCommands = []
  for (const stringCommand of stringCommands) {
    const reqCommand = convertFlatCommandToStructured(stringCommand)
    const result = joi.validate(reqCommand, validate.commandSchema)
    if(result.error) {
      throw result.error
    }
    if(result.value) {
      reqCommands.push(result.value)
    }
  }

  return reqCommands
}

/**
 * converts single flat command to structured command
 * @param stringCommand
 * @returns {*}
 */
const convertFlatCommandToStructured = function(stringCommand) {
  stringCommand = _.trim(stringCommand)
  switch (stringCommand) {
    case commands.LEFT:
      return {command: commands.LEFT}
    case commands.RIGHT:
      return {command: commands.RIGHT}
    case commands.MOVE:
      return {command: commands.MOVE}
    case commands.REPORT:
      return {command: commands.REPORT}
    default:
      const arr = stringCommand.split(' ')
      if (arr[0] === commands.PLACE && arr[1]) {
        const posArr = arr[1].split(',')
        return {
          command: commands.PLACE,
          x: posArr[0],
          y: posArr[1],
          f: posArr[2]
        }
      }
      return
  }
}

/**
 * converts structred output into flat one
 * @param output
 * @returns {*}
 */
const convertOutput = function(output) {
  let flatOutput = ''
  for (const result of output) {
    if (_.isObject(result) && _.has(result, 'x') && _.has(result, 'y') && result.f) {
      flatOutput = `${flatOutput}${result.x},${result.y},${result.f}\n`
    }
  }
  return flatOutput
}

module.exports = {
  executeCommands
}