import { jsPDF } from "jspdf";
import { readFileSync } from "fs";
import path from "path";

export interface EmailData {
  name: string;
  surname: string;
  startDate: string;
  endDate: string;
  founderNameSurname?: string;
  createdAt?: string;
  jobTitle?: string;
}

export const createVacationPDF = async (data: EmailData) => {
  try {
    console.log("Current working directory:", process.cwd());
    console.log(
      "Font path:",
      path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf")
    );
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Roboto-Regular.ttf"
    );
    const fontBytes = readFileSync(fontPath).toString("base64");

    const formattedStartDate = new Date(data.startDate).toLocaleDateString(
      "lt-LT",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const formattedEndDate = new Date(data.endDate).toLocaleDateString(
      "lt-LT",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const currentDate =
      data.createdAt || new Date().toISOString().split("T")[0];

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.addFileToVFS("Roboto-Regular.ttf", fontBytes);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    // Helper function for single line centered text
    const centerText = (text: string, y: number, size = 12) => {
      doc.setFontSize(size);
      const textWidth = doc.getTextWidth(text);
      const pageWidth = doc.internal.pageSize.width;
      doc.text(text, (pageWidth - textWidth) / 2, y);
    };

    // Helper function for multiline centered text
    const centerMultilineText = (text: string, y: number, size = 12) => {
      doc.setFontSize(size);
      const pageWidth = doc.internal.pageSize.width;
      const maxWidth = pageWidth - 60;
      const lines = doc.splitTextToSize(text, maxWidth);

      lines.forEach((line: string, index: number) => {
        const textWidth = doc.getTextWidth(line);
        const x = (pageWidth - textWidth) / 2;
        doc.text(line, x, y + index * 8);
      });

      return y + lines.length * 8; // Return the Y position after the last line
    };

    // Header
    centerText(`${data.name} ${data.surname}`, 30, 12);
    centerText(`${data.jobTitle}`, 40, 12);

    // Company info - left aligned
    doc.setFontSize(12);
    doc.text('UAB „Logitema"', 20, 60);
    doc.text("Direktoriui", 20, 70);
    doc.text(`${data.founderNameSurname}`, 20, 80);

    // Title
    centerText("PRAŠYMAS", 100, 14);

    // Date and location
    centerText(currentDate, 108, 12);
    centerText("Klaipėda", 115, 12);

    // Main content with both sentences
    const mainContent = `Prašau mane išleisti kasmetinių apmokamų atostogų nuo ${formattedStartDate} iki ${formattedEndDate} imtinai. Noriu atostoginius gauti kartu su atlyginimu.`;
    const mainContentY = centerMultilineText(mainContent, 130, 12);
    centerText("", mainContentY, 12);

    // Signature
    const pageWidth = doc.internal.pageSize.width;
    const signatureX = pageWidth - 70;
    doc.text(`${data.name} ${data.surname}`, signatureX, 210);
    doc.text("Parašas", signatureX, 220);
    doc.text(`${data.founderNameSurname}`, signatureX, 240);
    doc.text("Parašas", signatureX, 250);

    const pdfBytes = doc.output("arraybuffer");
    return new Uint8Array(pdfBytes);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  }
};
