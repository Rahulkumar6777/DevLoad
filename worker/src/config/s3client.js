import { S3Client } from "@aws-sdk/client-s3";

export const s3client = (endpoint, accessId, accessKey) => {
  return new S3Client({
    endpoint: endpoint,
    region: 'auto',
    credentials: {
      accessKeyId: accessId,
      secretAccessKey: accessKey
    },
    forcePathStyle: true
  });
};