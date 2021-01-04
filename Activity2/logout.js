var cookies = {};
var log = require("./logger.js");
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
    logData = { "username": cookies["username"], "role": cookies["role"], "sessionId":cookies["sessionId"], "action": "User Logged out","ClientIP": req.headers['x-forwarded-for'], "timeStamp": (new Date).toString() };
    log.eventEmitter.emit("log", logData);
    var newCookies = ['username=' + cookies["username"], 'role=' + cookies["role"], 'sessionId=' + cookies["sessionId"] + '; expires=Thu, 07 Jan 1995 00:00:00']
    res.setHeader('Set-Cookie', newCookies);
    res.writeHead(302, {
        'Content-Type': 'text/plain',
        'Location': '/login'
    });
    res.end();


}

module.exports = { get };