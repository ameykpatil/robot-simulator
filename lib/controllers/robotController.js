'use strict'

const robot = require('../models/robot')

/**
 * toggles the current robot status
 * @param request
 * @param h
 * @returns {*}
 */
const toggleRobotStatus = function(request, h) {
  try {
    const isRobotOnline = robot.toggle()
    const output = isRobotOnline ? {'message': 'robot is online'} : {'message': 'robot is offline'}
    return output
  } catch(err) {
    console.log(err)
    return boom.boomify(err, {statusCode: 500, message: err.message, override: false})
  }
}

/**
 * check the robot status
 * wait for the robot to be online
 * return after 5 secs
 * @returns {Promise<boolean>}
 */
const checkAndWaitForRobotToBeOnline = async function () {
  for (let i=0; i<5; i++) {
    if (robot.isOnline()) {
      return true
    }
    await sleep(1000)
  }
  return false
}

/**
 * sleep the current execution for specified milliseconds
 * @param ms
 * @returns {Promise<any>}
 */
const sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  toggleRobotStatus,
  checkAndWaitForRobotToBeOnline
}