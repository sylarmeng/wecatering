var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'deep2017';

exports.encrypt = function (text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

/*exports.encrypt = function (text){
  // test return original password
  return text;
}*/
 
exports.decrypt = function (text){
  console.log(text);
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

/*

exports.method = function() {};
exports.otherMethod = function() {};
or 
module.exports = {
    method: function() {},
    otherMethod: function() {}
}
 */