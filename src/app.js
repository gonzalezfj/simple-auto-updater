(function () {	
	var version_getter = require('./checkNewVersion.js');	
	var zip_getter = require('./getZIP.js');	
	var speed_formatter = require('./bandwitdhSpeedHuman.js');
	var self = this;
	
	//CHECK LOCAL VERSION
	self.local = require('../package.json');
	console.log("Local version", self.local.version);
	
	//CHECK REMOTE VERSION	
	version_getter.checkNewVersion('http://localhost/package.json')
	.then(function (remote) {
		console.log("Remote version: ", remote.version);
		console.log("Comparison result: ", remote.version > self.local.version);
		if(remote.version > self.local.version)
		{
			zip_getter.getZip('http://gonzalezfj.com.ar/output.dat')
			.then(function (zip) {
				var zipEntries = zip.getEntries();
				console.log(zipEntries.length);
			},function (error) {
				console.log(error);
			}, function (progress) {
			    console.log("percent: " + progress.percent);
			    console.log("Speed: " + speed_formatter.toHuman(progress.speed));
			});	
		}		
	}, function (error) {
	    console.error(error);
	});
})();