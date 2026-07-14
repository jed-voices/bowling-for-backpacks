import { getEmailConfig, getResendClient } from "./transport";

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
};

export type SendEmailResult =
  | { sent: true; messageId: string }
  | { sent: false; skipped: true; reason: string }
  | { sent: false; skipped: false; error: string };

/**
 * Send a transactional email via Resend. This never throws: callers
 * (registration and webhook handlers) must not fail a paid registration just
 * because email delivery had a problem. When Resend is not configured the send
 * is skipped and reported, so local/prototype environments behave predictably.
 */
export async function sendEmail(message: EmailMessage): Promise<SendEmailResult> {
  const config = getEmailConfig();
  const client = getResendClient();

  if (!config || !client) {
    return {
      sent: false,
      skipped: true,
      reason: "Email is not configured (set RESEND_API_KEY).",
    };
  }

  const recipient = message.to.trim();

  if (!recipient) {
    return { sent: false, skipped: true, reason: "No recipient email address." };
  }

  try {
    const { data, error } = await client.emails.send({
      from: config.from,
      to: recipient,
      replyTo: message.replyTo || config.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
      attachments: message.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    if (error) {
      return {
        sent: false,
        skipped: false,
        error: error.message || "Resend rejected the message.",
      };
    }

    return { sent: true, messageId: data?.id ?? "" };
  } catch (error) {
    return {
      sent: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Unknown email error.",
    };
  }
}
