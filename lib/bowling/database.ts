import { createClient } from "@supabase/supabase-js";
import type {
  Bowler,
  BowlingPaymentStatus,
  BowlingRegistrationRecord,
} from "./types";

type BowlingRegistrationRow = {
  id: string;
  created_at: string;
  registration_type: BowlingRegistrationRecord["registrationType"];
  package_id: string | null;
  package_name: string | null;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  organization: string | null;
  team_name: string | null;
  session_id: string | null;
  session_name: string | null;
  lane_count: number;
  subtotal: number;
  donation_total: number;
  grand_total: number;
  optional_gift: number;
  sponsor_logo_name: string | null;
  save_team_link: boolean;
  payment_preference: BowlingRegistrationRecord["paymentPreference"];
  payment_status: BowlingRegistrationRecord["paymentStatus"];
  export_status: BowlingRegistrationRecord["exportStatus"];
  notes: string | null;
  bowling_bowlers?: BowlingBowlerRow[];
};

type BowlingBowlerRow = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
};

type PaymentUpdateInput = {
  paymentStatus: BowlingPaymentStatus;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
};

type TeamUpdateInput = {
  teamName?: string;
  bowlers: Bowler[];
};

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
};

export const isBowlingDatabaseConfigured = () => Boolean(getSupabaseConfig());

const getSupabaseAdmin = () => {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

const bowlerToRow = (registrationId: string, bowler: Bowler) => ({
  registration_id: registrationId,
  first_name: bowler.firstName,
  last_name: bowler.lastName,
  email: bowler.email,
  phone: bowler.phone,
  notes: bowler.notes,
});

const rowToBowler = (row: BowlingBowlerRow): Bowler => ({
  firstName: row.first_name ?? "",
  lastName: row.last_name ?? "",
  email: row.email ?? "",
  phone: row.phone ?? "",
  notes: row.notes ?? "",
});

const registrationToRow = (registration: BowlingRegistrationRecord) => ({
  id: registration.id,
  created_at: registration.createdAt,
  registration_type: registration.registrationType,
  package_id: registration.packageId,
  package_name: registration.packageName,
  buyer_first_name: registration.buyerFirstName,
  buyer_last_name: registration.buyerLastName,
  buyer_email: registration.buyerEmail,
  buyer_phone: registration.buyerPhone,
  organization: registration.organization,
  team_name: registration.teamName,
  session_id: registration.sessionId,
  session_name: registration.sessionName,
  lane_count: registration.laneCount,
  subtotal: registration.subtotal,
  donation_total: registration.donationTotal,
  grand_total: registration.grandTotal,
  optional_gift: registration.optionalGift,
  sponsor_logo_name: registration.sponsorLogoName ?? "",
  save_team_link: registration.saveTeamLink,
  payment_preference: registration.paymentPreference,
  payment_status: registration.paymentStatus,
  export_status: registration.exportStatus,
  notes: registration.notes,
});

const rowToRegistration = (row: BowlingRegistrationRow): BowlingRegistrationRecord => ({
  id: row.id,
  createdAt: row.created_at,
  registrationType: row.registration_type,
  packageId: row.package_id ?? "",
  packageName: row.package_name ?? "",
  buyerFirstName: row.buyer_first_name,
  buyerLastName: row.buyer_last_name,
  buyerEmail: row.buyer_email,
  buyerPhone: row.buyer_phone ?? "",
  organization: row.organization ?? "",
  teamName: row.team_name ?? "",
  sessionId: row.session_id ?? "",
  sessionName: row.session_name ?? "",
  laneCount: row.lane_count,
  subtotal: row.subtotal,
  donationTotal: row.donation_total,
  grandTotal: row.grand_total,
  optionalGift: row.optional_gift,
  sponsorLogoName: row.sponsor_logo_name ?? "",
  notes: row.notes ?? "",
  paymentPreference: row.payment_preference,
  paymentStatus: row.payment_status,
  exportStatus: row.export_status,
  saveTeamLink: row.save_team_link,
  bowlers: (row.bowling_bowlers ?? []).map(rowToBowler),
});

export const createBowlingRegistration = async (registration: BowlingRegistrationRecord) => {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { configured: false as const, registration };
  }

  const { error } = await supabase.from("bowling_registrations").insert(registrationToRow(registration));

  if (error) {
    throw new Error(error.message);
  }

  const bowlerRows = registration.bowlers
    .filter((bowler) => Boolean(bowler.firstName || bowler.lastName || bowler.email || bowler.phone || bowler.notes))
    .map((bowler) => bowlerToRow(registration.id, bowler));

  if (bowlerRows.length > 0) {
    const { error: bowlersError } = await supabase.from("bowling_bowlers").insert(bowlerRows);

    if (bowlersError) {
      throw new Error(bowlersError.message);
    }
  }

  if (registration.registrationType === "lane-sponsor") {
    const sponsorName = registration.organization || `${registration.buyerFirstName} ${registration.buyerLastName}`.trim();

    const { error: laneSponsorError } = await supabase.from("bowling_lane_sponsors").insert({
      registration_id: registration.id,
      sponsor_name: sponsorName,
      recognition_name: sponsorName,
      payment_status: registration.paymentStatus,
    });

    if (laneSponsorError) {
      throw new Error(laneSponsorError.message);
    }
  }

  return { configured: true as const, registration };
};

export const getBowlingRegistration = async (registrationId: string) => {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("bowling_registrations")
    .select("*, bowling_bowlers(*)")
    .eq("id", registrationId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? rowToRegistration(data as BowlingRegistrationRow) : null;
};

export const listBowlingRegistrations = async () => {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("bowling_registrations")
    .select("*, bowling_bowlers(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => rowToRegistration(row as BowlingRegistrationRow));
};

export const updateBowlingRegistrationPayment = async (registrationId: string, update: PaymentUpdateInput) => {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { configured: false as const };
  }

  const { error } = await supabase
    .from("bowling_registrations")
    .update({
      payment_status: update.paymentStatus,
      stripe_checkout_session_id: update.stripeCheckoutSessionId,
      stripe_payment_intent_id: update.stripePaymentIntentId,
    })
    .eq("id", registrationId);

  if (error) {
    throw new Error(error.message);
  }

  if (update.paymentStatus === "paid") {
    await supabase.from("bowling_lane_sponsors").update({ payment_status: "paid" }).eq("registration_id", registrationId);
  }

  return { configured: true as const };
};

export const deletePendingBowlingRegistration = async (registrationId: string) => {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { configured: false as const, deleted: false };
  }

  const { data, error } = await supabase
    .from("bowling_registrations")
    .delete()
    .eq("id", registrationId)
    .eq("payment_preference", "card")
    .eq("payment_status", "pending")
    .select("id");

  if (error) {
    throw new Error(error.message);
  }

  return { configured: true as const, deleted: Boolean(data?.length) };
};

export const updateBowlingRegistrationExportStatus = async (
  registrationId: string,
  exportStatus: BowlingRegistrationRecord["exportStatus"],
) => {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { configured: false as const };
  }

  const { error } = await supabase
    .from("bowling_registrations")
    .update({ export_status: exportStatus })
    .eq("id", registrationId);

  if (error) {
    throw new Error(error.message);
  }

  return { configured: true as const };
};

export const updateBowlingTeamDetails = async (registrationId: string, update: TeamUpdateInput) => {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { configured: false as const };
  }

  const { error: registrationError } = await supabase
    .from("bowling_registrations")
    .update({ team_name: update.teamName ?? "" })
    .eq("id", registrationId);

  if (registrationError) {
    throw new Error(registrationError.message);
  }

  const { error: deleteError } = await supabase.from("bowling_bowlers").delete().eq("registration_id", registrationId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const bowlerRows = update.bowlers
    .filter((bowler) => Boolean(bowler.firstName || bowler.lastName || bowler.email || bowler.phone || bowler.notes))
    .map((bowler) => bowlerToRow(registrationId, bowler));

  if (bowlerRows.length > 0) {
    const { error: insertError } = await supabase.from("bowling_bowlers").insert(bowlerRows);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  return { configured: true as const };
};
