import { Client } from "minio";

// Set your bucket name
export const endPoint = process.env.S3_ENDPOINT ?? "localhost";
export const port = 9000;
export const bucketName = process.env.S3_BUCKET ?? "morpheus";
export const accessKey = process.env.S3_ACCESS_KEY_ID ?? "4ce753c0b96c69c08e6dac5e02d20989";
export const secretKey = process.env.S3_SECRET_ACCESS_KEY ?? "6bf480e68cddeabcc7f00c4566ddd076";

// Configure Minio client
export const client = new Client({
  endPoint, // Minio server endpoint
  port, // Port number (default is 9000)
  useSSL: false, // Set to true if using HTTPS
  accessKey, // Minio access key
  secretKey, // Minio secret key
});

