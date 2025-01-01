"use server";
import { Resend } from "resend";
import { resendDomain } from "../../resend";

export interface EmailData {
  to: string;
  name: string;
  startDate: string;
  endDate: string;
}

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export async function sendRequestEmail(data: EmailData) {
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

  const subject = `Naujas atostogų prašymas - ${data.name}`;
  const adminUrl = "https://www.onprintvacations.site/admin";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #4A4A4A; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50; margin-bottom: 20px;">Naujas atostogų prašymas</h2>
        
        <p style="margin-bottom: 15px;">Sveiki,</p>
        
        <p style="margin-bottom: 15px; color: #4A4A4A;">
          ${data.name} pateikė naują atostogų prašymą.
        </p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div style="margin: 0; line-height: 1.8;">
            <p style="margin: 0; white-space: nowrap; color: #4A4A4A;">
              <strong style="color: #4A4A4A;">Darbuotojas:</strong> <span style="color: #4A4A4A;">${data.name}</span>
            </p>
            <p style="margin: 0; white-space: nowrap; color: #4A4A4A;">
              <strong style="color: #4A4A4A;">Nuo:</strong> <span style="color: #4A4A4A;">${formattedStartDate}</span>
            </p>
            <p style="margin: 0; white-space: nowrap; color: #4A4A4A;">
              <strong style="color: #4A4A4A;">Iki:</strong> <span style="color: #4A4A4A;">${formattedEndDate}</span>
            </p>
            <p style="margin: 0; white-space: nowrap; color: #4A4A4A;">
              <strong style="color: #4A4A4A;">Statusas:</strong> <span style="color: #4A4A4A;">Laukiama patvirtinimo</span>
            </p>
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${adminUrl}" 
             style="background-color: #6F4E37; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: 500; 
                    display: inline-block;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            Peržiūrėti prašymą
          </a>
        </div>

        <p style="margin-bottom: 15px; color: #666;">
          Jei negalite paspausti mygtuko, nukopijuokite šią nuorodą į naršyklę:
          <br>
          <a href="${adminUrl}" style="color: #6F4E37; text-decoration: underline;">
            ${adminUrl}
          </a>
        </p>

        <p style="color: #777777; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          Tai yra automatinis pranešimas apie atostogų prašymą.
        </p>
      </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: `Atostogos@${resendDomain}`,
      to: 'kuliesaeduardas@gmail.com',
      subject: subject,
      html: htmlContent,
    });

    return { success: true, data: response };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}
