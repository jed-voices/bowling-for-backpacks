import { NextResponse } from "next/server";
import { sampleRegistrations } from "@/lib/gala/config";
import { bloomerangExports } from "@/lib/gala/export-bloomerang";
import {
  buildBackendPayload,
  greaterGivingExports,
} from "@/lib/gala/export-greater-giving";
import { isDevelopmentAuthenticated } from "@/lib/events/development-auth";

type ExportRouteProps = {
  params: Promise<{ type: string }>;
};

const isAdminRequest = async (request: Request) => {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  if (await isDevelopmentAuthenticated()) {
    return true;
  }

  const previewKey = process.env.GALA_ADMIN_PREVIEW_KEY;
  const url = new URL(request.url);
  const key = url.searchParams.get("key") ?? request.headers.get("x-gala-admin-key");

  return Boolean(previewKey && key === previewKey);
};

const csvResponse = (csv: string, filename: string) =>
  new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });

export async function GET(request: Request, { params }: ExportRouteProps) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await params;

  switch (type) {
    case "greater-giving-sales":
      return csvResponse(
        greaterGivingExports.salesCsv(sampleRegistrations),
        "greater-giving-sales-preview.csv",
      );
    case "greater-giving-supporters":
      return csvResponse(
        greaterGivingExports.supportersCsv(sampleRegistrations),
        "greater-giving-supporters-preview.csv",
      );
    case "chance-to-win":
      return csvResponse(
        greaterGivingExports.chanceCsv(sampleRegistrations),
        "chance-to-win-preview.csv",
      );
    case "bloomerang-transactions":
      return csvResponse(
        bloomerangExports.transactionsCsv(sampleRegistrations),
        "bloomerang-transactions-preview.csv",
      );
    case "backend-json":
      return NextResponse.json(buildBackendPayload(sampleRegistrations), {
        headers: {
          "Content-Disposition": 'attachment; filename="gala-backend-preview.json"',
        },
      });
    default:
      return NextResponse.json({ error: "Unknown export type." }, { status: 404 });
  }
}
