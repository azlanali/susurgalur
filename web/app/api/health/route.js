/**
 * GET /api/health — heartbeat for uptime monitoring and the Jaga agent.
 * Returns 200 when the app is up; "db" tells you whether Supabase is
 * reachable ("ok"), not yet set up ("unconfigured"), or broken ("error").
 */
import { serviceClient, isConfigured } from "@/lib/supabase/server.js";

export const dynamic = "force-dynamic";

export async function GET() {
  let db = "unconfigured";

  if (isConfigured()) {
    try {
      const supabase = serviceClient();
      const { error } = await supabase
        .from("trees")
        .select("id", { count: "exact", head: true });
      db = error ? "error" : "ok";
    } catch {
      db = "error";
    }
  }

  const healthy = db !== "error";
  return Response.json(
    {
      status: healthy ? "ok" : "degraded",
      db,
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev",
      time: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}
