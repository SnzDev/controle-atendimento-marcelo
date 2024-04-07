import { Client } from "minio";

// Set your bucket name
const endPoint = "localhost";
const port = 9000;
const bucketName = process.env.S3_BUCKET ?? "morpheus";
const accessKey = process.env.S3_ACCESS_KEY_ID ?? "4ce753c0b96c69c08e6dac5e02d20989";
const secretKey = process.env.S3_SECRET_ACCESS_KEY ?? "6bf480e68cddeabcc7f00c4566ddd076";

// Configure Minio client
export const minioClient = new Client({
  endPoint, // Minio server endpoint
  port, // Port number (default is 9000)
  useSSL: false, // Set to true if using HTTPS
  accessKey, // Minio access key
  secretKey, // Minio secret key
});

// Function to upload an image to Minio
export function uploadImageS3(filePath: string, objectName: string) {
  minioClient.fPutObject(bucketName, objectName, filePath, {}, (err, etag) => {
    if (err) {
      console.error("Error uploading image:", err);
    } else {
      console.log("Image uploaded successfully. ETag:", etag);
    }
  });
}

// Function to upload base64 data to Minio
export function uploadBase64S3(base64Data: string, objectName: string) {
  const buffer = Buffer.from(base64Data, "base64");

  minioClient.putObject(
    bucketName,
    objectName,
    buffer,
    buffer.length,
    (err, etag) => {
      if (err) {
        console.error("Error uploading object:", err);
      } else {
        console.log("Object uploaded successfully. ETag:", etag);
      }
    }
  );

  return `${objectName}`;
}
