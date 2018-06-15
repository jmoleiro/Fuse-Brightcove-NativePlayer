var requestAd = function(url, callback) {
    var _ad_url = url;    
    fetch(_ad_url, { method: 'GET' } )
    .then(function(response) { 
        return response.text();
    }).then(function(responseTxt) {        
        return callback(responseTxt);
    });
}

module.exports = {
    requestAd: requestAd
}