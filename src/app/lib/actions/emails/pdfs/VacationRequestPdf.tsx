import { jsPDF } from 'jspdf';

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
    // Create new document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Enable Lithuanian characters
    doc.setLanguage("lt");

    // Set font
    doc.setFont("helvetica");
    
    // Header
    doc.setFontSize(12);
    doc.text(`${data.name} ${data.surname}`, 105, 40, { align: 'center' });
    doc.text('Pareigos', 105, 48, { align: 'center' });

    // Company info
    doc.text('UAB „Logitema"', 20, 70);
    doc.text('Direktoriui', 20, 78);

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('PRAŠYMAS', 105, 100, { align: 'center' });

    // Date and location
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(currentDate, 105, 120, { align: 'center' });
    doc.text('Klaipėda', 105, 128, { align: 'center' });

    // Content
    const content = `Prašau mane išleisti kasmetinių apmokamų atostogų nuo ${formattedStartDate} iki ${formattedEndDate} imtinai.\n\nNoriu atostoginius gauti kartu su atlyginimu.`;
    
    doc.text(content, 105, 150, { 
      align: 'center',
      maxWidth: 150
    });

    // Signature
    doc.text(`${data.name} ${data.surname}`, 190, 200, { align: 'right' });
    doc.text('Parašas', 190, 208, { align: 'right' });

    // Return as Uint8Array
    const pdfOutput = doc.output('arraybuffer');
    return new Uint8Array(pdfOutput);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};