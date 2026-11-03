import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import AccountClient from "./account-client";

export const metadata = { title: "Sign in | DocuBridge" };

export default async function AccountPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
  }

  return <main className="db-auth-page">
    <a href="/" className="db-auth-brand"><span>d.</span> docubridge</a>
    <div className="db-auth-layout">
      <section className="db-auth-promo">
        <div className="db-auth-kicker"><i/> YOUR DOCUMENT WORKSPACE</div>
        <h1>Good work<br/>deserves a<br/><em>better space.</em></h1>
        <p>Create, organise and access your documents in one calm, secure workspace.</p>
        <div className="db-auth-points"><span>✓ Simple document tools</span><span>✓ Private saved files</span><span>✓ Your work, all together</span></div>
        <div className="db-auth-decoration"><div className="db-auth-paper"><span>DOCUBRIDGE</span><b>INVOICE</b><i/><i/><i/><strong>PREVIEW READY</strong></div><div className="db-auth-orb"/></div>
      </section>
      <section className="db-auth-form-wrap"><div className="db-auth-form-head"><span>WELCOME TO DOCUBRIDGE</span><h2>Sign in to your space.</h2><p>Enter your details to continue to your dashboard.</p></div><AccountClient/><small className="db-auth-privacy"> <span>◈</span> Your account and saved documents are private.</small></section>
    </div>
    <footer className="db-auth-footer">© {new Date().getFullYear()} DocuBridge <span>Secure customer workspace</span></footer>
  </main>;
}
