import PDFDocument from 'pdfkit';
// import { Roboto } from 'next/font/google';

export interface EmailData {
  name: string;
  surname: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
}

// const font = Roboto({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   display: "swap",
// });

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

  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: 'Atostogų prašymas',
          Author: `${data.name} ${data.surname}`
        }
      });

      // Collect the PDF data chunks
      const chunks: any[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(12)
         .text(`${data.name} ${data.surname}`, { align: 'center' })
         .text('Pareigos', { align: 'center' })
         .moveDown(2);

      // Company info
      doc.text('UAB „Logitema"')
         .text('Direktoriui')
         .moveDown(2);

      // Title
      doc.fontSize(14)
         .text('PRAŠYMAS', { align: 'center' })
         .moveDown();

      // Date and location
      doc.fontSize(12)
         .text(currentDate, { align: 'center' })
         .text('Klaipėda', { align: 'center' })
         .moveDown(2);

      // Content
      doc.text(
        `Prašau mane išleisti kasmetinių apmokamų atostogų nuo ${formattedStartDate} iki ${formattedEndDate} imtinai.\n\nNoriu atostoginius gauti kartu su atlyginimu.`,
        { align: 'center' }
      )
      .moveDown(4);

      // Signature
      doc.text(`${data.name} ${data.surname}`, { align: 'right' })
         .text('Parašas', { align: 'right' });

      // Finalize PDF
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};