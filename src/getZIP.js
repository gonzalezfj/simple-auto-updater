///<reference path="typings/node/node.d.ts" />
var AdmZip = require('adm-zip');
var request = require('request');
var progress = require('request-progress');
var url = require('url');
var Q = require('Q');

/**
 * getNewVersionZip
 * Obtiene un zip desde URL dada
 * ongoing_url: Url donde esta el ZIP a buscar
 * callback: funcion que trata el ZIP recibido
 * 
 * Ejemplo:
 *  var zip_getter = require('./getZIP.js');
 *  zip_getter.getZip('http://localhost/facu.zip')
 *  .then(function (zip) {
 * 	    var zipEntries = zip.getEntries();
 * 	    console.log(zipEntries.length);
 *	});	
 *   
 */
var getNewVersionZip = function(ongoing_url) {
    /**
     * Scope extend
     */
    var self = this;
    self.time_start = new Date();
    /**
     * Opciones de petición http
     */
    var file_url = ongoing_url || 'http://localhost/facu.zip';
    var defer = Q.defer();
    self.data = [];
    self.dataLen = 0;
    progress(request(file_url))
    .on('data', receiveChunks)
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
        }
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
     * Datos recibidos del servidor en partes
     */
    function receiveChunks(chunk) {
        self.data.push(chunk);
        self.dataLen += chunk.length;        
    } 
    /**
     * Fin de la petición, el zip se ha descargado correctamente
     */
    function endPetition() {
        var buf = new Buffer(self.dataLen);
        for (var i=0, len = self.data.length, pos = 0; i < len; i++) { 
            self.data[i].copy(buf, pos); 
            pos += self.data[i].length; 
        }     
        var zip = new AdmZip(buf);
        defer.resolve(zip);
    }
};
module.exports.getZip = getNewVersionZip;