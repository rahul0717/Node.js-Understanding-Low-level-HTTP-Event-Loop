//The module for recording the logs.
//The imports and the global variables  
var events = require('events');
var eventEmitter = new events.EventEmitter();
var logdata = [];
var logDataToWrite;
var fs = require('fs')
//***********The log file*********
var filePath = "./activity2logs.txt"
var fileOptions = { encoding: 'utf8', flag: 'r' }
var firstLogWrite = true;
//Create an event handler:
//Here I'm maintaining an array of log objects and only if the length is 4 I'm writing it
//By this way we can avoid constant reads and writes
var myEventHandler = function (log) {
    if (logdata.length < 5) {
        logdata.push(log);
    }
    if (firstLogWrite == true && logdata.length == 4) {
        logDataToWrite = JSON.stringify(logdata, null, '\t');
        fs.writeFileSync(filePath, logDataToWrite);
        logdata = []
        logdata.push(log);
        firstLogWrite = false;

    }
    if (firstLogWrite == false && logdata.length == 4) {
        data = fs.readFileSync(filePath, fileOptions);
        data = JSON.parse(data);
        for (var addedlog of logdata){
            data.push(addedlog);
        }
        data = JSON.stringify(data, null, '\t');
        fs.writeFileSync(filePath, data);
        logdata = []
        logdata.push(log);
    }

}

//Assign the event handler to an event:
eventEmitter.on('log', myEventHandler);


module.exports = { eventEmitter };