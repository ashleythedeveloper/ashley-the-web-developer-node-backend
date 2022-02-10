const AWS = require('aws-sdk');

// Create S3 service object
s3 = new AWS.S3({endpoint: 'https://sgp1.digitaloceanspaces.com', region: "sgp1", http_continue_timeout: 0});

const bucketName = process.env.AWS_BUCKET_NAME

// Produce a URL for given object
exports.GetObjectUrl = async (imageName) => {
  const url = await s3.getSignedUrl('getObject', {Bucket: bucketName, Key: `product-images/${imageName}`})
  return url
};


// Create an image object
exports.CreateObject = (name, file, fileType) => {
  s3.upload({Bucket: bucketName, Key: `product-images/${name}${fileType}`, Body: file}, (err, data) => {
    if (!err) {
      console.log(data)
    } else {
      console.log(`S3 Moduel: There was an error uploading the image object \n 
      Here is the error - \n ${err} \n 
      Here is the error call stack \n ${err.stack}`)
      console.log(err)

    }
  });
};

exports.DeleteObject = async (fileName) => {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Removing Image!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    await s3.deleteObject({Bucket: bucketName, Key: `product-images/${fileName}`}, (err, res) => {
        if (!err){
            console.log("No Error")
            console.log(res);
        } else {
            console.log("Error")
            console.log(err)
        }
        return res
    })
}