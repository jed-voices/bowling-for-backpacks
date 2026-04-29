import { bowlingEventConfig } from "./config";
import type { BowlingRegistrationRecord } from "./types";
import { needsSession } from "./validation";

export type BowlingFollowUpEmail = {
  id: string;
  timing: string;
  subject: string;
  previewText: string;
  text: string;
  html: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const supporterName = (registration: BowlingRegistrationRecord) =>
  registration.buyerFirstName.trim() || "friend";

const eventUrl = (siteUrl: string) => `${siteUrl}/bowling-for-backpacks`;
const teamUrl = (siteUrl: string, registration: BowlingRegistrationRecord) =>
  `${siteUrl}${bowlingEventConfig.teamBaseUrl}/${registration.id}`;

function wrapEmailHtml({
  subject,
  previewText,
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  footer,
}: {
  subject: string;
  previewText: string;
  eyebrow: string;
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  footer?: string;
}) {
  return `<!doctype html>
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
              <td style="padding:36px 32px;">
                <p style="margin:0 0 14px;color:#112F6D;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
                <h1 style="margin:0;color:#112F6D;font-size:34px;line-height:1.05;font-weight:900;">${escapeHtml(headline)}</h1>
                <div style="margin-top:20px;color:#30324F;font-size:17px;line-height:1.65;">${body}</div>
                ${ctaLabel && ctaHref ? `<p style="margin:28px 0 0;"><a href="${escapeHtml(ctaHref)}" style="display:inline-block;background:#112F6D;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;padding:14px 18px;">${escapeHtml(ctaLabel)}</a></p>` : ""}
                <p style="margin:30px 0 0;color:#30324F;font-size:16px;line-height:1.65;">${footer ? escapeHtml(footer) : "Thank you for standing with students and families."}</p>
                <p style="margin:16px 0 0;color:#11132F;font-size:16px;font-weight:800;">City Center</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildBowlingFollowUpEmails(
  registration: BowlingRegistrationRecord,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "",
): BowlingFollowUpEmail[] {
  const firstName = supporterName(registration);
  const publicEventUrl = eventUrl(siteUrl);
  const publicTeamUrl = teamUrl(siteUrl, registration);
  const canManageTeam = needsSession(registration.registrationType) && registration.saveTeamLink;
  const teamUpdateText = canManageTeam
    ? `If you registered a team and still need to add bowler names, you can use this link:
${publicTeamUrl}
`
    : "";
  const finalTeamLine = canManageTeam ? `Team link: ${publicTeamUrl}\n` : "";
  const finalDetailsPreview = canManageTeam
    ? `Date, location, confirmation code, and team link for ${bowlingEventConfig.name}.`
    : `Date, location, and confirmation code for ${bowlingEventConfig.name}.`;

  const impactSubject = `What your ${bowlingEventConfig.theme} gift helps make possible`;
  const impactText = `Hi ${firstName},

Thank you again for being part of ${bowlingEventConfig.name}.

A registration can look like a lane, a sponsorship, or a gift. But for a student, it can look like walking into the school year with a backpack, supplies, and the quiet confidence that someone was thinking about them before the first bell rang.

That is what your support helps make possible.

${teamUpdateText}

Thank you for helping City Center stand with students and families.

City Center
${publicEventUrl}
`;

  const inviteSubject = "Know another team that should bowl with us?";
  const inviteText = `Hi ${firstName},

A quick note: ${bowlingEventConfig.name} is strongest when people invite people.

If you know a business, church, family, or friend group that would enjoy bowling while helping students get ready for school, would you send them the event page?

Event page:
${publicEventUrl}

One invitation can turn into one more lane, one more sponsor, and more students starting the year prepared.

Grateful for you,
City Center
`;

  const finalDetailsSubject = `A few ${bowlingEventConfig.theme} details to keep handy`;
  const finalDetailsText = `Hi ${firstName},

We are looking forward to ${bowlingEventConfig.name}.

Here are a few details to keep handy:

Date: ${bowlingEventConfig.date}
Location: ${bowlingEventConfig.venue}, ${bowlingEventConfig.city}
Confirmation code: ${registration.id}
${finalTeamLine}

If anything changes or you have a question, email ${bowlingEventConfig.contactName} at ${bowlingEventConfig.contactEmail}.

Thank you again for helping students and families start the school year with support and dignity.

City Center
`;

  return [
    {
      id: "impact-48-hours",
      timing: "Send 48 hours after registration",
      subject: impactSubject,
      previewText: "Your support helps students begin the school year prepared.",
      text: impactText,
      html: wrapEmailHtml({
        subject: impactSubject,
        previewText: "Your support helps students begin the school year prepared.",
        eyebrow: "Your impact",
        headline: "A backpack is more than a backpack.",
        body: `<p style="margin:0;">Hi ${escapeHtml(firstName)},</p><p>A registration can look like a lane, a sponsorship, or a gift. But for a student, it can look like walking into the school year with a backpack, supplies, and the quiet confidence that someone was thinking about them before the first bell rang.</p><p>That is what your support helps make possible.</p>`,
        ctaLabel: canManageTeam ? "Update bowler names" : undefined,
        ctaHref: canManageTeam ? publicTeamUrl : undefined,
      }),
    },
    {
      id: "invite-another-team",
      timing: "Send 5-7 days after registration",
      subject: inviteSubject,
      previewText: "One invitation can help bring another team into the event.",
      text: inviteText,
      html: wrapEmailHtml({
        subject: inviteSubject,
        previewText: "One invitation can help bring another team into the event.",
        eyebrow: "Invite someone in",
        headline: "This event grows through people inviting people.",
        body: `<p style="margin:0;">Hi ${escapeHtml(firstName)},</p><p>${escapeHtml(bowlingEventConfig.name)} is strongest when people invite people.</p><p>If you know a business, church, family, or friend group that would enjoy bowling while helping students get ready for school, would you send them the event page?</p><p>One invitation can turn into one more lane, one more sponsor, and more students starting the year prepared.</p>`,
        ctaLabel: "Share the event page",
        ctaHref: publicEventUrl,
        footer: "Grateful for the way you help move this forward.",
      }),
    },
    {
      id: "final-event-details",
      timing: "Send 3-5 days before the event",
      subject: finalDetailsSubject,
      previewText: finalDetailsPreview,
      text: finalDetailsText,
      html: wrapEmailHtml({
        subject: finalDetailsSubject,
        previewText: finalDetailsPreview,
        eyebrow: "Event details",
        headline: "A few details to keep handy.",
        body: `<p style="margin:0;">Hi ${escapeHtml(firstName)},</p><p>We are looking forward to ${escapeHtml(bowlingEventConfig.name)}.</p><p><strong>Date:</strong> ${escapeHtml(bowlingEventConfig.date)}<br /><strong>Location:</strong> ${escapeHtml(bowlingEventConfig.venue)}, ${escapeHtml(bowlingEventConfig.city)}<br /><strong>Confirmation code:</strong> ${escapeHtml(registration.id)}</p><p>If anything changes or you have a question, email ${escapeHtml(bowlingEventConfig.contactName)} at <a href="mailto:${escapeHtml(bowlingEventConfig.contactEmail)}" style="color:#112F6D;font-weight:800;">${escapeHtml(bowlingEventConfig.contactEmail)}</a>.</p>`,
        ctaLabel: canManageTeam ? "Update bowler names" : undefined,
        ctaHref: canManageTeam ? publicTeamUrl : undefined,
      }),
    },
  ];
}
