var restClient = require('./restclient.js');

module.exports.handler = function(event, context, callback){
    console.log("handler invoked");
    console.log("input received");
    console.log(event);
    
    var appId= "a22bfb7d", appKey = "b269c72b2b41a8d9b36945d49440d249", galleryName="momentsGallery";
    var webRequest = {
        url: "https://api.kairos.com/enroll",
        data : {
            image: event.ImageUrl,
            subject_id: event.UserId,
            gallery_name: galleryName
        },
        headers : {
            app_id: appId,
            app_key: appKey
        }
    };
    restClient.Post(webRequest, function(response){
        console.log(response);
        callback(null, {"statusCode": 200, "body": response});
    });
}