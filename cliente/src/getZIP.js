///<reference path="typings/node/node.d.ts" />
var Zip = require('adm-zip');
var request = require('request');
var fs = require('fs');
var progress = require('request-progress');
var url = require('url');
var Q = require('q');

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
    var peticion_actual;
    /**
     * Opciones de petición http
     */
    var file_url = zip_url;
    var defer = Q.defer();
    peticion_actual = progress(request(file_url), {
        throttle: 500
    });
    peticion_actual.on('progress', onProgress)
    .on('end', endPetition)
    .on('error', onError)
    .pipe(fs.createWriteStream(zip_path));
    
    /**
     * Finaliza abruptamente la descarga actual
     */
    defer.promise._extra = {
        abortar: function(){
            peticion_actual.abort();
            defer.reject("Cancelado");
        }
    };
    return defer.promise;
    /**
     * Indica el progeso de la descarga
     */
    function onProgress(state) {
        var elapsed = 0.001 * ((new Date()) - self.time_start);
        var _remaining_time = ((100 - state.percent) * elapsed) / state.percent;
        var progress = {
            percent: state.percent,
            speed: (state.total * state.percent * 0.01) / elapsed,
            remaining_time: Math.round(_remaining_time)
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