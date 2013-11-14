var express = require('express');
var fs = require('fs');
var path=require('path');
var app = express.createServer(express.logger());
app.configure(function(){
 app.use(express.static(path.join(__dirname,'public')));
});
app.get('/', function(request, response) {
  var buf= new Buffer(fs.readFileSync('index.html'),'utf-8');
  response.send(buf.toString());
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
