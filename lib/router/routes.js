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
 * GET /images/public-image
 * api to get authenticated profile-image for given authUid
 */
routes.push({
  path: `${constants.API_PATH}/left`,
  method: 'POST',
  handler: commandController.executeCommands,
  config: {
    tags: ['client', 'commands'],
    validate: validate.executeCommands
  }
})

module.exports = routes
