import { bowlingEventConfig, paymentPreferenceLabels } from "./config";
import type { BowlingRegistrationRecord } from "./types";
import { needsSession } from "./validation";

export type BowlingConfirmationEmail = {
  subject: string;
  previewText: string;
  text: string;
  html: string;
};

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const paymentNextStep = (registration: BowlingRegistrationRecord) => {
  const isGiftOnly = registration.registrationType === "gift";

  if (registration.paymentPreference === "invoice") {
    return isGiftOnly
      ? `${bowlingEventConfig.contactName} will follow up with gift details if needed.`
      : `${bowlingEventConfig.contactName} will follow up with invoice details and any final event notes.`;
  }

  if (registration.paymentPreference === "check") {
    return `${bowlingEventConfig.contactName} will follow up with mailing or drop-off instructions if needed.`;
  }

  return isGiftOnly
    ? "Your online gift payment path is complete or underway. If anything needs attention, City Center will follow up directly."
    : "Your online payment path is complete or underway. If anything needs attention, City Center will follow up directly.";
};

export function buildBowlingConfirmationEmail(
  registration: BowlingRegistrationRecord,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "",
): BowlingConfirmationEmail {
  const firstName = registration.buyerFirstName.trim() || "friend";
  const eventUrl = `${siteUrl}/bowling-for-backpacks`;
  const teamUrl = `${siteUrl}${bowlingEventConfig.teamBaseUrl}/${registration.id}`;
  const isGiftOnly = registration.registrationType === "gift";
  const canManageTeam = needsSession(registration.registrationType) && registration.saveTeamLink;
  const subject = isGiftOnly
    ? `Thank you for your gift to ${bowlingEventConfig.name}`
    : `You are in for ${bowlingEventConfig.name}`;
  const previewText = isGiftOnly
    ? `Your gift for ${bowlingEventConfig.name} has been received by City Center.`
    : `Your ${bowlingEventConfig.name} registration has been received by City Center.`;
  const nextStep = paymentNextStep(registration);
  const sessionLine = registration.sessionName ? `${registration.sessionName}` : "";
  const summaryTitle = isGiftOnly ? "Gift summary" : "Registration summary";
  const referenceLabel = isGiftOnly ? "Gift reference" : "Confirmation code";
  const typeLabel = isGiftOnly ? "Support type" : "Registration type";
  const sessionTextLine = sessionLine ? `- Session: ${sessionLine}\n` : "";
  const teamText = canManageTeam
    ? `
Need to add or update bowler names?
Use this team link: ${teamUrl}
`
    : "";
  const teamHtml = canManageTeam
    ? `<tr>
              <td style="padding:24px 32px 0;">
                <h2 style="margin:0;color:#112F6D;font-size:22px;line-height:1.2;font-weight:900;">Need to add bowler names later?</h2>
                <p style="margin:12px 0 18px;color:#30324F;font-size:16px;line-height:1.65;">Use your team link when you are ready.</p>
                <a href="${escapeHtml(teamUrl)}" style="display:inline-block;background:#112F6D;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;padding:14px 18px;">Update bowler names</a>
              </td>
            </tr>`
    : "";
  const sessionHtml = sessionLine ? `<br /><strong>Session:</strong> ${escapeHtml(sessionLine)}` : "";

  const text = `Hi ${firstName},

${isGiftOnly ? `Thank you for your gift to ${bowlingEventConfig.name}.` : `You are in for ${bowlingEventConfig.name}.`}

Thank you for helping students start the school year ready. ${isGiftOnly ? "Your gift" : "Your registration"} has been received by City Center, and your support will help provide backpacks, school supplies, and practical back-to-school support for students and families.

${summaryTitle}:
- ${referenceLabel}: ${registration.id}
- ${typeLabel}: ${registration.packageName}
- Payment path: ${paymentPreferenceLabels[registration.paymentPreference]}
- Amount: ${formatMoney(registration.grandTotal)}
${sessionTextLine}

What happens next:
${nextStep}
${teamText}

Questions or changes?
Email ${bowlingEventConfig.contactName} at ${bowlingEventConfig.contactEmail}.

Thank you for standing with students and families.

City Center
${eventUrl}
`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;background:#F7F2E8;color:#11132F;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="background:#F7F2E8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="max-width:640px;background:#ffffff;border:1px solid rgba(17,19,47,.10);">
            <tr>
              <td style="padding:36px 32px 28px;">
                <p style="margin:0 0 14px;color:#112F6D;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">${escapeHtml(isGiftOnly ? "Gift received" : "You are in")}</p>
                <h1 style="margin:0;color:#112F6D;font-size:34px;line-height:1.05;font-weight:900;">Thank you for helping students start the school year ready.</h1>
                <p style="margin:20px 0 0;color:#30324F;font-size:17px;line-height:1.65;">Hi ${escapeHtml(firstName)}, ${escapeHtml(isGiftOnly ? `your gift for ${bowlingEventConfig.name}` : `your ${bowlingEventConfig.name} registration`)} has been received by City Center.</p>
                <p style="margin:14px 0 0;color:#30324F;font-size:17px;line-height:1.65;">Your support helps provide backpacks, school supplies, and practical back-to-school support for students and families.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 8px;">
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="background:#F7F2E8;border-left:4px solid #5DCBA3;">
                  <tr>
                    <td style="padding:22px;">
                      <p style="margin:0 0 12px;color:#11132F;font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(summaryTitle)}</p>
                      <p style="margin:0;color:#30324F;font-size:16px;line-height:1.75;"><strong>${escapeHtml(referenceLabel)}:</strong> ${escapeHtml(registration.id)}<br /><strong>${escapeHtml(typeLabel)}:</strong> ${escapeHtml(registration.packageName)}<br /><strong>Payment path:</strong> ${escapeHtml(paymentPreferenceLabels[registration.paymentPreference])}<br /><strong>Amount:</strong> ${escapeHtml(formatMoney(registration.grandTotal))}${sessionHtml}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0;">
                <h2 style="margin:0;color:#112F6D;font-size:22px;line-height:1.2;font-weight:900;">What happens next</h2>
                <p style="margin:12px 0 0;color:#30324F;font-size:16px;line-height:1.65;">${escapeHtml(nextStep)}</p>
              </td>
            </tr>
            ${teamHtml}
            <tr>
              <td style="padding:30px 32px 36px;">
                <p style="margin:0;color:#30324F;font-size:16px;line-height:1.65;">Questions or changes? Email <a href="mailto:${escapeHtml(bowlingEventConfig.contactEmail)}" style="color:#112F6D;font-weight:800;">${escapeHtml(bowlingEventConfig.contactName)}</a> and our team will help.</p>
                <p style="margin:22px 0 0;color:#30324F;font-size:16px;line-height:1.65;">Thank you for standing with students and families.</p>
                <p style="margin:16px 0 0;color:#11132F;font-size:16px;font-weight:800;">City Center</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject,
    previewText,
    text,
    html,
  };
}
