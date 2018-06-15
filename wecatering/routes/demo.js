// var index = require('../public/index.html');
// var path = require('path');
var fs = require('fs');

var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

exports = module.exports = {
	get:function(req, res) {
			// console.log(path.dirname(require.main.filename))
			// return res.sendFile(path.join(path.dirname(require.main.filename)+'/public/static/vendor.html'));
			var path = __dirname + '/guide/xw_demo.md';
			console.log(__dirname)
			var file = fs.readFile(path, 'utf8', function(err, data) {
				if(err) {
				  console.log(err);
				}
				/*var header = '<!DOCTYPE html>'+
		        '<html lang="zh-CN">'+
		        '<head>'+
		        '<title>欣味</title>'+
		        '<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.2/css/bootstrap.min.css">'+
		        '</head><body>';

			    var footer = '<script src="http://cdn.bootcss.com/jquery/1.11.2/jquery.min.js"></script>'+
			        '<script src="http://cdn.bootcss.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>'+
			        '</body></html>';

		        var body = marked(data.toString());
				return res.send(header+body+footer);*/

				var body = marked(data.toString());
				return res.render('demo', { markdown: body });
			});
		}

}
