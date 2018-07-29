'use strict'

const robot = require('../models/robot')
const constants = require('../constants/constants')
const commands = constants.COMMANDS

const executeCommands = async function(request, h) {
  const output = []
  try {
    const commands = request.payload.commands
    for (const command of commands) {
      const result = await executeCommand(command)
      if (result) {
        output.push(result)
      }
    }
    return output
  } catch (err) {
    console.log(err)
    return err
  }
}

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

module.exports = {
  executeCommands
}