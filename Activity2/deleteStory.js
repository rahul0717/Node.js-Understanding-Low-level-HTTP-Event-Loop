// The imports and the global vaiable
var newsService = require("./NewsService");
var url = require("url");
var queryStr;
var log = require("./logger.js");
var cookies = {};

//The GET method for the delete story page
function get(req, res) {
    cookiesStr = req.headers.cookie.split(";");
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
    var idData = {};
    queryStr = url.parse(req.url).query;
    idData["id"] = queryStr.split("=")[1];
    newsService.deleteExistingStory(idData, function (err, data) {
        if (err) {
            res.writeHeaad("400");
            res.end(JSON.stringify(err));
        } else {
            //Logging the action of deleting story
            var logData = { "username": cookies["username"], "role": cookies["role"], "action": "deleting a story", " sessionId": cookies["sessionId"],"ClientIP": req.headers['x-forwarded-for'], "timeStamp": (new Date).toString() };
            log.eventEmitter.emit("log", logData);
            res.writeHead(302, {
                'Content-Type': 'text/plain',
                'Location': '/viewData'
            });
            res.end();
        }
    });
}


module.exports = { get }