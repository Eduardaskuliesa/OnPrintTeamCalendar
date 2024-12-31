"use server";
import { Resend } from "resend";
import { resendDomain } from "../../resend";

export interface VacationEmailData {
  to: string;
  name: string;
  startDate: string;
  endDate: string;
}

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);
export async function sendRejectedEmail(data: VacationEmailData) {
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

  const subject = `Atostogų prašymas atmestas - ${data.name}`;

  const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #4A4A4A; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">Atostogų prašymas atmestas</h2>
          
          <p style="margin-bottom: 15px;">Sveiki, ${data.name},</p>
          
          <p style="margin-bottom: 15px; color: #4A4A4A;">
            Jūsų atostogų prašymas buvo atmestas.
          </p>
  
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="margin: 0; line-height: 1.8;">
              <p style="margin: 0; white-space: nowrap; color: #4A4A4A;">
                <strong style="color: #4A4A4A;">Atmesto prašymo laikotarpis:</strong>
              </p>
              <p style="margin: 0; white-space: nowrap; color: #4A4A4A;">
                <strong style="color: #4A4A4A;">Nuo:</strong> <span style="color: #4A4A4A;">${formattedStartDate}</span>
              </p>
              <p style="margin: 0; white-space: nowrap; color: #4A4A4A;">
                <strong style="color: #4A4A4A;">Iki:</strong> <span style="color: #4A4A4A;">${formattedEndDate}</span>
              </p>
              <p style="margin: 0; white-space: nowrap; color: #4A4A4A;">
                <strong style="color: #4A4A4A;">Statusas:</strong> <span style="color: #e74c3c;">Atmesta</span>
              </p>
            </div>
          </div>
  
          <p style="margin-bottom: 15px; color: #4A4A4A;">
            Prašome pateikti naują prašymą pasirinkus kitą laikotarpį.
          </p>
  
          <p style="color: #777777; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            Tai yra automatinis pranešimas.
          </p>
        </body>
      </html>
    `;

  try {
    const response = await resend.emails.send({
      from: `Atostogos@${resendDomain}`,
      to: data.to,
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
