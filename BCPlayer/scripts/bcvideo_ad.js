/*
Brightcove Video Player With Double Click Ads Support
*/
//Imports
var Observable = require("FuseJS/Observable");
var Timer = require("FuseJS/Timer");
var dfp = require('/BCPlayer/scripts/dfp.js');
var bcapi = require('/BCPlayer/scripts/bcapi.js');
var config = require('/BCPlayer/config.js');
var xml2json = require('/BCPlayer/scripts/from-xml.js').fromXML;

//Declarations
var has_video = new Observable(false);
var has_ads = new Observable(false);
var show_skip = new Observable(false);
var _has_Ad_Url = new Observable(false);
var show_controls = new Observable(false);

var video_ad = new Observable("");
var _ads_click_url = new Observable("");
var video_url = new Observable("");
var _start_track_url = "";
var _fqt_track_url = "";
var _half_track_url = "";
var _tqt_track_url = "";
var _end_track_url = "";
var _skip_track_url = "";
var _skip_enabled = false;
var _ad_url = config.ad_url;
var _base_url = config.base_url;
var _app_name = config.app_name;
var skip_ad_label = config.skip_ad_label;
var _bc_account = '';
var _bc_video = '';
var _duration = 0;
var _skipped = 0;
var _ad_playing = 1;

//Initial Values
has_video.value = false;
has_ads.value = false;
show_skip.value = false;
_has_Ad_Url.value = false;
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
    loadAd();
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

var trackSkip = function() {
    _skipped = 0;
    track_action(_skip_track_url);

}

var toggleControls = function() {
    show_controls.value = !show_controls.value;
}

var playBrightCove = function() {
    loadBrightCove();
}

var endAdReach = function() {
    if (_ad_playing == 1) {
        _ad_playing = 0;
        playBrightCove();
    }
}

var loadAd = function() {
    _ad_url = _ad_url.replace("[referrer_url]", _base_url + _bc_video);
    _ad_url = _ad_url.replace("[description_url]", _app_name + _bc_video);    
    _ad_url = _ad_url.replace("[timestamp]", Date.now());
    dfp.requestAd(_ad_url, function(adXml) {
        result = xml2json(adXml);

        adObj = result;  
        if (result["VAST"].Ad != null) {
            //URL de impresion
            _impression_url = result["VAST"].Ad.InLine.Impression;
            //Duracion del Ad (Declarada)
            _ad_duration = result["VAST"].Ad.InLine.Creatives.Creative.Linear.Duration;
            //Array de tracking
            _ads_tracking = result["VAST"].Ad.InLine.Creatives.Creative.Linear.TrackingEvents.Tracking;
            //Click action
            _ads_click_url.value = result["VAST"].Ad.InLine.Creatives.Creative.Linear.VideoClicks.ClickThrough["#"];                
            if (_ads_click_url.value != "") {
                _has_Ad_Url.value = true;
            }
            //Video Assets
            _ads_videos = result["VAST"].Ad.InLine.Creatives.Creative.Linear.MediaFiles.MediaFile;

            h_duration = new Date('1970-01-01T' + _ad_duration + 'Z');

            _duration = (((h_duration.getMinutes() * 60) + h_duration.getSeconds()) * 1000) / 4;

            //buscamos las urls de tracking
            for (let index = 0; index < _ads_tracking.length; index++) {
                const element = _ads_tracking[index];
                //console.log(JSON.stringify(element));
                if (element["@event"] == "start") {
                    _start_track_url = element["#"];
                }
                if (element["@event"] == "firstQuartile") {
                    _fqt_track_url = element["#"];
                }
                if (element["@event"] == "midpoint") {
                    _start_track_url = element["#"];
                }
                if (element["@event"] == "thirdQuartile") {
                    _tqt_track_url = element["#"];
                }
                if (element["@event"] == "complete") {
                    _start_track_url = element["#"];
                }
                if (element["@event"] == "skip") {
                    _skip_enabled = true;
                    _skip_track_url = element["#"];
                }
            }
            //

            //Buscamos el video a mostrar
            for (let index = 0; index < _ads_videos.length; index++) {
                const element = _ads_videos[index];
                if (element["@type"].indexOf("/mp4") != -1) {
                    console.log(element["@height"]);
                    if (video_ad.value == "") {
                        video_ad.value = element["#"];
                        has_ads.value = true;

                        Timer.create(function() {
                            if (_skipped == 0) {
                                track_action(_fqt_track_url);
                            }
                        }, _duration, false);
                    
                        Timer.create(function() {
                            if (_skipped == 0) {
                                track_action(_half_track_url);
                            }
                        }, _duration * 2, false);
                    
                        Timer.create(function() {
                            if (_skipped == 0) {
                                track_action(_tqt_track_url);
                            }
                        }, _duration * 3, false);
                    
                        Timer.create(function() {
                            if (_skipped == 0) {
                                track_action(_end_track_url);
                            }
                        }, _duration * 4, false);                        

                        track_action(_impression_url);
                        track_action(_start_track_url);

                        //Skip button
                        if (_skip_enabled) {
                            Timer.create(function() {
                                show_skip.value = true;
                            }, 5000, false);
                        }
                    }
                }
            }
        } else {
            playBrightCove();
        }
    });    
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

this.adPlay.onValueChanged(module, function(item) {
    if (_duration > 0) {

    }
});

//Exports
module.exports = {
    has_ads: has_ads,
    video_ad: video_ad,
    playVideo: playVideo,
    show_skip: show_skip,
    playBrightCove: playBrightCove,
    trackSkip: trackSkip,
    hasAdUrl: _has_Ad_Url,
    ads_click_url: _ads_click_url,
    has_video: has_video,
    video_url: video_url,
    show_controls: show_controls,
    toggleControls: toggleControls,
    endAdReach: endAdReach,
    skip_ad_label: skip_ad_label
}