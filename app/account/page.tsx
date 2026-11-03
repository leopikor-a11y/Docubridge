"use client";
import {useState} from "react";
export default function AccountPage(){
 const [email,setEmail]=useState(""); const [notice,setNotice]=useState("");
 return <main className="wrap toolPage"><a className="backLink" href="/">← DocuBridge</a><div className="eyebrow">CUSTOMER WORKSPACE</div><h1 className="pageTitle">Your documents, together.</h1><p className="lead">Sign-in is a preview only at this stage. Account creation will be enabled after secure authentication is connected.</p><div className="accountForm"><label>Email address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/><button className="button primary" onClick={()=>setNotice(email.includes("@")?"Account access will be available when authentication is configured.":"Please enter a valid email address.")}>Continue</button>{notice&&<p className="hint">{notice}</p>}</div><div className="dashboardLinks"><a href="/admin">Administration preview →</a><a href="/tools">Open digital tools →</a></div></main>;
}
