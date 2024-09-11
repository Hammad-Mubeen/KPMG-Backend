const S3 = require("aws-sdk/clients/s3");
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, AWS_BUCKET_BASE_URL } =
  process.env;

const s3 = new S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

module.exports = {
  fileUpload: async (filename, fileContent, contentType) => {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: filename,
      Body: fileContent,
      ContentType: contentType,
    };
    const uploadedFile = s3.upload(params).promise();
    return uploadedFile;
  },
  deleteFile: async (filename) => {
    filename = filename.split(AWS_BUCKET_BASE_URL).pop();
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: filename,
    };

    return s3.deleteObject(params).promise();
  },
};
