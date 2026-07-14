import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { bowlingEventConfig, paymentPreferenceLabels } from "./config";
import type { BowlingPaymentStatus, BowlingRegistrationRecord } from "./types";

const NAVY = rgb(0.067, 0.184, 0.427); // #112F6D
const INK = rgb(0.067, 0.075, 0.184); // #11132F
const SLATE = rgb(0.188, 0.196, 0.31); // #30324F
const MINT = rgb(0.365, 0.796, 0.639); // #5DCBA3
const SAND = rgb(0.969, 0.949, 0.909); // #F7F2E8

const paymentStatusLabels: Record<BowlingPaymentStatus, string> = {
  paid: "Paid",
  pending: "Payment pending",
  invoice_requested: "Invoice requested",
  check_pledged: "Check pledged",
};

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatIssuedDate = (iso: string) => {
  const date = new Date(iso);
  const usable = Number.isNaN(date.getTime()) ? new Date() : date;
  return usable.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Build a branded one-page PDF receipt for a bowling registration.
 * Pure pdf-lib (no native deps) so it runs in the Vercel Node runtime.
 */
export async function buildBowlingReceiptPdf(
  registration: BowlingRegistrationRecord,
): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.setTitle(`City Center Events Receipt ${registration.id}`);
  doc.setAuthor("City Center");
  doc.setSubject(bowlingEventConfig.name);

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const page = doc.addPage([612, 792]); // US Letter
  const { width, height } = page.getSize();
  const marginX = 56;
  const contentWidth = width - marginX * 2;
  const isGiftOnly = registration.registrationType === "gift";

  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number,
    typeface: PDFFont,
    color = INK,
  ) => {
    page.drawText(text, { x, y, size, font: typeface, color });
  };

  // Header band
  page.drawRectangle({ x: 0, y: height - 132, width, height: 132, color: NAVY });
  drawText("CITY CENTER", marginX, height - 58, 22, bold, rgb(1, 1, 1));
  drawText(
    isGiftOnly ? "GIFT RECEIPT" : "REGISTRATION RECEIPT",
    marginX,
    height - 84,
    11,
    bold,
    MINT,
  );
  drawText(bowlingEventConfig.name, marginX, height - 108, 12, font, rgb(0.9, 0.93, 1));

  let cursorY = height - 176;

  // Reference + issued date row
  drawText("CONFIRMATION CODE", marginX, cursorY, 9, bold, SLATE);
  drawText(registration.id, marginX, cursorY - 20, 18, bold, NAVY);

  drawText("ISSUED", width - marginX - 150, cursorY, 9, bold, SLATE);
  drawText(
    formatIssuedDate(registration.createdAt),
    width - marginX - 150,
    cursorY - 18,
    12,
    font,
    INK,
  );

  cursorY -= 56;
  page.drawLine({
    start: { x: marginX, y: cursorY },
    end: { x: width - marginX, y: cursorY },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.88),
  });
  cursorY -= 30;

  // Two-column label/value detail rows (tight spacing so the receipt always
  // fits on a single page even with the maximum number of fields).
  const labelValue = (label: string, value: string) => {
    drawText(label.toUpperCase(), marginX, cursorY, 9, bold, SLATE);
    const wrapped = wrapText(value || "—", font, 12, contentWidth);
    wrapped.forEach((line, index) => {
      drawText(line, marginX, cursorY - 14 - index * 14, 12, font, INK);
    });
    cursorY -= 14 + wrapped.length * 14 + 6;
  };

  const buyerName = `${registration.buyerFirstName} ${registration.buyerLastName}`.trim();
  labelValue(isGiftOnly ? "Donor" : "Registrant", buyerName);
  labelValue("Email", registration.buyerEmail);
  if (registration.organization) {
    labelValue("Organization", registration.organization);
  }
  labelValue(isGiftOnly ? "Support type" : "Registration", registration.packageName);
  if (registration.sessionName) {
    labelValue("Session", registration.sessionName);
  }
  labelValue(
    "Event",
    `${bowlingEventConfig.date} · ${bowlingEventConfig.venue}, ${bowlingEventConfig.city}`,
  );
  labelValue("Payment path", paymentPreferenceLabels[registration.paymentPreference]);
  labelValue("Payment status", paymentStatusLabels[registration.paymentStatus]);

  // Amount summary box
  cursorY -= 2;
  const boxHeight = registration.donationTotal > 0 ? 104 : 78;
  const boxTop = cursorY;
  page.drawRectangle({
    x: marginX,
    y: boxTop - boxHeight,
    width: contentWidth,
    height: boxHeight,
    color: SAND,
  });
  page.drawRectangle({
    x: marginX,
    y: boxTop - boxHeight,
    width: 4,
    height: boxHeight,
    color: MINT,
  });

  let boxY = boxTop - 24;
  const amountRow = (label: string, value: string, emphasize = false) => {
    const typeface = emphasize ? bold : font;
    const size = emphasize ? 14 : 12;
    const color = emphasize ? NAVY : SLATE;
    drawText(label, marginX + 20, boxY, size, typeface, color);
    const valueWidth = typeface.widthOfTextAtSize(value, size);
    drawText(value, width - marginX - 20 - valueWidth, boxY, size, typeface, color);
    boxY -= emphasize ? 24 : 20;
  };

  if (registration.subtotal > 0) {
    amountRow(
      isGiftOnly ? "Gift" : "Registration subtotal",
      formatMoney(registration.subtotal),
    );
  }
  if (registration.donationTotal > 0) {
    amountRow(
      isGiftOnly ? "Gift" : "Additional gift",
      formatMoney(registration.donationTotal),
    );
  }
  amountRow("Total", formatMoney(registration.grandTotal), true);

  // Footer / contact — flows after the amount box so it never overlaps content.
  const footerTop = boxTop - boxHeight - 34;
  page.drawLine({
    start: { x: marginX, y: footerTop + 18 },
    end: { x: width - marginX, y: footerTop + 18 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.88),
  });
  const footerLines = wrapText(
    "This receipt confirms your registration and payment path for the event above. " +
      `For questions or a tax acknowledgment, contact ${bowlingEventConfig.contactName} at ${bowlingEventConfig.contactEmail}.`,
    font,
    10,
    contentWidth,
  );
  footerLines.forEach((line, index) => {
    drawText(line, marginX, footerTop - index * 14, 10, font, SLATE);
  });
  drawText(
    "Thank you for standing with students and families. — City Center",
    marginX,
    footerTop - footerLines.length * 14 - 12,
    10,
    bold,
    NAVY,
  );

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [text];
}
