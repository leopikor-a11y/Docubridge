"use client";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function AccountClient() {
  const [mode,setMode] = useState<"signin"|"signup">("signup");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const supabase=createClient();
      const result=mode==="signup"
        ? await supabase.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+"/auth/callback"}})
        : await supabase.auth.signInWithPassword({email,password});
      if(result.error) throw result.error;
      if(mode==="signup" && !result.data.session) setMessage("Account created. Check your email to confirm your address, then sign in.");
      else window.location.href="/dashboard";
    } catch(err) { setMessage(err instanceof Error ? err.message : "Unable to continue. Check your configuration and try again."); }
    finally { setBusy(false); }
  }
  return <section className="accountForm authCard">
    <div className="tabs"><button type="button" className={mode==="signup"?"active":""} onClick={()=>setMode("signup")}>Create account</button><button type="button" className={mode==="signin"?"active":""} onClick={()=>setMode("signin")}>Sign in</button></div>
    <form onSubmit={submit} className="authForm"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/><label htmlFor="password">Password</label><input id="password" type="password" minLength={8} autoComplete={mode==="signup"?"new-password":"current-password"} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/><button className="button primary" disabled={busy}>{busy?"Please wait…":mode==="signup"?"Create account":"Sign in"}</button></form>
    {message&&<p className="hint" role="status">{message}</p>}
    <p className="hint">Use a unique password. Email confirmation should remain enabled in Supabase.</p>
  </section>;
}
