const AWS = require('aws-sdk');

exports.uploadToS3=(data, name)=>{
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const IAM_USER_KEY = process.env.AWS_ACCESS_KEY;
    const IAM_USER_SECRET_KEY= process.env.AWS_SECRET_KEY

    let s3bucket = new AWS.S3({
        accessKeyId : IAM_USER_KEY,
        secretAccessKey : IAM_USER_SECRET_KEY
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: name,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response)=>{
            if(err){
                // console.log('something went wrong', err)
                reject(err);
            }
            else{
                // console.log('success', s3response);
                resolve(s3response.Location);
            }
        })
    })
     
}