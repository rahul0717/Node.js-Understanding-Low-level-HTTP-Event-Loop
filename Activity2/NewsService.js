var http = require('http')
var url = require('url')
var fs = require('fs')
var filePath = "./NewsStory.txt"
var fileOptions = { encoding: 'utf8', flag: 'r' }

var options = {
    localport: '3000',
    server: 'localhost',
}


// *********** This server was created for the testing purpose**********    

// http.createServer(function (req, res) {
//     console.log("Server Started");

//     if (req.method == "POST") {
//         var reqData = '';
//         req.on('data', function (chunk) {
//             reqData += chunk;
//         });
//         req.on('end', function () {
//             if (reqData.length > 0) {
//                 try {
//                     reqData = JSON.parse(reqData)
//                 } catch (e) {
//                     res.writeHead(400);
//                     res.end("Bad Data " + e);
//                 }
//                 if (reqData["intent"] == "delete") {
//                     deleteExistingStory(reqData["data"], function (err, resp) {
//                         if (err) {
//                             res.writeHead(400);
//                             res.end("Error in Deletion" + JSON.stringify(err));
//                         } else {
//                             res.writeHead(200);
//                             res.end(resp);

//                         }
//                     })

//                 }

//                 else if (reqData["intent"] == "update headline") {
//                     updateStoryHeadline(reqData["data"], function (err, resp) {
//                         if (err) {
//                             res.writeHead(400);
//                             res.end("Error in Updating Headline" + JSON.stringify(err));
//                         }
//                         else {
//                             res.writeHead(200);
//                             res.end(resp);
//                         }
//                     })


//                 }
//                 else if (reqData["intent"] == "update content") {
//                     updateStoryContent(reqData["data"], function (err, resp) {
//                         if (err) {
//                             res.writeHead(400);
//                             res.end("Error in Updating Content" + JSON.stringify(err));
//                         }
//                         else {
//                             res.writeHead(200);
//                             res.end(resp);
//                         }
//                     })

//                 }
//                 else if (reqData["intent"] == "search") {
//                     searchStory(reqData["data"], function (err, resp) {
//                         if (err) {
//                             res.writeHead(400);
//                             res.end("Error in Searching" + JSON.stringify(err));
//                         }
//                         else {
//                             res.writeHead(200);
//                             res.end(resp);
//                         }
//                     })

//                 } else if (reqData["intent"] == "add") {
//                     addNewStory(reqData[data], function (err, resp) {
//                         if (err) {
//                             res.writeHead(400);
//                             res.end("Adding failed" + JSON.stringify(err));
//                         }
//                         else {
//                             res.writeHead(200);
//                             res.end(resp);
//                         }
//                     })

//                 }
//                 else {
//                     res.writeHead(400);
//                     res.end("Operation Failed, Please check your input : Bad Data")
//                 }

//             }
//             else if (reqData.length == 0) {
//                 res.writeHead(400);
//                 res.end("Operation Failed, Please check your input : NULL Data Exception")
//             }

//         });
//     } else if (req.method == "GET") {
//         viewAllStory(function (err, resp) {
//             if (err) {
//                 res.writeHead(400);
//                 res.end("View All Failed" + JSON.stringify(err));
//             } else {
//                 res.writeHead(200)
//                 res.end(resp)

//             }

//         })
//     }
// }).listen(options.localport);



//Function to add a new Story
//Input will be a JSON object of a new story
// We'll be validating the story object and only then adding the object
function addNewStory(newStory, callback) {
    if (Object.keys(newStory).length == 0) {
        callback({ "statusCode": "400", "msg": "Adding failed: Empty Data Exception" })
    } else if (Object.keys(newStory).length != 5) {
        callback({ "statusCode": "400", "msg": "Adding failed: Bad Data Exception" })
    }
    else {
        var existingStoryData
        var dataLength = 0
        fs.readFile(filePath, fileOptions, function (err, data) {
            if (err) {
                callback(err)
            }
            else {
                try {
                    existingStoryData = JSON.parse(data);
                } catch (e) {
                    callback(e)
                }
                dataLength = existingStoryData.length
                newStory['id'] = (dataLength + 1).toString()
                existingStoryData.push(newStory)
                existingStoryData = JSON.stringify(existingStoryData,null, '\t')
                fs.writeFile(filePath, existingStoryData, function (error) {
                    if (error) {
                        callback(error)
                    }
                    else {
                        callback(null, "New Story added Successfully");
                    }
                });
            }
        });

    }
}

//This is the function to Search the stories
// We'll we giving the search paramter as a object with title, author, start date and end date attributes.
//If the arttributes are empty then we will return all the stories
function searchStory(searchData, callback) {

    if (Object.keys(searchData).length == 0) {
        callback({ "statusCode": "400", "msg": "Searching failed: Null Data Exception" })
    }
    else if (Object.keys(searchData).length != 4) {
        callback({ "statusCode": "400", "msg": "Searching failed: Bad Data Exception" })
    }
    else {
        var searchResult = []
        var author = searchData['author']
        var title = searchData['title']
        var startDate = searchData['startDate']
        var endDate = searchData['endDate']
        fs.readFile(filePath, fileOptions, function (err, data) {
            if (err) {
                callback(err);
            }
            else {
                storyData = JSON.parse(data);
                if (title.length > 0 && title != '') {
                    for (var i = 0; i < storyData.length; i++) {
                        if (storyData[i].title.includes(title) == false) {
                            storyData.splice(i, 1);
                            i--;
                        }
                    }

                }
                if (author.length > 0) {
                    for (var i = 0; i < storyData.length; i++) {
                        if (storyData[i].author != author) {
                            storyData.splice(i, 1);
                            i--;
                        }
                    }
                }
                if (startDate.length > 0) {
                    for (var i = 0; i < storyData.length; i++) {
                        if (Date.parse(startDate) > Date.parse(storyData[i].date)) {
                            storyData.splice(i, 1);
                            i--;
                        }
                    }
                }
                if (endDate.length > 0) {
                    for (var i = 0; i < storyData.length; i++) {
                        if (Date.parse(endDate) < Date.parse(storyData[i].date)) {
                            storyData.splice(i, 1);
                            i--;
                        }
                    }
                }

                if (storyData.length > 0) {
                    searchResult = JSON.stringify(storyData)
                    callback(null, searchResult);
                }
                else {
                    callback(null, "Sorry no data found for the search criteria")
                }

            }
        });

    }

}

//This is the function to update the Headlines of the story
// We pass the title of the story and new headline

function updateStoryHeadline(headlineData, callback) {

    if (Object.keys(headlineData).length == 0) {
        callback({ "statusCode": "400", "msg": "Updating Headline failed: Null Data Exception" })
    }
    else if (Object.keys(headlineData).length != 2) {
        callback({ "statusCode": "400", "msg": "Updating Headline failed: Bad Data Exception" })
    }
    else {
        fs.readFile(filePath, fileOptions, function (err, data) {
            if (err) {
                callback(err);
            }
            else {
                storyData = JSON.parse(data);
                for (var story of storyData) {
                    if (story.title == headlineData.oldTitle) {
                        story.title = headlineData.newTitle;
                    }
                }
                storyData = JSON.stringify(storyData);
                fs.writeFile(filePath, storyData, function (error) {
                    if (error) {
                        callback(error)
                    }
                    else {
                        callback(null, "Update Successful");
                    }
                });
            }

        });

    }

}

//This is the function to update the content of the story
// We pass the title of the story and new content
function updateStoryContent(contentData, callback) {
    if (Object.keys(contentData).length == 0) {
        callback({ "statusCode": "400", "msg": "Updating content failed: Null Data Exception" })
    }
    else if (Object.keys(contentData).length != 2) {
        callback({ "statusCode": "400", "msg": "Updating content failed: Bad Data Exception" })
    }
    else {
        fs.readFile(filePath, fileOptions, function (err, data) {
            if (err) {
                callback(err);
            }
            else {
                storyData = JSON.parse(data);
                for (var story of storyData) {
                    if (story.title == contentData.title) {
                        story.content = contentData.content;
                    }
                }
                storyData = JSON.stringify(storyData);
                fs.writeFile(filePath, storyData, function (error) {
                    if (error) {
                        callback(error)
                    }
                    else {
                        callback(null, "Update Successful");
                    }
                });
            }

        });

    }


}

//This is the function to delete a story
// We pass the id of the story to be deleted

function deleteExistingStory(idData, callback) {
    if(Object.keys(idData).length != 1){
        callback({ "statusCode": "400", "msg": "Deletion failed: Bad Data Exception" })
    }
    else if (idData["id"].length <= 0) {
        callback({ "statusCode": "400", "msg": "Deletion failed: Empty Data Exception" })
    }
    else {
        var flag = false
        fs.readFile(filePath, fileOptions, function (err, data) {
            if (err) {
                callback(err);
            }
            else {
                storyData = JSON.parse(data);
                for (var i = 0; i < storyData.length; i++) {
                    if (storyData[i].id == idData["id"]) {
                        storyData.splice(i, 1);
                        flag = true
                    }
                }
                if (flag) {
                    storyData = JSON.stringify(storyData);
                    fs.writeFile(filePath, storyData, function (error) {
                        if (error) {
                            callback(error)
                        }
                        else {
                            callback(null, "Deletion Successful");
                        }
                    });

                } else {
                    callback(null, "Deletion Failed: ID not found");
                }

            }

        });

    }

}


//This is the function to view all the public story 
function viewAllStory(callback) {
    var storyData = []
    var allData
    fs.readFile(filePath, fileOptions, function (err, data) {
        if (err) {
            callback(err);
        }
        else {
            allData = JSON.parse(data);

            for (var story of allData) {
                if (story.flag == "public") {
                    storyData.push(story)
                }
            }
            storyData = JSON.stringify(storyData);
            callback(null, storyData);
        }
    });
}

module.exports = { addNewStory, viewAllStory, deleteExistingStory, updateStoryContent, updateStoryHeadline, searchStory }



















