import puppeteer from "puppeteer";

export interface EmailData {
  name: string;
  surname: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
}

export const createVacationPDF = async (data: EmailData) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

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

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 50px;
          font-size: 12pt;
        }
        .header { text-align: center; margin-bottom: 20px; margin-top:80px }
        .company { margin-bottom: 40px; }
        .title { 
          text-align: center;
          font-size: 14pt;
          margin: 30px 0;
        }
        .content { margin: 20px 0; text-align: center; }
        .signature { 
          text-align: right;
          margin-top: 60px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <p>${data.name} ${data.surname}</p>
        <p>Pareigos</p>
      </div>
      
      <div class="company">
        <p>UAB „Logitema"</p>
        <p>Direktoriui</p>
      </div>

      <div class="title">PRAŠYMAS</div>
      
      <div style="text-align: center;">
        <p>${currentDate}</p>
        <p>Klaipėda</p>
      </div>

      <div class="content">
        Prašau mane išleisti kasmetinių apmokamų atostogų nuo ${formattedStartDate} iki ${formattedEndDate} imtinai.
        \n Noriu atostoginius gauti kartu su atlyginimu.
      </div>

      <div class="signature">
        <p>${data.name} ${data.surname}</p>
        <p>Parašas</p>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const pdf = await page.pdf({ format: "A4" });
  await browser.close();

  return pdf;
};
