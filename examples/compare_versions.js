(function () {
	var self = this;
	//CHECK LOCAL VERSION
	self.pjson = require('../package.json');
	console.log("Local version", self.pjson.version);
	//CHECK REMOTE VERSION
	var version_getter = require('./checkNewVersion.js')
	version_getter.checkNewVersion('http://localhost/package.json')
	.then(function (result) {
		console.log("Remote version: ", result.version);
		console.log("Comparison result: ", result.version > self.pjson.version);
	}, function (error) {
	    console.error(error);
	});
})();