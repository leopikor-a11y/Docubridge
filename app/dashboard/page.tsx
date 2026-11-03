import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export const metadata = { title: "My workspace | DocuBridge" };

const labels: Record<string,string> = {
  invoice: "Invoice & receipt",
  "id-cards": "Organisation ID card",
  "passport-generator": "Fictional passport prop",
  "driving-licence-generator": "Fictional driving-card prop",
  "utility-sample": "Utility statement sample",
  certificates: "Certificate"
};

export default async function DashboardPage() {
  let supabase;
  try { supabase = await createClient(); } catch { redirect("/account?setup=required"); }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account");

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id,service_slug,status,currency,amount_usd,created_at,order_files(id,storage_path,file_kind,created_at)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const entries = await Promise.all((orders || []).map(async (order: any) => {
    const files = await Promise.all((order.order_files || []).map(async (file: any) => {
      const { data } = await supabase.storage.from("customer-documents").createSignedUrl(file.storage_path, 60 * 10);
      return { ...file, signedUrl: data?.signedUrl || null };
    }));
    return { ...order, files };
  }));

  return <main className="workspace-shell">
    <header className="workspace-header">
      <a className="workspace-brand" href="/"><span>d.</span> docubridge</a>
      <nav><a href="/">Studio</a><a href="/tools">Quick tools</a><form action="/auth/signout" method="post"><button>Sign out</button></form></nav>
    </header>
    <section className="workspace-welcome">
      <div><div className="workspace-kicker">YOUR PRIVATE WORKSPACE</div><h1>Your documents,<br/><em>all in one place.</em></h1><p>Manage saved drafts and access your private document previews.</p></div>
      <div className="workspace-user"><small>SIGNED IN AS</small><strong>{user.email}</strong><span><i/> Account active</span></div>
    </section>
    <section className="workspace-list">
      <div className="workspace-list-heading"><div><span>DOCUMENT HISTORY</span><h2>Your saved work</h2></div><a href="/">Create a document <b>↗</b></a></div>
      {error ? <div className="workspace-empty"><strong>We couldn’t load your documents.</strong><p>Please refresh the page or sign in again.</p></div> : entries.length === 0 ? <div className="workspace-empty"><div className="empty-illustration">▤</div><h3>Your workspace is ready.</h3><p>When you save a draft from any editor, it will appear here. Your documents are stored privately under your account.</p><a href="/">Explore document studio <b>→</b></a></div> :
      <div className="workspace-order-list">{entries.map((order: any) => <article className="workspace-order" key={order.id}>
        <div className="workspace-order-icon">▤</div>
        <div className="workspace-order-main"><strong>{labels[order.service_slug] || order.service_slug}</strong><span>Created {new Date(order.created_at).toLocaleDateString()} · Ref {order.id.slice(0,8).toUpperCase()}</span>
          <div className="workspace-file-links">{order.files.map((file: any) => file.signedUrl ? <a href={file.signedUrl} target="_blank" rel="noreferrer" key={file.id}>Open private preview ↗</a> : <span key={file.id}>Preview temporarily unavailable</span>)}</div>
        </div>
        <span className="workspace-status">{order.status.replace("_"," ")}</span>
      </article>)}</div>}
    </section>
    <footer className="workspace-footer">Private account storage · Draft saves do not constitute payment or order acceptance.</footer>
  </main>;
}
