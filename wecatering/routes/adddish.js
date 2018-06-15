
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var dishmodel = require('../models/dish.js').Dish;
var mongoose = require('mongoose');
var uuidv1 = require('uuid/v1');
var redis = require('../redis/redisconfig.js');

var formidable = require('formidable');
var settings = require('../settings');
var configs = require('../userconfig');

var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });
var path = require('path');
var fs = require('fs');

var ERRORCODE = require('../errorcode');
/*
response code
ERRORCODE.FAIL:form error ,gm error
ERRORCODE.DBERR: mongo redis error
ERRORCODE.OK: any success
ERRORCODE.ILLEGAL: unkonwn type or token expired
ERRORCODE.LIMITED: over limit
 */

exports = module.exports = {
	get:function(req, res) {
		},

	post:function(req, res) {
		// console.log(req.headers.cookie);
		// typeof(req.body.act)!=='undefined'
		// check if req.body is empty object
		// Object.keys(req.body).length
		if(Object.keys(req.body).length!==0){
			// console.log('create or add')
			redis.get(req.body.user, function(err, token){
				if(err)
				{
			    	console.log(err);
			    	return res.json(ERRORCODE.DBERR);
				}
			    if (token!==req.body.token)
					return res.json(ERRORCODE.ILLEGAL);

				var queryuser = usermodel.findOne({'mobile': req.body.user}).exec();
				queryuser.then(function(result){
					if(req.body.data.title.length>7){
						req.body.data.title = req.body.data.title.slice(0,7);
					}
					// dish exist,just update
					if(req.body.data.dishid){
						/*console.log('update')
						console.log(req.body.data.dishid)
						console.log(req.body.data.shopid)*/
						// 注意前端传来的shopid必须是ObjectId
						// 设计过程中可以尽量直接使用系统_id，减少使用自己设计id带来的问题
						dishmodel.findOneAndUpdate({'id' : req.body.data.dishid},
				    		{$set:{
				    			title: 		req.body.data.title,
								price: 		req.body.data.price,
								discount: 	req.body.data.discount,
								category: 	req.body.data.category,
								shop: 		mongoose.Types.ObjectId(req.body.data.shopid)
				    		}},
				    		// {new: true},
				    		function(err, doc){
						    if(err){
						    	console.log(err);
						        return res.json(ERRORCODE.DBERR);
						    }
						    return res.json(ERRORCODE.OK);
						});
					}
					else{
					// dish do not exist,create new

						shopmodel.findOne({id:req.body.data.shopid},function(err,shopresult){
							if(err){
						    	console.log(err);
						        return res.json(ERRORCODE.DBERR);
						    }
						    if(shopresult.recipeCount<300){
						    	// add dish
						    	var newdish = new dishmodel({
									id:  		uuidv1(),
									title: 		req.body.data.title,
									price: 		req.body.data.price,
									discount: 	req.body.data.discount,
									category: 	req.body.data.category,
									owner: 		result._id,
									shop: 		shopresult._id,
									sampleImage: null,
									fullImage: 	null
									});

								newdish.save(function(err,newshop){
									if(err){
								    	console.log(err);
								        return res.json(ERRORCODE.DBERR);
								    }
								    // update recipeCount in shop
								    shopmodel.update({'id' : req.body.data.shopid},
								    	{$inc : {recipeCount:1}},
							    		function(err, doc){
									    if(err){
									    	console.log(err);
									    }
									});

						  			return res.json(ERRORCODE.OK);
								});
								
						    }
						    else{
						    	// return warning
						    	return res.json(ERRORCODE.LIMITED);
						    }
						})
					}
				})
				.fail(function (error) {
				    console.log(error);
				    return res.json(ERRORCODE.DBERR);
				});
			});
		}
		else{
			// 此处要做权限判断
			// 
			var form = new formidable.IncomingForm();
			var filePath;
			var dishid,x,y,width,height,imgType;
			form.parse(req);
			form.on('file', function (name, file){
		        filePath =file.path;
		    });
		    form.on('field', function (name, value){
		        switch(name){
		        	case 'x':{
		        		x =value;
		        		break;
		        	}
	        		case 'y':{
		        		y =value;
		        		break;
	        		}
	        		case 'width':{
		        		width =value;
		        		break;
	        		}
	        		case 'height':{
		        		height =value;
		        		break;
	        		}
	        		case 'dishid':{
		        		dishid =value;
		        		break;
		        	}
		        	case 'imgType':{
		        		imgType =value;
		        		break;
		        	}
	        		default:
	        			break;
		        }
		    });
			form.on('error', function(err) {
				console.log(err);
				return res.json(ERRORCODE.FAIL);
			});
			form.on('end', function() {
				var imgID = uuidv1();
				var baseDir =settings.PROJECT_DIR;
				if(imgType==='thumb'){
					if(typeof(x)!=='undefined'){
						// console.log('crop')
						imageMagick(filePath)
							.crop(width,height,x,y)
							.resize(100, 100, '!')
							.autoOrient()
							.write(baseDir+'/public/static/img/'+ imgID + '.jpg', function (err) {
							  	if (err) {
									console.log(err);
									return res.json(ERRORCODE.FAIL);
								}
								dishmodel.findOneAndUpdate({'id' : dishid},
						    		{$set:{
										sampleImage: imgID+'.jpg'
						    		}},
						    		{new: false},
						    		function(err, doc){
								    if(err){
								    	console.log(err);

								        return res.json(ERRORCODE.DBERR);
								    }
								    if(doc.sampleImage){
								    	fs.unlink(baseDir+'/public/static/img/'+doc.sampleImage, function(error) {
										    if (error) {
										        // throw error;
										        console.log(error)
										    }
										    // console.log('Deleted');
										});
								    }
								    
								    return res.json(ERRORCODE.OK);
								});

						});
					}
					else{
						// console.log('full resize')
						imageMagick(filePath)
							.resize(100, 100, '!')
							.autoOrient()
							.write(baseDir+'/public/static/img/'+ imgID + '.jpg', function (err) {
							  	if (err) {
									console.log(err);
									return res.json(ERRORCODE.FAIL);
								}
								dishmodel.findOneAndUpdate({'id' : dishid},
						    		{$set:{
										sampleImage: imgID+'.jpg'
						    		}},
						    		{new: false},
						    		function(err, doc){
								    if(err){
								    	console.log(err);
								        return res.json(ERRORCODE.DBERR);
								    }
								    if(doc.sampleImage){
								    	fs.unlink(baseDir+'/public/static/img/'+doc.sampleImage, function(error) {
										    if (error) {
										        // throw error;
										        console.log(error)
										    }
										    // console.log('Deleted');
										});
								    }
								    return res.json(ERRORCODE.OK);
								});

						});
					}
				}
				else if(imgType==='full'){
					imageMagick(filePath)
						.resize(360, 640)
						.autoOrient()
						.write(baseDir+'/public/static/img/'+ imgID + '.jpg', function (err) {
						  	if (err) {
								console.log(err);
								return res.json(ERRORCODE.FAIL);
							}
							dishmodel.findOneAndUpdate({'id' : dishid},
					    		{$set:{
									fullImage: imgID+'.jpg'
					    		}},
					    		{new: false},
					    		function(err, doc){
							    if(err){
							    	console.log(err);
							        return res.json(ERRORCODE.DBERR);
							    }
							    if(doc.fullImage){
							    	fs.unlink(baseDir+'/public/static/img/'+doc.fullImage, function(error) {
									    if (error) {
									        // throw error;
									        console.log(error)
									    }
									});
							    }
							    return res.json(ERRORCODE.OK);
							});

					});
				}
				else{
					return res.json(ERRORCODE.ILLEGAL);
				}

			});

		}
		
	}
}
