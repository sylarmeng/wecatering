var express = require('express');
var router = express.Router();

var listmenu = require('./listmenu.js');
var home = require('./home.js');
var signup = require('./signup.js');
var signin = require('./signin.js');

var order = require('./order.js');
var shop = require('./shop.js');

var addshop = require('./addshop.js');
var getshop = require('./getshop.js');
var waiter = require('./waiter.js');

var adddish = require('./adddish.js');
var getdish = require('./getdish.js');
var deldish = require('./deldish.js');
//get order list
var getorder = require('./getorder.js');
var orderupdate = require('./orderupdate.js');

var report = require('./report.js');
// 设置商户选项
var setoption = require('./setoption.js');
// 客户查询
var queryorder = require('./queryorder.js');

var client = require('../redis/redisconfig.js');
var limiter = require('express-limiter')(router, client);

// user guide
var guide = require('./guide');
var demo = require('./demo');

router.get('/', home.get);
router.get('/guide', guide.get);
router.get('/demo', demo.get);

router.get('/signup',
	limiter({ lookup: 'headers.x-forwarded-for',
	total: 20,
  	expire: 1000 * 60*60}), signup.get);
// 每小时最多一百次请求
router.post('/signup',
	limiter({ lookup: 'headers.x-forwarded-for',
	total: 100,
  	expire: 1000 * 60*60}), signup.post);

router.post('/signin', signin.post);

//这个接口仅做测试用，生产时更改为有严格条件判断的接口
router.get('/api/listmenu/:id', listmenu.get);
router.post('/api/listmenu', listmenu.post);

router.post('/api/addshop', addshop.post);
router.post('/api/getshop', getshop.post);

router.post('/api/waiter', waiter.post);
// router.post('/api/adddish',adddish.post);
// 每天最多150次添加订单请求
// router.post('/api/adddish',adddish.post);

router.post('/api/adddish',
	limiter({ lookup: 'headers.x-forwarded-for',
	total: 2000,
  	expire: 1000 * 60*60*12}),adddish.post);


router.post('/api/getdish', getdish.post);
router.post('/api/deldish', deldish.post);

router.post('/api/getorder', getorder.post);
router.post('/api/orderupdate', orderupdate.post);

router.post('/api/report', report.post);
// 设置用户选项，如订单显示模式、订单列表数量
router.post('/api/setoption', setoption.post);
// router.get('/p/:id', order.get);
router.post('/api/queryorder', queryorder.post);

router.get('/p/:id/:t', order.get);
// router.get('/shop/*', shop.get);
router.get('/shop*', shop.get);

router.get('*', function(req, res) {
    return res.redirect('/')
})

module.exports = router;
