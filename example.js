var txNurse = require('./txNurse')

txNurse(1234, function(err, data) {
  if (!err) {
    console.log(data);
  }
})
