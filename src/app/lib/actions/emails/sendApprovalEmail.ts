import { PDFDocument, StandardFonts } from 'pdf-lib';

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

    // Add a blank page
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions in points

    // Get the Times-Roman font
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // Set up text parameters
    const fontSize = 12;
    const { width, height } = page.getSize();

    // Add content
    page.drawText(`${data.name} ${data.surname}`, {
      x: width / 2 - 50,
      y: height - 100,
      size: fontSize,
      font
    });

    page.drawText('Pareigos', {
      x: width / 2 - 30,
      y: height - 120,
      size: fontSize,
      font
    });

    page.drawText('UAB „Logitema"', {
      x: 50,
      y: height - 160,
      size: fontSize,
      font
    });

    page.drawText('Direktoriui', {
      x: 50,
      y: height - 180,
      size: fontSize,
      font
    });

    page.drawText('PRAŠYMAS', {
      x: width / 2 - 40,
      y: height - 220,
      size: 14,
      font
    });

    page.drawText(currentDate, {
      x: width / 2 - 30,
      y: height - 260,
      size: fontSize,
      font
    });

    page.drawText('Klaipėda', {
      x: width / 2 - 25,
      y: height - 280,
      size: fontSize,
      font
    });

    const content = `Prašau mane išleisti kasmetinių apmokamų atostogų nuo ${formattedStartDate} iki ${formattedEndDate} imtinai.\n\nNoriu atostoginius gauti kartu su atlyginimu.`;
    
    page.drawText(content, {
      x: 50,
      y: height - 340,
      size: fontSize,
      font,
      maxWidth: width - 100
    });

    page.drawText(`${data.name} ${data.surname}`, {
      x: width - 200,
      y: 150,
      size: fontSize,
      font
    });

    page.drawText('Parašas', {
      x: width - 200,
      y: 130,
      size: fontSize,
      font
    });

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();
    
    return new Uint8Array(pdfBytes);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};