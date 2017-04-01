var requestify = require('requestify');

function RestClient(){
    this.config = null;
}

RestClient.prototype.setConfig = function(config){
    this.config = config;
};
// RestClient.prototype.MakeRequest = function(webRequest, success) {
//   var dataString = JSON.stringify(data);
//   var host = webRequest.host, endpoint = webRequest.endpoint, method = webRequest.method, data = webRequest.data;
//   var headers = webRequest.headers;
  
//   if (method == 'GET') {
//     endpoint += '?' + querystring.stringify(data);
//   }
//   else {
//     if(!headers) headers = {};
//     headers['Content-Type'] = 'application/json';
//     if(dataString) headers['Content-Length'] = dataString.length;
//   }
//   var options = {
//     host: host,
//     path: endpoint,
//     method: method,
//     headers: headers,
//     port: 443
//   };

//   var req = https.request(options, function(res) {
//     res.setEncoding('utf-8');

//     var responseString = '';

//     res.on('data', function(data) {
//       responseString += data;
//     });

//     res.on('end', function() {
//       console.log(responseString);
//       var responseObject = JSON.parse(responseString);
//       success(responseObject);
//     });

//     req.write(dataString);
//     req.end();
//   });

  
// };

RestClient.prototype.Post = function(webRequest, success){
  var url = webRequest.url, data = webRequest.data;
  var headers = webRequest.headers;

    if(!headers) headers = {};
    headers['Content-Type'] = 'application/json';
  
  var options = {
    headers: headers,
    body: data,
    dataType:'json',
    method:'POST'
  };

  
  requestify.request(url, options).then(function (response) {
    success(response.body);
});

  
}

var restClient = new RestClient();
module.exports = restClient;