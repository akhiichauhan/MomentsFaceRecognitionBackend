var restClient = require('./restclient.js');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var rekognition = new AWS.Rekognition();

module.exports.handler = function(event, context, callback){
      var colletionId = "UserCollection", bucketName = "momentsfirstgallery";
      var personIds = [];
      /********************************create Collection**************/

      var params = {
        CollectionId: colletionId, 
        FaceMatchThreshold: 50, 
        Image: {
        S3Object: {
          Bucket: bucketName, 
          Name: event.imageName
        }
        }
      };
      rekognition.searchFacesByImage(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            data.FaceMatches.forEach(function(faceMatch){
                  personIds.push(faceMatch.Face.FaceId);
            });

            var colletionId = "PhotosCollection", bucketName = "momentsfirstgallery";

            /********************************create Collection**************/

            var params = {
              CollectionId: colletionId
            };
            rekognition.createCollection(params, function(err, data) {
              if (err) console.log(err, err.stack); // an error occurred
              else     console.log(data);           // successful response
              /*
              data = {
                CollectionArn: "aws:rekognition:us-west-2:123456789012:collection/myphotos", 
                StatusCode: 200
              }
              */

            var params = {
              CollectionId: colletionId, 
              DetectionAttributes: [
              ], 
              ExternalImageId: data.imageName, 
              Image: {
              S3Object: {
                Bucket: bucketName, 
                Name: event.imageName
              }
              }
            };

            rekognition.indexFaces(params, function(err, data) {
              var errMsg = null;
              if (err) {
                console.log(err, err.stack); // an error occurred
              }
              else   {  
                console.log(data);           // successful response\
              }

              var matchedObj = {
                      imageId : event.imageName,
                      personIds : personIds,
                      userid: event.userId,
                      err: errMsg
                  };
              savePhotoMetaData(event.userId, errMsg, matchedObj);
              
            });


            

            /*******************************END */

          });
        }     
      });



      /*******************************END */
}

function savePhotoMetaData(userid, errmsg, matchedObj){
    var webRequest = {
        url: "http://54.148.131.18/moments/api/datasource/saveimagemetadata ",
        userid: userid,
        data : matchedObj,
        err: errmsg
    };

    restClient.Post(webRequest, function(response){
        console.log('metadata for user id '+ matchedObj.userid + ' saved');
    });
}