/**
 * Created by alkesh on 08/02/17.
 */

const constants = require('../constants/constants')
const commandController = require('../controllers/commandController')
const validate = require('./validate')

const routes = []

/**
 * GET /feed/callback/{authUid}
 * api for superfeedr callback
 */
routes.push({
  path: constants.API_PATH,
  method: 'POST',
  handler: commandController.executeCommands,
  config: {
    tags: ['client', 'commands'],
    validate: validate.executeCommands
  }
})

/**
 * POST /robot/toggle
 * api to get toggle status of the robot
 */
routes.push({
  path: `${constants.API_PATH}/robot/toggle`,
  method: 'POST',
  handler: robotController.toggleRobotStatus,
  config: {
    tags: ['client', 'robot']
  }
})

module.exports = routes
