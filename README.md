# Robot-Simulator
This is a programatic simulator for a robot moving on a surface of a table.

## Table of contents

* [Problem Statement](./README.md#problem-statement)
* [Example Input and Output](./README.md#example-input-and-output)
* [Setup](./README.md#setup)
* [Running the app](./README.md#running-the-app)
* [About the development](./README.md#about-the-development)
* [Executing Commands](./README.md#executing-commands)
* [Assumptions & Deviations](./README.md#assumptions-and-deviations)
* [Bonus Points](./README.md#bonus-points)
* [Super Bonus Points](./README.md#super-bonus-points)
* [Future Enhancements](./README.md#future-enhancements)

## Problem Statement

* Background  
Simulate a robot moving on a square table. The table is 5 units x 5 units in size. There are no obstructions on the table surface. The robot is free to roam around the surface of the table, but must be prevented from falling.

* Task  
Create an application that can read in commands of the following form: 
```
PLACE X,Y,F 
MOVE 
LEFT 
RIGHT  
REPORT  
```
PLACE will put the robot on the table in position X,Y and facing NORTH, SOUTH, EAST or WEST. The origin (0,0) can be considered to be the SOUTH WEST most corner.   
The first valid command to the robot is a PLACE command, after that, any sequence of commands may be issued, in any order, including another PLACE command. The application should discard all commands in the sequence until a valid PLACE command has been executed.  
MOVE will move the robot one unit forward in the direction it is currently facing.  
LEFT and RIGHT will rotate the robot 90 degrees in the specified direction without changing the position of the robot.  
REPORT will announce the X,Y and orientation of the robot.  
A robot that is not on the table can choose to ignore the MOVE, LEFT, RIGHT and REPORT commands.  

* Constraints  
The robot must not fall off the table during movement. This also includes the initial placement of the robot. Any movement that would result in the robot falling from the table must be prevented.

* Bonus points  
For bonus points, implement a way for the robot to handle the case when commands are issued, but the robot is offline for 5 seconds.
For super bonus points, implement a way for the robot to handle more than one command issuer.

## Example Input and Output

```
Input Commands:
   "PLACE 0,0,NORTH"
   "MOVE"
   "REPORT"

Expected output:
   0,1,NORTH
```

```
Input Commands:
   "PLACE 0,0,NORTH"
   "LEFT"
   "REPORT"

Expected output:
   0,0,WEST
```

``` 
Input Commands:
   "LEFT",
   "MOVE",
   "MOVE",
   "MOVE",
   "PLACE 4,0,NORTH",
   "REPORT"

Expected output:
   3,3,NORTH
```

## Setup

1. Make sure you have Node 10.6.x installed (& NPM 6.1.x which comes along with Node) on your machine.

1. Clone this repo:

    ```git clone git@github.com:ameykpatil/robot-simulator.git```

1. Install dependencies:

    ```npm install```

## Running the App

```npm start``` (Make sure you are in the project directory)


## About the Development

* The application is a web server which can accept commands through http requests. This will enable sending commands over a web remotely in future.

* The application can accept commands in strcutured format as well as in a flat format.

* Robot object structure in robot.js keeps the current position & status of the robot.

* The flow of the project goes as below
Routes --> Controller --> Model

## Executing Commands

You can pass a curl command through a shell (flat way)
```
curl -X POST http://localhost:4889/simulator/v1/commands -H 'Content-Type: application/json' -d '[
  "PLACE 4,0,NORTH",
  "LEFT",
  "MOVE",
  "REPORT"
]'
```
You can pass commands in a structured way too
```
curl -X POST http://localhost:4889/simulator/v1/commands -H 'Content-Type: application/json' -d '{
	"commands": [
	  { "command": "PLACE", "x": 4, "y": 0, "f": "NORTH"},
	  { "command": "MOVE" },
	  { "command": "REPORT" }
  ]
}'
```

## Assumptions and Deviations

* Once a robot is on the table what should be the behaviour of the another PLACE command was not clear through problem statement, so the assumption is PLACE command will be successful. Robot will move to provided x & y position, also Robot will face towards given facing direction.

* The behaviour of the multiple REPORT commands was not clear through problem statement, so the assumption is every REPORT command will generate an output & it will print the position of the robot.

* If the command is invalid or if the PLACE command is provided with the out of bound position, the app will throw an error. This way we have tighten the app avoiding the input of bad data. This will also alert the user to inspect & enter correct data.   

## Bonus Points

* The implementation is such that the app can handle the commands even if the robot is offline for 5 seconds. The app checks if robot is online every 1 sec. So that the execution of commands are not delayed. But after 5 secs it will throw an error saying "robot seems to be offline".

* Robot is online or offline is currently being decided by the simple boolean flag.

* To simulate this use case there is an API created specfically for this purpose. This API can be used to toggle the status of the robot. It can be hit in a following way through shell.

```
curl -X POST http://localhost:4889/simulator/v1/robot/toggle
``` 
* To simulate this flow. You can toggle robot status to make it offline. In another tab hit an API to execute commands which should wait as the robot is offline. If you toggle status within 5 secs the robot will be online & the commands will be executed else commands won't be executed saying "robot seems to be offline".

## Super Bonus Points

* The command issuer in context of this app is any http client such as terminal, iterm, linux-shell, browser, postman etc.
It is perfectly possible to issue multiple requests through different command issuers. The app can handle multiple requests without any race condition.

## Future Enhancements

* Currently the position of the robot is stored in an object in a memory. In future, it can be persisted in a database or in-memory cache like Redis. This will enable the horizontal scaling of the app & multiple instances will be able to handle the scale of the increasing command issuers.    
