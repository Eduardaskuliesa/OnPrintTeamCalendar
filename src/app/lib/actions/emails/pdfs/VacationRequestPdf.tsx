import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';

export interface EmailData {
 name: string;
 surname: string;
 startDate: string;
 endDate: string;
 createdAt?: string;
}

export const createVacationPDF = async (data: EmailData) => {
 // Fetch fonts from Google Fonts CDN
 const robotoRegular = await fetch(
   'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf'
 ).then(res => res.arrayBuffer());
 
 const robotoBold = await fetch(
   'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf'
 ).then(res => res.arrayBuffer());

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

     // Register fonts
     doc.registerFont('Roboto', Buffer.from(robotoRegular));
     doc.registerFont('Roboto-Bold', Buffer.from(robotoBold));
     
     // Set default font
     doc.font('Roboto');

     // Collect the PDF data chunks
     const chunks: any[] = [];
     doc.on('data', chunk => chunks.push(chunk));
     doc.on('end', () => resolve(Buffer.concat(chunks)));

     // Header
     doc.font('Roboto')
        .fontSize(12)
        .text(`${data.name} ${data.surname}`, { align: 'center' })
        .text('Pareigos', { align: 'center' })
        .moveDown(2);

     // Company info
     doc.text('UAB „Logitema"', { align: 'left' })
        .text('Direktoriui', { align: 'left' })
        .moveDown(2);

     // Title
     doc.font('Roboto-Bold')
        .fontSize(14)
        .text('PRAŠYMAS', { align: 'center' })
        .moveDown();

     // Date and location
     doc.font('Roboto')
        .fontSize(12)
        .text(currentDate, { align: 'center' })
        .text('Klaipėda', { align: 'center' })
        .moveDown(2);

     // Content
     doc.text(
       `Prašau mane išleisti kasmetinių apmokamų atostogų nuo ${formattedStartDate} iki ${formattedEndDate} imtinai.\n\nNoriu atostoginius gauti kartu su atlyginimu.`,
       { 
         align: 'center',
         lineGap: 10
       }
     )
     .moveDown(4);

     // Signature
     doc.text(`${data.name} ${data.surname}`, { align: 'right' })
        .text('Parašas', { align: 'right' });

     // Finalize PDF
     doc.end();

   } catch (error) {
     console.error('PDF Generation Error:', error);
     reject(error);
   }
 });
};