///<reference path="typings/node/node.d.ts" />
var version_getter = require('./checkNewVersion.js');	
var zip_getter = require('./getZIP.js');	
var path  = require('path');
var speed_formatter = require('./bandwitdhSpeedHuman.js');
var nconf = require('nconf');
var fs = require('fs');
var Q = require('Q');

var options,peticion_actual, local;
/**
 * Inicializa las opciones de configuración
 */
function init(file_config) {
	var defer = Q.defer();
	try {		
		var _file_config = file_config || './config.json';
		nconf.use('file', { file: _file_config  });	
		options = {
			local_package_json: nconf.get('local_package_json'),
			remote_url_package_json: nconf.get('remote_url_package_json'),
			package_zip_url: nconf.get('package_zip_url'),
			installDir: nconf.get('installDir')
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
		local = require(options.local_package_json);	
	} catch (error) {
		return defer.reject(error);		
	}	
	//CHECK REMOTE VERSION	
	version_getter.checkNewVersion(options.remote_url_package_json)
	.then(function (remote) {
		if(remote.version > local.version)
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
function actualizar() {
	var defer = Q.defer();
	var zipTempPath = path.join(__dirname ,'./new' + local.version + '.zip');
	peticion_actual = zip_getter.getZip(options.package_zip_url + './new' + local.version + '.zip',zipTempPath);
	peticion_actual.then(function (zip) {
			zip.extractAllToAsync(options.installDir, true, function (error) {				
				if(error)
				{ 
					defer.reject(error);
				}else{
					defer.resolve(borrarZip(zipTempPath));
				}
			});
		},function (error) {
			defer.reject(error);
		}, function (progress) {
			defer.notify({
				percent: progress.percent,
				formatted_speed: speed_formatter.toHuman(progress.speed),
				remaining_time: progress.remaining_time
			});
		});	
	return defer.promise;
}
function abortar(){
	if(peticion_actual)
	{
		peticion_actual._extra.abortar();
	}
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
module.exports.abortar = abortar;
module.exports.comparar_versiones = comparar_versiones;
module.exports.actualizar = actualizar;