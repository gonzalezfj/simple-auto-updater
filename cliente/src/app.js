///<reference path="typings/node/node.d.ts" />
var version_getter = require('./checkNewVersion.js');	
var zip_getter = require('./getZIP.js');	
var path  = require('path');
var speed_formatter = require('./bandwitdhSpeedHuman.js');
var nconf = require('nconf');
var fs = require('fs');

nconf.use('file', { file: path.join(__dirname, 'config.json') });

var self = this;

self.options = {
	local_package_json: path.join(__dirname, nconf.get('local_package_json')),
	remote_url_package_json: nconf.get('remote_url_package_json'),
	package_zip_url: nconf.get('package_zip_url'),
	installDir: path.join(__dirname, nconf.get('installDir'))
};

function init(params) {
	//CHECK LOCAL VERSION
	self.local = require(self.options.local_package_json);
	console.log("Local version", self.local.version);		
	//CHECK REMOTE VERSION	
	comparar_version();
};

function comparar_version() {
	version_getter.checkNewVersion(self.options.remote_url_package_json)
	.then(function (remote) {
		console.log("Remote version: ", remote.version);
		console.log("New version result: ", remote.version > self.local.version);
		if(remote.version > self.local.version)
		{
			descomprimir();
		}		
	}, function (error) {
	    console.error(error);
	});
}

function descomprimir() {
	var zipTempPath = path.join(__dirname ,'./new' + self.local.version + '.zip');
	zip_getter.getZip(self.options.package_zip_url,zipTempPath)
		.then(function (zip) {
			zip.extractAllToAsync(self.options.installDir, true, function (error) {
				borrarZip(zipTempPath);
				if(error) console.log(error);
			});
		},function (error) {
			console.log(error);
		}, function (progress) {
		    console.log("percent: " + progress.percent);
		    console.log("Speed: " + speed_formatter.toHuman(progress.speed));
		});	
}
function borrarZip(zipTempPath) {
	fs.unlink(zipTempPath, function (err) {
		if (err) {
			console.log(err);
		}
	});
}
init();