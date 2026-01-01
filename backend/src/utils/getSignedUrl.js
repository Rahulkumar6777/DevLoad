import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3client } from "../configs/s3client.js";

export const generateSignedUrl = async (
  bucketName,
  objectKey,
  endpoint,
  accessId,
  accessKey,
  expiresIn = 43200
) => {
  const client = s3client(endpoint, accessId, accessKey);

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey
  });

  const url = await getSignedUrl(client, command, { expiresIn });

  return url;
};
