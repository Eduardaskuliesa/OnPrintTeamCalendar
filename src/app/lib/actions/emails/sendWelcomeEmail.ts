"use server";
import { Resend } from "resend";
import { resendDomain } from "../../resend";

export interface WelcomeEmailData {
  to: string;
  name: string;
  surname: string;
  password: string;
}

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const subject = `Kvietimas atostogų kalendoriui`;
  const loginUrl = "https://www.onprintvacations.site/login";

  const htmlContent = `
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="utf-8">
       <title>${subject}</title>
     </head>
     <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #4A4A4A; max-width: 600px; margin: 0 auto; padding: 20px;">
       <h2 style="color: #2c3e50; margin-bottom: 20px;">Kvietimas į atostogų kalendorių</h2>
       
       <p style="margin-bottom: 15px;">Sveiki, ${data.name} ${data.surname},</p>
       
       <p style="margin-bottom: 15px; color: #4A4A4A;">
         Jūs buvote pakviesti į atostogų kalendoriaus programėlę.
       </p>

       <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
         <div style="margin: 0; line-height: 1.8;">
           <p style="margin: 0; white-space: nowrap; color: #4A4A4A;">
             <strong style="color: #4A4A4A;">Prisijungimo duomenys:</strong>
           </p>
           <p style="margin: 0; white-space: nowrap; color: #4A4A4A;">
             <strong style="color: #4A4A4A;">El. paštas:</strong> <span style="color: #4A4A4A;">${data.to}</span>
           </p>
           <p style="margin: 0; white-space: nowrap; color: #4A4A4A;">
             <strong style="color: #4A4A4A;">Slaptažodis:</strong> <span style="color: #4A4A4A;">${data.password}</span>
           </p>
         </div>
       </div>

       <div style="margin: 30px 0;">
          <a href="${loginUrl}" 
             style="background-color: #6F4E37; 
                    color: white; 
                    padding: 12px 24px; 
                    font-size: 14px;
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: 500; 
                    display: inline-block;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            Prisijungti
          </a>
        </div>

         <p style="margin-bottom: 15px; color: #666;">
          Jei negalite paspausti mygtuko, nukopijuokite šią nuorodą į naršyklę:
          <br>
          <a href="${loginUrl}" style="color: #6F4E37; text-decoration: underline;">
            ${loginUrl}
          </a>
        </p>

        <p style="color: #777777; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          Tai yra automatinis pranešimas apie pakvietimą.
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
