var restClient = require('./restclient.js');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');
var rekognition = new AWS.Rekognition();

module.exports.handler = function(event, context, callback){
    
      /********************************search for this new user in PhotosCollection**************/
      var colletionId = "PhotosCollection", bucketName = "momentsfirstgallery";
      var photoList = [];
      var params = {
        CollectionId: colletionId, 
        FaceMatchThreshold: 50, 
        Image: {
        S3Object: {
          Bucket: bucketName, 
          Name: event.imageName
        }
        }, 
        MaxFaces: 15
      };
      rekognition.searchFacesByImage(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else{
                console.log(data);
                data.FaceMatches.forEach(function(faceMatch){
                  photosList.push(faceMatch.face.ExternalImageId);
                });
        }

        var colletionId = "UserCollection", bucketName = "momentsfirstgallery";

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
          ExternalImageId: event.imageName, 
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
            errMsg = 'could not save image';
          }
          else   {  
            console.log(data);           // successful response\
            if(data.FaceRecords && data.FaceRecords.length==1) {
              var matchedObj = {
                      personId : data.FaceRecords[0].Face.FaceId,
                      imageIds : photoList,
                      userid: event.userId,
                      err: errMsg
                  };
            } else {
              errMsg = 'no images found in the photo';
            }
          }
          savePhotoMetaData(event.userId, errMsg, matchedObj);
          
        });


        });

        /*******************************END */

      });

}

/*******************************END */
function savePhotoMetaData(userid, errmsg, matchedObj){
    var webRequest = {
        url: "http://54.148.131.18/moments/api/datasource/saveusermetadata ",
        userid: userid,
        data : matchedObj,
        err: errmsg
    };

    restClient.Post(webRequest, function(response){
        console.log('metadata for user id '+ matchedObj.userid + ' saved');
    });
}