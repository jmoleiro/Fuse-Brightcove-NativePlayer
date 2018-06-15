

var Base64 = require("/BCPlayer/scripts/base64.js");
var config = require('/BCPlayer/config.js');
var client_id = config.bc_client_id;
var client_secret = config.bc_client_secret;

var access_token = "";
var token_type = "";
var access_token_expires = new Date();

var getVideoInfo = function(account, videoid, callback) {
    console.log('Fetch');
    var auth_string = Base64.encode(client_id + ":" + client_secret);
    fetch('https://oauth.brightcove.com/v4/access_token', { method: 'POST', body: 'grant_type=client_credentials',
    headers: {
              'Authorization': 'Basic ' + auth_string,
              'Content-Type': 'application/x-www-form-urlencoded'
          } } )
    .then(function(response) { 
        console.log('Get Auth');
        var auth = JSON.parse(response._bodyText);
        access_token = auth.access_token;
        token_type = auth.token_type;
        var url = "https://cms.api.brightcove.com/v1/accounts/"+account+"/videos/"+videoid+"/sources";
        console.log(token_type + ' ' + access_token);
        fetch(url, { method: 'GET', 
        headers: {
                    'Authorization': token_type + ' ' + access_token
        } } )
        .then(function(response) { 
            resp = JSON.parse(response._bodyInit) ;
            for (let index = 0; index < resp.length; index++) {
                const element = resp[index];
                //Fecth 720p video
                if (element.codec == "H264") {
                    if (element.height = "720") {
                        callback(element.src);
                    }
                }
            }
        });          
    });
}

module.exports = {
    getVideoInfo: getVideoInfo
}