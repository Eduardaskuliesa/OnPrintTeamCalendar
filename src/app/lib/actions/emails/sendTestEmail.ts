import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../../simpleEmailClient";

export interface EmailParams {
  to: string;
  subject: string;
  htmlBody: string;
}

export const sendTestEmail = async (params: EmailParams): Promise<string> => {
  const sourceEmail = "support@onprintvacations.site";
  console.log(params.htmlBody);

  const command = new SendEmailCommand({
    Source: sourceEmail,
    Destination: {
      ToAddresses: params.to.split(",").map((email) => email.trim()),
    },
    Message: {
      Subject: {
        Data: params.subject,
      },
      Body: {
        Html: {
          Data: params.htmlBody,
        },
      },
    },
  });

  try {
    const result = await sesClient.send(command);
    return result.MessageId || "Email sent successfully";
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
