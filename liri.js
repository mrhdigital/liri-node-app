// required packages
//---------------------------------------

require("dotenv").config();
// import the keys files
var keys = require('./keys.js');
// import the twitter nmp package.
var Twitter = require('twitter');
// import the node-spotify-api npm package
var Spotify = require('node-spotify-api');
// import the request npm package
var request = require('request');
// import the fs package for read and write
var fs = require("fs");

// getMyTweet function
var getMyTweets = function() {
 
var client = new Twitter(keys.twitter);
 
var params = {screen_name: 'mrhdigitalalias', count:20};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    //console.log(tweets);

    var beginEntry = "=============== LOG ENTRY BEGIN ===============\r\n" + Date() + 
    "\r\n \r\nTERMINAL COMMANDS:\r\n$: twitter\r\n \r\nDATA OUTPUT:\r\n"

writeToLogTxt(beginEntry)

console.log("");
console.log("Last 20 Tweets:")




    for(var i = 0; i<tweets.length; i++) {
        var number = i+1;
        console.log("");
        console.log([i+ 1] + "." + tweets[i].text);
        console.log("Created on: " + tweets[i].created_at);
        console.log(' ');

        var output = number + ". Tweet: " + tweets[i].text + "\r\nCreated at: " + tweets[i].created_at + " \r\n" +
                             "=============== LOG ENTRY END ===============\r\n \r\n"

        writeToLogTxt(output)
    }
  }
});

}

var getArtistNames = function(artist) {
    return artist.name;
}
// getMwSpotify function
var getMeSpotify = function(songName) {
  if(songName === undefined) {
      songName = "The Sign";
  }
    var spotify = new Spotify(keys.spotify); 

 
spotify.search({ type: 'track', query: songName }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 
    // Do something with 'data'
    //console.log(data);
    //console.log(data.tracks.items[0]);
    var songs = data.tracks.items;
    for(var i = 0; i<songs.length; i++) {
        console.log(i);
        console.log('artists(s): ' + songs[i].artists.map(getArtistNames));
        console.log('song name: ' + songs[i].name);
        console.log('preview songs: ' + songs[i].preview_url);
        console.log('album: ' + songs[i].album.name);
        console.log('-------------------------------------------------------');

    }
    });
}

var getMeMovie = function(movieName) {
request('http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&r=json&apikey=trilogy', 
function (error, response, body) {
  if (!error && response.statusCode == 200) { 
 // console.log(body); // Print the HTML for the Google homepage.
 var jsonData = JSON.parse(body);

 console.log('Title: ' + jsonData.Title);
 console.log('Year: ' + jsonData.Year);
 console.log('IMDB Rating: ' + jsonData.imdbRating);
 console.log('Country ' + jsonData.Country);
 console.log('Language: ' + jsonData.Language);
 console.log('Plot: ' + jsonData.Plot);
 console.log('Actors: ' + jsonData.Actors);
 console.log('Rotten tomatoes rating: ' + jsonData.tomatoRating);
 console.log('Roten tomatoes URL: ' + jsonData.tomatoURL);
  }
});
}

var doWhatItSays = function() {
fs.readFile('random.txt', 'utf8', function (err, data) {
    if(err) throw err;
    //console.log(data);
    var dataArr = data.split(', ');

    if (dataArr.length == 2) {
        pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
        pick(dataArr[0]);
    }
});
}

    var pick = function(caseData, functionData) {
        switch(caseData) {
            case 'my-tweets' :
                getMyTweets();
                
                
                break;
            case 'spotify-this-song':
                getMeSpotify(functionData);
                break; 
            case 'movie-this':
                getMeMovie(functionData);
                break; 
            case 'do-what-it-says':
                doWhatItSays();
                break;            
            default:
            console.log('LIRI does not know that');    

        }
    }

    var runThis = function(argOne, argTwo) {
        pick(argOne, argTwo);

    };

    runThis(process.argv[2], process.argv[3]);

    //Write each request to log.txt
    function writeToLogTxt(output) {
        fs.appendFile("log.txt", output, function(error){
            if(error) {
                console.log(error)
            }
        })
    }