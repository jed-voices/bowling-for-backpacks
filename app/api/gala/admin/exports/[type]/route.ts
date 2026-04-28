import { NextResponse } from "next/server";
import { bloomerangExports } from "@/lib/gala/export-bloomerang";
import {
  buildBackendPayload,
  greaterGivingExports,
} from "@/lib/gala/export-greater-giving";
import type { GalaRegistrationRecord } from "@/lib/gala/types";
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
  const registrations: GalaRegistrationRecord[] = [];

  switch (type) {
    case "greater-giving-sales":
      return csvResponse(
        greaterGivingExports.salesCsv(registrations),
        "greater-giving-sales.csv",
      );
    case "greater-giving-supporters":
      return csvResponse(
        greaterGivingExports.supportersCsv(registrations),
        "greater-giving-supporters.csv",
      );
    case "chance-to-win":
      return csvResponse(
        greaterGivingExports.chanceCsv(registrations),
        "chance-to-win.csv",
      );
    case "bloomerang-transactions":
      return csvResponse(
        bloomerangExports.transactionsCsv(registrations),
        "bloomerang-transactions.csv",
      );
    case "backend-json":
      return NextResponse.json(buildBackendPayload(registrations), {
        headers: {
          "Content-Disposition": 'attachment; filename="gala-backend.json"',
        },
      });
    default:
      return NextResponse.json({ error: "Unknown export type." }, { status: 404 });
  }
}
