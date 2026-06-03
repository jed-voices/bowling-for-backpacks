import { createHmac, timingSafeEqual } from "node:crypto";

const tokenVersion = "v1";

const getEntitlementSecret = () =>
  process.env.GALA_ENTITLEMENT_SECRET ||
  process.env.ADMIN_SECRET ||
  process.env.SITE_URL ||
  "gala-prototype-entitlement-secret";

const encode = (value: string) => Buffer.from(value, "utf8").toString("base64url");

const decode = (value: string) => Buffer.from(value, "base64url").toString("utf8");

const sign = (registrationId: string) =>
  createHmac("sha256", getEntitlementSecret())
    .update(`${tokenVersion}.${registrationId}`)
    .digest("base64url");

export const buildGalaAccessToken = (registrationId: string) =>
  `${tokenVersion}.${encode(registrationId)}.${sign(registrationId)}`;

export const verifyGalaAccessToken = (token: string) => {
  const [version, encodedRegistrationId, signature] = token.split(".");

  if (version !== tokenVersion || !encodedRegistrationId || !signature) {
    return null;
  }

  try {
    const registrationId = decode(encodedRegistrationId);
    const expectedSignature = sign(registrationId);
    const actual = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);

    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      return null;
    }

    return registrationId;
  } catch {
    return null;
  }
};
