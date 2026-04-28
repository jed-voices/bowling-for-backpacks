import { NextResponse } from "next/server";
import { sampleBowlingRegistrations } from "@/lib/bowling/config";
import { listBowlingRegistrations } from "@/lib/bowling/database";
import { bowlingExports } from "@/lib/bowling/export-bloomerang";
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

  const previewKey = process.env.BOWLING_ADMIN_PREVIEW_KEY;
  const url = new URL(request.url);
  const key = url.searchParams.get("key") ?? request.headers.get("x-bowling-admin-key");

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
  const liveRegistrations = await listBowlingRegistrations();
  const registrations = liveRegistrations ?? sampleBowlingRegistrations;
  const source = liveRegistrations ? "supabase" : "static-prototype";

  switch (type) {
    case "bloomerang-transactions":
      return csvResponse(
        bowlingExports.bloomerangCsv(registrations),
        "bowling-bloomerang-transactions-preview.csv",
      );
    case "operations":
      return csvResponse(
        bowlingExports.operationsCsv(registrations),
        "bowling-operations-preview.csv",
      );
    case "backend-json":
      return NextResponse.json(
        {
          generatedAt: new Date().toISOString(),
          source,
          registrations,
        },
        {
          headers: {
            "Content-Disposition": 'attachment; filename="bowling-backend-preview.json"',
          },
        },
      );
    default:
      return NextResponse.json({ error: "Unknown export type." }, { status: 404 });
  }
}
