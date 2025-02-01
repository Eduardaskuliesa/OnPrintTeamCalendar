"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "../../s3bucket";
import { createVacationPDF } from "../emails/pdfs/VacationRequestPdf";

export interface PdfData {
  name: string;
  surname: string;
  startDate: string;
  endDate: string;
  jobTitle: string;
  founderNameSurname: string | undefined;
  vacationId: string;
}

interface StorePdfOptions {
  returnPdf?: boolean;
}

export const storePDFtoS3 = async (
  pdfData: PdfData,
  options: StorePdfOptions = {}
) => {
  const date = new Date();
  const year = date.getFullYear();

  const pdfUint8Array = await createVacationPDF(pdfData);
  const pdfBuffer = Buffer.from(pdfUint8Array);

  const s3Key = `vacations/${year}/${pdfData.vacationId}.pdf`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: s3Key,
    Body: pdfBuffer,
    ContentType: "application/pdf",
  });

  await s3client.send(command);

  const directUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${s3Key}`;

  if (options.returnPdf) {
    return {
      s3Key,
      url: directUrl,
      pdfContent: pdfBuffer,
    };
  }

  return {
    s3Key,
    url: directUrl,
  };
};
