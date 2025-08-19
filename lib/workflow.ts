import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({ email, subject, message }: { email: string; subject: string; message: string }) => {
  await qstashClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      from: "Bookish <lanre@larrytechcity.co.uk>",
      to: [email],
      subject, // instead of "subject: subject"
      html: message,
    },
  });
};



// import { Client as WorkflowClient } from "@upstash/workflow"; // Client for triggering/managing Upstash Workflows
// import { Client as QStashClient, resend } from "@upstash/qstash"; // Client for sending queued messages via QStash + helper to send emails via Resend API
// import config from "@/lib/config"; // Project configuration containing environment variables

// // Create an Upstash Workflow client instance
// export const workflowClient = new WorkflowClient({
//   baseUrl: config.env.upstash.qstashUrl, // Base URL for QStash API (from env config)
//   token: config.env.upstash.qstashToken, // Authentication token for QStash API
// });

// // Create a QStash client instance for publishing messages
// const qstashClient = new QStashClient({
//   token: config.env.upstash.qstashToken, // Auth token for QStash
// });

// /**
//  * Sends an email through QStash + Resend.
//  * QStash handles message queuing and retry logic; Resend handles actual email delivery.
//  *
//  * @param email   Recipient's email address
//  * @param subject Subject line of the email
//  * @param message Email body (HTML format)
//  */
// export const sendEmail = async ({
//   email,
//   subject,
//   message,
// }: {
//   email: string;
//   subject: string;
//   message: string;
// }) => {
//   await qstashClient.publishJSON({
//     // Specify API integration (Resend) and credentials
//     api: {
//       name: "email", // API identifier for QStash
//       provider: resend({ token: config.env.resendToken }), // Resend provider configuration
//     },
//     // Actual email payload
//     body: {
//       from: "Bookish <contact@adrianjsmastery.com>", // Sender details
//       to: [email], // Recipient list (array)
//       subject, // Subject line
//       html: message, // HTML email content
//     },
//   });
// };

