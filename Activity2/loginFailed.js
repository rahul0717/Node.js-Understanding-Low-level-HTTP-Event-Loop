//The required imports
var fs = require('fs');
// The text file containing the html content of the loginFailed page
var filePathLoginFailed = "./loginFailed.txt";
var fileOptions = { encoding: 'utf8', flag: 'r' }
// The GET method of the login failed page
// It renders the html
function get(req, res) {
    fs.readFile(filePathLoginFailed, fileOptions, function (err, data) {
        if (err) {
            res.writeHead(400)
            res.end(JSON.stringify(err));
        }
        else {
            data = data.replace("errorText", "Login Failed! Please check your credentials");
            res.writeHead(200)
            res.end(data);
        }
    });
}

//The POST method of the login failed page
//It redirects the user to the login page
function post(reqData,req, res) {
    res.writeHead(302, {
        'Content-Type': 'text/plain',
        'Location': '/login'
    });
    res.end();

}


module.exports = { get, post }