import Stripe from "stripe";
import { bowlingEventConfig } from "./config";
import type { BowlingRegistrationRecord } from "./types";

export const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-04-22.dahlia",
  });
};

const cents = (amount: number) => Math.round(amount * 100);

const compactMetadataValue = (value: string | number | undefined) =>
  String(value ?? "").slice(0, 500);

type CheckoutLineItem = {
  quantity: number;
  price_data: {
    currency: "usd";
    unit_amount: number;
    product_data: {
      name: string;
      description: string;
    };
  };
};

export const buildBowlingCheckoutLineItems = (
  registration: BowlingRegistrationRecord,
): CheckoutLineItem[] => {
  const lineItems: CheckoutLineItem[] = [];

  if (registration.subtotal > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: cents(registration.subtotal),
        product_data: {
          name: registration.packageName,
          description: bowlingEventConfig.name,
        },
      },
    });
  }

  if (registration.donationTotal > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: cents(registration.donationTotal),
        product_data: {
          name: "Additional Gift",
          description: bowlingEventConfig.cause,
        },
      },
    });
  }

  return lineItems;
};

export const buildBowlingStripeMetadata = (registration: BowlingRegistrationRecord) => ({
  registration_id: compactMetadataValue(registration.id),
  event: "bowling-for-backpacks",
  registration_type: compactMetadataValue(registration.registrationType),
  package_id: compactMetadataValue(registration.packageId),
  package_name: compactMetadataValue(registration.packageName),
  session_id: compactMetadataValue(registration.sessionId),
  session_name: compactMetadataValue(registration.sessionName),
  buyer_email: compactMetadataValue(registration.buyerEmail),
  organization: compactMetadataValue(registration.organization),
  team_name: compactMetadataValue(registration.teamName),
  subtotal: compactMetadataValue(registration.subtotal),
  donation_total: compactMetadataValue(registration.donationTotal),
  grand_total: compactMetadataValue(registration.grandTotal),
});
