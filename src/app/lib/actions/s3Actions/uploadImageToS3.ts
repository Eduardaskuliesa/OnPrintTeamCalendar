"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "../../s3bucket";

export const uploadImageToS3 = async ({
    route,
    fileName,
    content
  }: {
    route: string,
    fileName: string,
    content: FormData
  }) => {
    try {
      const file = content.get('file') as File;
      if (!file) throw 'No file found for upload.';
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const contentType = file.type || 'image/jpeg'
      const key = `images/${fileName}`;
      
      const command = new PutObjectCommand({
        Bucket: process.env.S3_IMAGE_BUCKET_NAME || '',
        Key: key,
        ContentType: contentType,
        Body: buffer,
      });
  
      const response = await s3client.send(command);
      
      // Generate URL
      const baseUrl = `https://${process.env.S3_IMAGE_BUCKET_NAME}.s3.amazonaws.com`;
      const imageUrl = `${baseUrl}/${key}`;
  
      return {
        ok: response.$metadata.httpStatusCode === 200,
        url: imageUrl
      };
    } catch (error) {
      console.trace(error);
      return {
        ok: false,
        url: null
      };
    }
  };