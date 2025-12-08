import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";

let s3Client = null;

function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWSREGION,
      credentials: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
      },
      maxAttempts: 3,
    });
  }
  return s3Client;
}

export async function uploadToS3(key, buffer, contentType) {
  const bucket = process.env.BUCKETNAME;
  const client = getS3Client();

  const putCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  // Retry with exponential backoff
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      await client.send(putCommand);
      return;
    } catch (err) {
      retries++;
      if (retries >= maxRetries) {
        console.error(`S3 upload failed after ${maxRetries} attempts`);
        throw err;
      }
      const delay = Math.pow(2, retries) * 1000;
      console.warn(`S3 upload attempt ${retries} failed, retrying in ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function getSignedUrl(key, expiresIn = 21600) {
  const bucket = process.env.BUCKETNAME;
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await awsGetSignedUrl(client, command, { expiresIn });
}

export { getS3Client };
