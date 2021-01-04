//The viewStory Page
//The required imports and global variables
var newsService = require("./NewsService.js");
var fs = require('fs');
//The GLOBAL COOKIE object
var cookies = {}
var dataToDisplay = {}
var finalHtml
var filePath = "./viewData.txt";
var fileOptions = { encoding: 'utf8', flag: 'r' }
var log = require("./logger.js");
//The function GET method of the viewStory page
//The function renders the html depending on the type of the user.
function get(req, res) {
    var logData
    //Collectin the set cookie
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

    if (cookies["role"] == "guest") {
        //gets only the public data for a guest user(make only the public stories hyper linked)
        var searchInput = {};
        searchInput["title"] = "";
        searchInput["author"] = "";
        searchInput["startDate"] = "";
        searchInput["endDate"] = "";
        newsService.viewAllStory(function (err, viewAlldata) {
            if (err) {
                callback(JSON.stringify(err))
            }
            else {
                dataToDisplay = JSON.parse(viewAlldata)
                //now lets add the private stories and make them non-hyper-linked
                // what we are doing is we get all the data by passing an empty search data string
                // Then we filter out the private ones and add it to our data set
                newsService.searchStory(searchInput, function (err, searchData) {
                    if (err) {
                        res.writeHead("400");
                        res.emd(JSON.stringify(err));
                    } else {
                        searchData = JSON.parse(searchData);
                        for (var story of searchData) {
                            if (story.flag == "private") {
                                dataToDisplay.push(story);
                            }
                        }
                        readViewHtml(function (err, htmlData) {
                            if (err) {
                                res.writeHead("400");
                                res.end(JSON.stringify(err))
                            }
                            else {
                                logData = { "username": cookies["username"], "role": cookies["role"], "action": "viewing stories", "sessionId": cookies["sessionId"],"ClientIP": req.headers['host'], "timeStamp": (new Date).toString() };
                                log.eventEmitter.emit("log", logData);
                                finalHtml = addDataToHtml(dataToDisplay, htmlData);
                                res.writeHead("200");
                                res.end(finalHtml);
                            }
                        })
                    }
                })
            }
        });
    } else if (cookies["role"] == "author") {
        //should get all the public data and the private data only authored by him to hyperlink.
        var searchInput = {};
        var searchPrivateOtherAUthors = {};
        searchInput["title"] = "";
        searchInput["author"] = cookies["username"];
        searchInput["startDate"] = "";
        searchInput["endDate"] = "";
        searchPrivateOtherAUthors["title"] = "";
        searchPrivateOtherAUthors["author"] = "";
        searchPrivateOtherAUthors["startDate"] = "";
        searchPrivateOtherAUthors["endDate"] = "";
        //getting all public story 
        newsService.viewAllStory(function (err, viewAlldata) {
            if (err) {
                callback(JSON.stringify(err))
            }
            else {
                dataToDisplay = JSON.parse(viewAlldata);
                //getting all the private story of the author
                newsService.searchStory(searchInput, function (err, data) {
                    if (err) {
                        res.writeHead("400");
                        res.end(JSON.stringify(err));
                    }
                    else {
                        if (data.includes("Sorry no data") != true) {
                            data = JSON.parse(data);
                            for (var story of data) {
                                if (story.flag == "private") {
                                    dataToDisplay.push(story);
                                }
                            }
                        }


                        newsService.searchStory(searchPrivateOtherAUthors, function (err, searchData) {
                            if (err) {
                                res.writeHead("400");
                                res.emd(JSON.stringify(err));
                            } else {
                                searchData = JSON.parse(searchData);
                                for (var story of searchData) {
                                    if (story.flag == "private" && story.author != cookies["username"]) {
                                        dataToDisplay.push(story);
                                    }
                                }
                                readViewHtml(function (err, htmlData) {
                                    if (err) {
                                        res.writeHead("400");
                                        res.end(JSON.stringify(err))
                                    }
                                    else {
                                        logData = { "username": cookies["username"], "role": cookies["role"], "action": "viewing stories", " sessionId": cookies["sessionId"],"ClientIP": req.headers['host'], "timeStamp": (new Date).toString() };
                                        log.eventEmitter.emit("log", logData);
                                        finalHtml = addDataToHtml(dataToDisplay, htmlData);
                                        res.writeHead("200");
                                        res.end(finalHtml);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });


    }


    else if (cookies["role"] == "subscriber") {
        //if the user is subscriber then all the data should be hyperlinked
        var searchInput = {}
        searchInput["title"] = "";
        searchInput["author"] = "";
        searchInput["startDate"] = "";
        searchInput["endDate"] = "";
        newsService.viewAllStory(function (err, viewAlldata) {
            if (err) {
                callback(JSON.stringify(err))
            }
            else {
                dataToDisplay = JSON.parse(viewAlldata);
                newsService.searchStory(searchInput, function (err, searchData) {
                    if (err) {
                        res.writeHead("400");
                        res.end(JSON.stringify(err));
                    }
                    else {
                        searchData = JSON.parse(searchData);
                        for (var story of searchData) {
                            if (story.flag == "private") {
                                dataToDisplay.push(story);
                            }
                        }
                        readViewHtml(function (err, htmlData) {
                            if (err) {
                                res.writeHead("400");
                                res.end(JSON.stringify(err))
                            }
                            else {
                                logData = { "username": cookies["username"], "role": cookies["role"], "action": "viewing stories", " sessionId": cookies["sessionId"],"ClientIP": req.headers['x-forwarded-for'], "timeStamp": (new Date).toString() };
                                log.eventEmitter.emit("log", logData);
                                finalHtml = addDataToHtml(dataToDisplay, htmlData);
                                res.writeHead("200");
                                res.end(finalHtml);
                            }
                        })
                    }
                })
            }
        });


    }

}
//The function to read the html
function readViewHtml(callback) {
    fs.readFile(filePath, fileOptions, function (err, data) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, data);
        }
    });
}
//The function to alter the html dynamically with session data
function addDataToHtml(data, htmlStr) {
    var viewHtml = htmlStr.toString();
    var rowStr = ''
    var stories = data;
    for (var story of stories) {
        if (story.flag == "public") {
            rowStr += '<tr><td><div title ="' + story.title + '"><a href="/viewIndividualStory?id=' + story.id + '">' + story.title + '</a></div></td></tr>'
        } else if (story.flag == "private") {
            if (cookies["role"] == "author" && story.author == cookies["username"]) {
                rowStr += '<tr><td><div title ="' + story.title + '"><a href="/viewIndividualStory?id=' + story.id + '">' + story.title + '</a></div></td></tr>'
            } else if (cookies["role"] == "author" && story.author != cookies["username"]) {
                rowStr += '<tr><td><div title ="' + story.title + '">' + story.title + '</div></td></tr>'
            } else if (cookies["role"] == "subscriber") {
                rowStr += '<tr><td><div title ="' + story.title + '"><a href="/viewIndividualStory?id=' + story.id + '">' + story.title + '</a></div></td></tr>'
            }

        }
    }
    if (cookies["role"] == "author") {
        viewHtml = viewHtml.replace("addlink", '<p><a href="/addNewStory">Click to Add New Story</a></p>');
    } else {
        viewHtml = viewHtml.replace("addlink", '');
    }
    viewHtml = viewHtml.replace("displayusername", cookies["username"]);
    viewHtml = viewHtml.replace("displayrole", cookies["role"]);
    viewHtml = viewHtml.replace("data", rowStr);
    return viewHtml;

}




module.exports = { get }