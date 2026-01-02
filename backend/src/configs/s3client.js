import { S3Client } from "@aws-sdk/client-s3";

export const s3client = () => {
  return new S3Client({
    endpoint: process.env.ENDPOINT,
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.ACCESS_ID,
      secretAccessKey: process.env.ACCESS_KEY
    },
    forcePathStyle: true
  });
};