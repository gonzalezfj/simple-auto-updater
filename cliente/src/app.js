///<reference path="typings/node/node.d.ts" />
var version_getter = require('./checkNewVersion.js');	
var zip_getter = require('./getZIP.js');	
var path  = require('path');
var speed_formatter = require('./bandwitdhSpeedHuman.js');
var nconf = require('nconf');
var fs = require('fs');
var Q = require('Q');

var self = this;
/**
 * Inicializa las opciones de configuración
 */
function init(file_config) {
	var defer = Q.defer();
	try {		
		var _file_config = file_config || './config.json';
		nconf.use('file', { file: path.join(__dirname, _file_config ) });	
		self.options = {
			local_package_json: path.join(__dirname, nconf.get('local_package_json')),
			remote_url_package_json: nconf.get('remote_url_package_json'),
			package_zip_url: nconf.get('package_zip_url'),
			installDir: path.join(__dirname, nconf.get('installDir'))
		};
		defer.resolve();
	} catch (error) {
		return defer.reject(error);
	}
	return defer.promise;
};
/**
 * Compara la versión local con la del servidor
 */
function comparar_versiones() {
	var defer = Q.defer();
	try {
		//CHECK LOCAL VERSION
		self.local = require(self.options.local_package_json);	
	} catch (error) {
		return defer.reject(error);		
	}	
	//CHECK REMOTE VERSION	
	version_getter.checkNewVersion(self.options.remote_url_package_json)
	.then(function (remote) {
		if(remote.version > self.local.version)
		{
			return defer.resolve(true);
		}else{
			return defer.resolve(false);
		}
	}, function (error) {
		return defer.reject(error);
	});
	return defer.promise;
}
/**
 * Descarga y Descomprime la nueva versión
 */
function descomprimir() {
	var defer = Q.defer();
	var zipTempPath = path.join(__dirname ,'./new' + self.local.version + '.zip');
	zip_getter.getZip(self.options.package_zip_url,zipTempPath)
		.then(function (zip) {
			zip.extractAllToAsync(self.options.installDir, true, function (error) {
				defer.resolve(borrarZip(zipTempPath));
				if(error) defer.reject(error);
			});
		},function (error) {
			defer.reject(error);
		}, function (progress) {
			defer.notify({
				percent: progress.percent,
				formated_speed: speed_formatter.toHuman(progress.speed)
			});
		});	
	return defer.promise;
}
function borrarZip(zipTempPath) {
	var defer = Q.defer();
	fs.unlink(zipTempPath, function (error) {
		defer.resolve();
		if (error) {
			defer.reject(error);
		}
	});
	return defer.promise;
}
module.exports.Init = init;
module.exports.comparar_versiones = comparar_versiones;
module.exports.descomprimir = descomprimir;
