import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export const metadata = { title: "My workspace | DocuBridge" };

export default async function DashboardPage() {
  let supabase;
  try { supabase = await createClient(); } catch { redirect("/account?setup=required"); }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account");
  return <main className="wrap toolPage"><a className="backLink" href="/">← DocuBridge</a><div className="eyebrow">CUSTOMER WORKSPACE</div><h1 className="pageTitle">Welcome back.</h1><p className="lead">Signed in as {user.email}. Your document workspace is ready for the next stage of order and file management.</p><div className="serviceDetail"><h2>Your workspace</h2><p>Orders and generated documents will appear here when order storage and document generation are connected.</p><a className="button secondary" href="/tools">Open digital tools</a><form action="/auth/signout" method="post"><button className="button primary">Sign out</button></form></div></main>;
}
