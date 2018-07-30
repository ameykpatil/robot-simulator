'use strict'

const _ = require('lodash')
const joi = require('joi')
const constants = require('../constants/constants')
const facings = constants.FACINGS
const commands = constants.COMMANDS

const commandSchema = {
  command: joi.string().equal(_.values(commands)).required(),
  x: joi.number().integer().min(0).max(4).when('command', {
    is: joi.string().equal(commands.PLACE),
    then: joi.required(),
    otherwise: joi.forbidden()
  }),
  y: joi.number().integer().min(0).max(4).when('command', {
    is: joi.string().equal(commands.PLACE),
    then: joi.required(),
    otherwise: joi.forbidden()
  }),
  f: joi.string().equal(_.values(facings)).when('command', {
    is: joi.string().equal(commands.PLACE),
    then: joi.required(),
    otherwise: joi.forbidden()
  })
}

const structuredSchema = {
  commands: joi.array().required().items(commandSchema).min(1).description('array of commands for a robot')
}

const flatSchema = joi.array().required().items(joi.string()).min(1).description('array of commands for a robot')

const executeCommands = {
  headers: {
    user: joi.string().equal('AMEY','ASTRO').optional()
  },
  payload: joi.alternatives().try(structuredSchema, flatSchema),
  options: {
    allowUnknown: true
  }
}

module.exports = {
  executeCommands,
  commandSchema
}