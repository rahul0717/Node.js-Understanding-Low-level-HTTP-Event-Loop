//The imports and the global variables
var newsService = require("./NewsService.js");
var fs = require('fs');
var querystring = require('querystring')
var cookies = {}
var filePath = "./addNewStory.txt";
var fileOptions = { encoding: 'utf8', flag: 'r' }
var log = require("./logger.js");
//The GET method for the addNewStory page
function get(req, res) {
    cookiesStr = req.headers.cookie.split(";");
    console.log("this is the cookies in add new stry: ", cookiesStr);
    for (var i = 0; i < cookiesStr.length; i++) {
        if (cookiesStr[i].includes("user")) {
            cookies["username"] = cookiesStr[i].split("=")[1];
        }
        if (cookiesStr[i].includes("role")) {
            cookies["role"] = cookiesStr[i].split("=")[1];
        }
        if (cookiesStr[i].includes("sessionId")) {
            cookies["sessionId"] = cookiesStr[i].split("=")[1];
        }

    }
    fs.readFile(filePath, fileOptions, function (err, data) {
        if (err) {
            res.writeHead(400)
            res.end(JSON.stringify(err));
        }
        else {
            data = data.toString();
            data = data.replace("errormsg", "");
            data = data.replace("authorData1", cookies["username"]);
            data = data.replace("authorData2", cookies["username"]);
            res.writeHead(200)
            res.end(data);
        }
    });
}

//The POST method for addNewStory page
function post(reqData, req, res) {
    var dataToBeadded = {}
    reqData = querystring.decode(reqData);
    console.log("new stry data", reqData);
    dataToBeadded["author"] = reqData.authorTxt;
    dataToBeadded["title"] = reqData.titleTxt;
    dataToBeadded["flag"] = reqData.flagRb;
    dataToBeadded["content"] = reqData.contentTxt;
    dataToBeadded["date"] = reqData.dateTxt;
    newsService.addNewStory(dataToBeadded, function (err, data) {
        if (err) {
            fs.readFile(filePath, fileOptions, function (err, addHtmldata) {
                if (error) {
                    res.writeHead(400)
                    res.end(JSON.stringify(error));
                }
                else {
                    var logData = { "username": cookies["username"], "role": cookies["role"], "action": "adding new story failed", "sessionId": cookies["sessionId"], "ClientIP": req.headers['x-forwarded-for'], "timeStamp": (new Date).toString() };
                    log.eventEmitter.emit("log", logData);
                    addHtmldata = addHtmldata.toString();
                    addHtmldata = addHtmldata.replace("errormsg", JSON.stringify(err));
                    addHtmldata = addHtmldata.replace("authorData1", cookies["username"]);
                    addHtmldata = addHtmldata.replace("authorData2", cookies["username"]);
                    res.writeHead(200)
                    res.end(data);
                }
            });
        } else {
            //Loggin the action of adding a new story
            var logData = { "username": cookies["username"], "role": cookies["role"], "action": "adding new story successful", " sessionId": cookies["sessionId"], "ClientIP": req.headers['x-forwarded-for'], "timeStamp": (new Date).toString() };
            log.eventEmitter.emit("log", logData);
            res.writeHead(302, {
                'Content-Type': 'text/plain',
                'Location': '/viewData'
            });
            res.end();

        }

    })

}



module.exports = { get, post };