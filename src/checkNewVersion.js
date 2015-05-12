///<reference path="typings/node/node.d.ts" />
///<reference path="typings/q.d.ts" />
var request = require('request');
var Q = require('Q');
/**
 * Retorna un json de la ´version_url´
 */
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
        try{
            var result = JSON.parse(body);
        }catch(e){
            defer.reject(e);
        }
        defer.resolve(result);
    })
    .on('error', function(e) {
      if (e) 
        defer.reject(e);
    });
    return defer.promise;
};
module.exports.checkNewVersion = checkNewVersion;