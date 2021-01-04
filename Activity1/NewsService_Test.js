//This is the TEST file for the NewsStory API's
var newsService = require("./NewsService.js");
var fs = require('fs')
//The File which stores the story data
var filePath = "./NewsStory.txt"
var fileOptions = { encoding: 'utf8', flag: 'r' }
//Helper Functions to read  public data
function getAllPublicdata(callback) {
    var storyData = []
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
// helper function to get all the data from the story file(botjh public and private)
function getAlldata(callback) {
    var allData
    fs.readFile(filePath, fileOptions, function (err, data) {
        if (err) {
            callback(err);
        }
        else {
            allData = JSON.parse(data);
            allData = JSON.stringify(allData);
            callback(null, allData);
        }
    });
}


//This function is used to test the adding the story functionality
// Here we will check the number of keys passed, if the number of keys passed is not 5 
//  then we'll get an Bad data expection.
// If we pass empty data we get a empty data expection.
// The null data expection is handled in the server, since it'll be a bad formatted payload.
function TestaddNewStory(newStory, callback) {
    var output
    var errOutput
    newsService.addNewStory(newStory, function (err, resp) {
        if (err) {
            errOutput = JSON.stringify(err)
            callback(errOutput)
        }
        else {
            output = resp
            callback(output)
        }
    })
}
//You can modify the "var newStory" data to add a different story
var newStory = { "author": "author2", "title": "story app", "flag": "public", "content": "this is story app", "date": "08/12/2020" }
//*****Uncomment this to test the ADD New story functionality ********/

// TestaddNewStory(newStory,function (resp) {
//     console.log("Test Add Story Result : " + resp)
// })


//*******Test Function for View all public story */
function TestViewAllStory(callback) {
    var output
    var errOutput
    var allFileData
    getAllPublicdata(function (err, data) {
        if (err) {
            errOutput = "Testing failed: Error in reading the data"
            callback(errOutput)
        }
        else {
            allFileData = data
            newsService.viewAllStory(function (err, resp) {
                if (err) {
                    errOutput = err
                    callback(errOutput)
                } else {
                    if (JSON.stringify(allFileData) === JSON.stringify(resp)) {
                        output = "Testing Passed: View all story Successfull"
                        callback(output)
                    }

                }
            })
        }
    })

}

//*****Uncomment this to test the view all public story functionality *******/

// TestViewAllStory(function (resp) {
//     console.log("Test View Story Result : " + resp)
// })


//Test function for the Update Headline functionality
function TestUpdateHeadline(headlineData, callback) {
    var output = "Testing failed: Error in Updating the story heading"
    var errOutput
    var allFileData

    newsService.updateStoryHeadline(headlineData, function (err, resp) {
        if (err) {
            errOutput = "Testing failed: Error in Updating the story heading"
            callback(errOutput)
        } else {
            getAlldata(function (err, data) {
                if (err) {
                    errOutput = "Testing failed: Error in reading the data"
                    callback(errOutput)
                }
                else {
                    allFileData = JSON.parse(data)
                    for (var story of allFileData) {
                        if (story.title == headlineData.newTitle) {
                            output = "Testing Passed: Update story headline Successfull"
                        }
                    }
                    callback(output)

                }

            })

        }
    })
}

//You can modify the "var headlineData" data to modify the a differnt data,
// all the data will be in NewsStory.txt

var headlineData = { "oldTitle": "story apple", "newTitle": "story applessss" }
//*****Uncomment this to test the Update Headline of story functionality *******/

// TestUpdateHeadline(headlineData,function (resp) {
//     console.log("Test Update story headline Result : " + resp)
// })


//This is the test function for updating the story content
function TestUpdateStoryContent(contentData, callback) {
    var output = "Testing failed: Error in Updating the story content"
    var errOutput
    var allFileData

    newsService.updateStoryContent(contentData, function (err, resp) {
        if (err) {
            errOutput = "Testing failed: Error in Updating the story content"
            callback(errOutput)
        } else {
            getAlldata(function (err, data) {
                if (err) {
                    errOutput = "Testing failed: Error in reading the data"
                    callback(errOutput)
                }
                else {
                    allFileData = JSON.parse(data)
                    for (var story of allFileData) {
                        if ((story.title == contentData.title) && (story.content == contentData.content)) {
                            output = "Testing Passed: Update story content Successfull"
                        }
                    }
                    callback(output)

                }

            })

        }
    })
}
//You can modify the "var contentData" data to modify the a differnt data,
// all the data will be in NewsStory.txt

var contentData = { "title": "story apple", "content": "this is the new story applesss" }

//*****Uncomment this to test the Update Content of story functionality *******/

// TestUpdateStoryContent(contentData,function (resp) {
//     console.log("Test Update story content Result : " + resp)
// })


//Test Function to test the  deletion functionality a story
function TestDeleteStory(deleteData, callback) {
    var errOutput

    newsService.deleteExistingStory(deleteData, function (err, resp) {
        if (err) {
            errOutput = "Testing failed: Error in Deleting the story"
            callback(errOutput)
        } else {
            callback(resp)
        }
    })
}

//You can modify the "var deleteData" data to modify the a differnt data,
// all the data will be in NewsStory.txt

var deleteData = { "id": "4" }
//*****Uncomment this to test the deletion of story functionality *******/
// TestDeleteStory(deleteData,function (resp) {
//     console.log("Test Deleting Story Result : " + resp)
// })

//*****Uncomment this to test the edge case of deletion of story functionality *******/

//Deleting the id twice will result in deleting a id which doesn't exist exception

// var deleteData = { "id": "4" }
// TestDeleteStory(deleteData,function (resp) {
//     console.log("Test Deleting Story Result : " + resp)
// })



//Test case for searching (A: title and C:Author)
//Search data is object with four parameters: title, author, start date and end date
function TestSearchStory(searchData, callback) {
    var output = "Testing failed: Error in Searching the story"
    var errOutput
    var searchDataResult

    newsService.searchStory(searchData, function (err, resp) {
        if (err) {
            errOutput = "Testing failed: Error in Searching the story"
            callback(errOutput)
        } else {
            searchDataResult = JSON.parse(resp);
            console.log(searchDataResult)
            for(var story of searchDataResult){
                if((story.title == searchData.title) || (story.author == searchData.author)||(story.startDate <= searchData.date)||(story.endDate > searchData.date)){
                    output = "Testing Passed: Searching data is retrieved"
                }
            }
            
            callback(output)

        }
    })

}
//a and c (Search parameters: Title and Author)
// var searchData = { "title": "story apple", "startDate": "", "endDate": "" ,"author": "author1"}

//a (Search parameters: Title )
// var searchData = { "title": "story apple", "startDate": "", "endDate": "" ,"author": ""}

//c (Search parameters: Author)
// var searchData = { "title": "", "startDate": "", "endDate": "" ,"author": "author1"}

//b (Search parameters: Date range)
// var searchData = { "title": "", "startDate": "05/01/2020", "endDate": "10/10/2020" ,"author": ""}

//a,b,c (Search parameters: Title, start date, end date, Author)
var searchData = { "title": "story apple", "startDate": "05/01/2020", "endDate": "10/10/2020" ,"author": "author1"}

// TestSearchStory(searchData,function (resp) {
//         console.log("Test Searching Story Result : " + resp)
//     })

