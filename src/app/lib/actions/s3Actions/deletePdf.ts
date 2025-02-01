import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "../../s3bucket";

export const deletePDFfromS3 = async (vacationId: string, year: string) => {
  try {
    const s3Key = `vacations/${year}/${vacationId}.pdf`;

    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
    });

    await s3client.send(command);
    return {
      success: true,
      message: "Pdf deleted",
    };
  } catch (error) {
    console.error("Error deleting PDF from S3:", error);
    return {
      success: false,
      message: "Pdf failed to delete",
    };
  }
};
