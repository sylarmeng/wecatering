// var index = require('../public/index.html');
var path = require('path');
exports = module.exports = {
	get:function(req, res) {
			// console.log(path.dirname(require.main.filename))
			// console.log(req.headers.cookie);
			return res.sendFile(path.join(path.dirname(require.main.filename)+'/public/static/vendor.html'));
		}

}
