import { sendEmail, type SendEmailResult } from "@/lib/email/send";
import { buildBowlingConfirmationEmail } from "./confirmation-email";
import { buildBowlingReceiptPdf } from "./receipt-pdf";
import { bowlingEventConfig } from "./config";
import type { BowlingRegistrationRecord } from "./types";

/**
 * Build and send the confirmation email for a bowling registration, with a
 * branded PDF receipt attached. Resilient by design:
 *  - If SMTP is not configured the send is skipped (reported, not thrown).
 *  - If PDF generation fails the email is still sent without the attachment.
 *  - Any unexpected error is caught so registration/webhook handlers never fail
 *    because of a notification problem.
 */
export async function sendBowlingConfirmation(
  registration: BowlingRegistrationRecord,
): Promise<SendEmailResult> {
  try {
    const email = buildBowlingConfirmationEmail(registration);

    let attachments;
    try {
      const pdf = await buildBowlingReceiptPdf(registration);
      attachments = [
        {
          filename: `city-center-receipt-${registration.id}.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
      ];
    } catch (pdfError) {
      // Send the email even if the receipt PDF could not be generated.
      console.error(
        `[bowling] receipt PDF failed for ${registration.id}:`,
        pdfError instanceof Error ? pdfError.message : pdfError,
      );
    }

    return await sendEmail({
      to: registration.buyerEmail,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo: bowlingEventConfig.contactEmail,
      attachments,
    });
  } catch (error) {
    return {
      sent: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Unknown confirmation error.",
    };
  }
}
