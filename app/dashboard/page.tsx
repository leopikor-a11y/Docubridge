import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { ArrowUpRight, FileText, Plus, LayoutDashboard, FolderOpen, Settings, LogOut, ShieldCheck, Clock3, CheckCircle2, Wallet, Search, ChevronRight, Sparkles } from "lucide-react";

export const metadata = { title: "Dashboard | DocuBridge" };

const labels: Record<string,string> = {
  invoice: "Invoice & receipt builder",
  "id-cards": "Organisation ID card",
  "passport-generator": "Fictional passport prop",
  "driving-licence-generator": "Fictional driving-card prop",
  "utility-sample": "Utility statement sample",
  certificates: "Certificate designer"
};

const shortcuts = [
  { title: "Create an invoice", desc: "Professional invoices and receipts", href: "/services/invoice", icon: "↗", color: "mint" },
  { title: "Design an ID card", desc: "Employee, member and event cards", href: "/services/id-cards", icon: "▣", color: "violet" },
  { title: "Make a certificate", desc: "Awards and course certificates", href: "/services/certificates", icon: "✧", color: "amber" },
  { title: "QR & barcode tools", desc: "Create codes in your browser", href: "/tools", icon: "⌗", color: "blue" }
];

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

  const total = entries.length;
  const draftCount = entries.filter((order: any) => order.status === "draft").length;
  const completedCount = entries.filter((order: any) => order.status === "completed").length;
  const totalPaid = entries.filter((order: any) => ["paid","processing","completed"].includes(order.status)).reduce((sum: number, order: any) => sum + Number(order.amount_usd || 0), 0);
  const firstName = (user.email || "there").split("@")[0].split(/[._-]/)[0];

  return <main className="db-dashboard">
    <aside className="db-sidebar">
      <a href="/" className="db-logo"><span className="db-logo-mark">d.</span><span>docubridge</span></a>
      <div className="db-side-label">WORKSPACE</div>
      <nav className="db-side-nav">
        <a className="active" href="/dashboard"><LayoutDashboard size={17}/> Overview <span className="nav-dot"/></a>
        <a href="/#services"><FileText size={17}/> Document studio</a>
        <a href="/tools"><Sparkles size={17}/> Quick tools</a>
        <a href="/dashboard#documents"><FolderOpen size={17}/> My documents</a>
      </nav>
      <div className="db-sidebar-bottom">
        <div className="db-secure-card"><ShieldCheck size={17}/><strong>Your files stay private</strong><span>Only your account can access saved documents.</span></div>
        <form action="/auth/signout" method="post"><button className="db-signout"><LogOut size={16}/> Sign out</button></form>
        <div className="db-side-user"><div className="db-avatar">{(user.email || "U").slice(0,1).toUpperCase()}</div><div><strong>{user.email}</strong><span>Customer account</span></div><Settings size={16}/></div>
      </div>
    </aside>

    <section className="db-main">
      <header className="db-topbar">
        <div className="db-breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div>
        <div className="db-top-actions"><div className="db-search"><Search size={15}/><span>Search workspace</span><kbd>⌘ K</kbd></div><span className="db-top-avatar">{(user.email || "U").slice(0,1).toUpperCase()}</span></div>
      </header>

      <div className="db-content">
        <section className="db-welcome">
          <div><div className="db-welcome-kicker"><span/> YOUR PERSONAL WORKSPACE</div><h1>Good to see you, {firstName}.</h1><p>Everything you need to create and manage your documents, all in one place.</p></div>
          <a className="db-create-main" href="/#services"><Plus size={17}/> Create a document <ArrowUpRight size={16}/></a>
        </section>

        <section className="db-stats">
          <article className="db-stat"><div className="db-stat-top"><span>Total documents</span><span className="db-stat-icon"><FileText size={17}/></span></div><strong>{total}</strong><small>Saved in your workspace</small></article>
          <article className="db-stat"><div className="db-stat-top"><span>Drafts</span><span className="db-stat-icon yellow"><Clock3 size={17}/></span></div><strong>{draftCount}</strong><small>Ready for your review</small></article>
          <article className="db-stat"><div className="db-stat-top"><span>Completed</span><span className="db-stat-icon green"><CheckCircle2 size={17}/></span></div><strong>{completedCount}</strong><small>Completed documents</small></article>
          <article className="db-stat"><div className="db-stat-top"><span>Paid orders</span><span className="db-stat-icon blue"><Wallet size={17}/></span></div><strong>${totalPaid.toFixed(2)}</strong><small>Confirmed paid transactions</small></article>
        </section>

        <section className="db-section">
          <div className="db-section-heading"><div><span className="db-section-kicker">GET STARTED</span><h2>What would you like to create?</h2></div><a href="/#services">View all services <ArrowUpRight size={14}/></a></div>
          <div className="db-shortcuts">{shortcuts.map((item) => <a href={item.href} className="db-shortcut" key={item.title}><span className={"db-shortcut-icon "+item.color}>{item.icon}</span><span className="db-shortcut-text"><strong>{item.title}</strong><small>{item.desc}</small></span><ChevronRight size={16}/></a>)}</div>
        </section>

        <section className="db-section db-documents" id="documents">
          <div className="db-section-heading"><div><span className="db-section-kicker">YOUR FILE LIBRARY</span><h2>Recent documents</h2></div><a href="/#services">Create new <Plus size={14}/></a></div>
          {error ? <div className="db-empty"><strong>Documents could not be loaded.</strong><span>Please refresh the page. Your account remains signed in.</span></div> : entries.length === 0 ? <div className="db-empty"><div className="db-empty-icon"><FolderOpen size={23}/></div><strong>Your library is ready.</strong><span>Saved drafts will appear here. Open any studio tool and choose “Save to workspace”.</span><a href="/#services">Explore document studio <ArrowUpRight size={14}/></a></div> :
            <div className="db-table-wrap"><table className="db-table"><thead><tr><th>DOCUMENT</th><th>DATE CREATED</th><th>STATUS</th><th>FILES</th><th/></tr></thead><tbody>{entries.map((order: any) => <tr key={order.id}><td><span className="db-file-icon"><FileText size={17}/></span><span className="db-doc-name"><strong>{labels[order.service_slug] || order.service_slug}</strong><small>REF {order.id.slice(0,8).toUpperCase()}</small></span></td><td>{new Date(order.created_at).toLocaleDateString()}</td><td><span className={"db-status "+order.status}>{order.status.replace("_"," ")}</span></td><td><span className="db-file-links">{order.files.filter((file: any) => file.signedUrl).map((file: any) => <a href={file.signedUrl} target="_blank" rel="noreferrer" key={file.id}>Preview ↗</a>)}{order.files.length === 0 ? "—" : ""}</span></td><td><ArrowUpRight size={15}/></td></tr>)}</tbody></table></div>}
        </section>
        <footer className="db-footer"><span>© {new Date().getFullYear()} DocuBridge</span><span><ShieldCheck size={13}/> Secure customer workspace</span></footer>
      </div>
    </section>
  </main>;
}
