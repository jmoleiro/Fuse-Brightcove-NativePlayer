/*
Brightcove Video Player 
*/
//Imports
var Observable = require("FuseJS/Observable");
var Timer = require("FuseJS/Timer");
var bcapi = require('/BCPlayer/scripts/bcapi.js');
var config = require('/BCPlayer/config.js');
var xml2json = require('/BCPlayer/scripts/from-xml.js').fromXML;

//Declarations
var has_video = new Observable(false);
var show_controls = new Observable(false);

var video_url = new Observable("");
var _bc_account = '';
var _bc_video = '';

//Initial Values
has_video.value = false;
show_controls.value = false;

//Functions
var tryPlay = function() {
    if (_bc_video != "") {
        if (_bc_account != "") {
            playVideo(_bc_video);
        } 
    }
}

var playVideo = function(video_id) {
    _bc_video = video_id;
    playBrightCove();
}

var loadBrightCove = function() {
    bcapi.getVideoInfo(_bc_account, _bc_video, function(videourl) {
        video_url.value = videourl;
        has_video.value = true;
        this.VideoPlayer.Play();
    });
}

var track_action = function(url) {
    if (url != "") {
        fetch(url, { method: 'GET' } );
    }
}

var toggleControls = function() {
    show_controls.value = !show_controls.value;
}

var playBrightCove = function() {
    loadBrightCove();
}

//Binds
this.videoID.onValueChanged(module, function(item) {
    _bc_video = item;
    tryPlay();
});

this.accountID.onValueChanged(module, function(item) {
    _bc_account = item;
    tryPlay();
});

//Exports
module.exports = {
    playVideo: playVideo,
    playBrightCove: playBrightCove,
    has_video: has_video,
    video_url: video_url,
    show_controls: show_controls,
    toggleControls: toggleControls
}