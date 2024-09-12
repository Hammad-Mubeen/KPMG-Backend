const S3 = require("aws-sdk/clients/s3");
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } =
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
  getFile: async (filename) => {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: filename,
    };
    return s3.getObject(params).promise();
  },
};
