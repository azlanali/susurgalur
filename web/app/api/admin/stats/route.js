/**
 * GET /api/admin/stats — aggregate numbers for the /admin dashboard.
 *
 * Access: if ADMIN_STATS_TOKEN is set (always set it in production),
 * the request must send the same token. This is the placeholder gate
 * until Supabase Auth lands (Stage 2 step 3) — then switch to a real
 * session check against ADMIN_EMAILS. Only aggregate counts are exposed,
 * never personal data.
 */
import { serviceClient, isConfigured } from "@/lib/supabase/server.js";

export const dynamic = "force-dynamic";

const DEMO = {
  live: false,
  note: "Supabase belum disambung — angka contoh sahaja.",
  users: 128, trees: 17, persons: 2140, medianTreeSize: 96,
  treesOver50: 9, signups7d: 23, activatedFamilies: 6,
};

export async function GET(request) {
  const required = process.env.ADMIN_STATS_TOKEN;
  if (required) {
    const sent = request.headers.get("x-admin-token");
    if (sent !== required) {
      return Response.json({ error: "unauthorised" }, { status: 401 });
    }
  }

  if (!isConfigured()) return Response.json(DEMO);

  try {
    const supabase = serviceClient();
    const count = async (table) => {
      const { count: n, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return n ?? 0;
    };

    const [users, trees, persons, memberships] = await Promise.all([
      count("profiles"),
      count("trees"),
      count("persons"),
      count("memberships"),
    ]);

    return Response.json({
      live: true,
      users,
      trees,
      persons,
      memberships,
      time: new Date().toISOString(),
    });
  } catch (e) {
    return Response.json({ live: false, error: String(e?.message || e) }, { status: 500 });
  }
}
