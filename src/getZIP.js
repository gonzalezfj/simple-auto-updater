///<reference path="typings/node/node.d.ts" />
var Zip = require('adm-zip');
var request = require('request');
var fs = require('fs');
var progress = require('request-progress');
var url = require('url');
var Q = require('Q');

/**
 * getHTTPZip
 * Obtiene un zip desde URL dada
 * zip_url: Url donde esta el ZIP a buscar
 * zip_path: lugar a donde se almacenará el zip
 * Retorna el zip listo para usarse
 * 
 * Ejemplo:
 *  var zip_getter = require('./getZIP.js');
 *  zip_getter.getZip('http://localhost/facu.zip','./facu.zip')
 *  .then(function (zip) {
 * 	    var zipEntries = zip.getEntries();
 * 	    console.log(zipEntries.length);
 *	});	
 *   
 */
var getHTTPZip = function(zip_url,zip_path) {
    /**
     * Scope extend
     */
    var self = this;
    self.time_start = new Date();
    /**
     * Opciones de petición http
     */
    var file_url = zip_url;
    var defer = Q.defer();
    progress(request(file_url))
    .pipe(fs.createWriteStream(zip_path))
    .on('progress', onProgress)
    .on('end', endPetition)
    .on('error', onError);
    
    return defer.promise;
    /**
     * Indica el progeso de la descarga
     */
    function onProgress(state) {
        var endTime = new Date();
        var elapsed = 0.001*(endTime - self.time_start);
        var progress = {
            percent: state.percent,
            speed: (state.total * state.percent * 0.01) / elapsed
        };
        defer.notify(progress);
    }
    /**
     * Devuelve un error en forma de promesa rechazada
     */
    function onError(e) {
      if (e) 
        defer.reject(e);
    }
    /**
     * Fin de la petición, el zip se ha descargado correctamente
     */
    function endPetition() {        
        var pack = new Zip(zip_path);
        defer.resolve(pack);
    }
};
module.exports.getZip = getHTTPZip;