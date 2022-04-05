var express = require('express');
var spotifyRouter = express.Router();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const crypto = require('crypto')
require('dotenv').config({ path: './credentials.env' })
const {parse, stringify} = require('flatted');
  
console.log("PORT:", process.env.SPOTIFY_CLIENT_ID);
console.log("SPOTIFY_SECRET_ID:", process.env.SPOTIFY_SECRET_ID);
console.log("SPOTIFY_REFRESH_TOKEN:", process.env.SPOTIFY_REFRESH_TOKEN);
console.log("SPOTIFY_URL_REFRESH_TOKEN:", process.env.SPOTIFY_URL_REFRESH_TOKEN);
console.log("SPOTIFY_URL_NOW_PLAYING:", process.env.SPOTIFY_URL_NOW_PLAYING);
console.log("SPOTIFY_URL_RECENTLY_PLAY:", process.env.SPOTIFY_URL_RECENTLY_PLAY);

var SPOTIFY_CLIENT_ID=process.env.SPOTIFY_CLIENT_ID
var SPOTIFY_SECRET_ID= process.env.SPOTIFY_SECRET_ID
var SPOTIFY_REFRESH_TOKEN= process.env.SPOTIFY_REFRESH_TOKEN
var SPOTIFY_URL_REFRESH_TOKEN= process.env.SPOTIFY_URL_REFRESH_TOKEN
var SPOTIFY_URL_NOW_PLAYING= process.env.SPOTIFY_URL_NOW_PLAYING

const fetchRefreshToken = async() => {
    let form = {
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN
    }

    let config = {
        method: 'post',
        url: SPOTIFY_URL_REFRESH_TOKEN + `?grant_type=refresh_token&refresh_token=${SPOTIFY_REFRESH_TOKEN}`,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET_ID).toString('base64'))
        },
        body : form,
        json: true
    };
    
    return await axios(config)
}

spotifyRouter.get('*', function(req, res, next) {
    
    let response;
    try {
       //ToDo: 
       fetchRefreshToken().then((result) => {
            let ACCESS_TOKEN = result.data.access_token
        
            let config = {
                method: 'get',
                url: SPOTIFY_URL_NOW_PLAYING,
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': 'Bearer ' + ACCESS_TOKEN
                }
            };

            axios(config).then(async(response) => {
                console.log(response.data)
                res.json(await response.data)
            }).catch((e) => {
                console.log(e)
            })
            
       }).catch((err) => {console.log(err)})
    }catch(e) {
        response = {
            "error": "server failure",
            "message": {
                "string": "error"
            }
        }
        res.send(response)
    }   
});  


module.exports = spotifyRouter;
