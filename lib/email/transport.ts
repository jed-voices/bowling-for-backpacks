import { Resend } from "resend";

/**
 * Transactional email transport for City Center Events, backed by Resend.
 *
 * All configuration comes from environment variables so no credentials live in
 * the repo.
 *
 * Required to enable sending:
 *  - RESEND_API_KEY   an API key from https://resend.com (the sending domain,
 *                     e.g. okcitycenterevents.org, must be verified in Resend)
 *
 * Optional overrides:
 *  - EMAIL_FROM       default `City Center Events <receipts@okcitycenterevents.org>`
 *  - EMAIL_REPLY_TO   default kimberly@okcitycenter.org (event contact)
 */

export type EmailConfig = {
  apiKey: string;
  from: string;
  replyTo: string;
};

const DEFAULT_FROM = "City Center Events <receipts@okcitycenterevents.org>";
const DEFAULT_REPLY_TO = "kimberly@okcitycenter.org";

export const getEmailConfig = (): EmailConfig | null => {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  // Without an API key there is nothing to send with.
  if (!apiKey) {
    return null;
  }

  const from = process.env.EMAIL_FROM?.trim() || DEFAULT_FROM;
  const replyTo = process.env.EMAIL_REPLY_TO?.trim() || DEFAULT_REPLY_TO;

  return { apiKey, from, replyTo };
};

export const isEmailConfigured = () => Boolean(getEmailConfig());

let cachedClient: Resend | null = null;
let cachedKey = "";

export const getResendClient = (): Resend | null => {
  const config = getEmailConfig();

  if (!config) {
    return null;
  }

  if (cachedClient && cachedKey === config.apiKey) {
    return cachedClient;
  }

  cachedClient = new Resend(config.apiKey);
  cachedKey = config.apiKey;

  return cachedClient;
};
