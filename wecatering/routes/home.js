
exports = module.exports = {
	get:function(req, res) {
			// console.log('get home---------------------')
			return res.render('home', { title: '欣味' });
		}

}
