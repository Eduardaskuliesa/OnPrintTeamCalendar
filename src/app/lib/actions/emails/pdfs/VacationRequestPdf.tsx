import { PDFDocument, rgb } from 'pdf-lib';
import fetch from 'node-fetch';

export interface EmailData {
  name: string;
  surname: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
}

export const createVacationPDF = async (data: EmailData) => {
  const formattedStartDate = new Date(data.startDate).toLocaleDateString(
    "lt-LT",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const formattedEndDate = new Date(data.endDate).toLocaleDateString("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentDate = data.createdAt || new Date().toISOString().split("T")[0];

  try {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    // Fetch and embed the Roboto font
    const fontResponse = await fetch(
      'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf'
    );
    const fontBytes = await fontResponse.arrayBuffer();
    
    // Embed font
    const customFont = await pdfDoc.embedFont(fontBytes);

    // Add a blank page
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions in points

    const { width, height } = page.getSize();

    // Helper function to write text with proper encoding
    const writeText = (text: string, x: number, y: number, size: number = 12) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: customFont,
        color: rgb(0, 0, 0)
      });
    };

    // Header
    writeText(`${data.name} ${data.surname}`, width / 2 - 50, height - 100);
    writeText('Pareigos', width / 2 - 30, height - 120);

    // Company info
    writeText('UAB „Logitema"', 50, height - 160);
    writeText('Direktoriui', 50, height - 180);

    // Title
    writeText('PRAŠYMAS', width / 2 - 40, height - 220, 14);

    // Date and location
    writeText(currentDate, width / 2 - 30, height - 260);
    writeText('Klaipėda', width / 2 - 25, height - 280);

    // Content
    const content = `Prašau mane išleisti kasmetinių apmokamų atostogų nuo ${formattedStartDate} iki ${formattedEndDate} imtinai.`;
    writeText(content, 50, height - 340);
    writeText('Noriu atostoginius gauti kartu su atlyginimu.', 50, height - 360);

    // Signature
    writeText(`${data.name} ${data.surname}`, width - 200, 150);
    writeText('Parašas', width - 200, 130);

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    return new Uint8Array(pdfBytes);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};