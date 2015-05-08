///<reference path="typings/node/node.d.ts" />
///<reference path="typings/q.d.ts" />
var request = require('request');
var Q = require('Q');

function checkNewVersion(version_url) {
	var defer = Q.defer();
    /**
     * Url de petición http
     */
    var url = version_url || 'http://localhost/package.json';
    var body = '';
    request(url)
    .on('data', function(chunk) {
        body += chunk;
    })
    .on('end', function() {           
        var result = JSON.parse(body);
        defer.resolve(result);
    })
    .on('error', function(e) {
      if (e) 
        defer.reject(e);
    });
    return defer.promise;
};
module.exports.checkNewVersion = checkNewVersion;