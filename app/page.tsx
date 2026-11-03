const services = [
  { title: "Invoice & receipt", desc: "Professional invoices with automatic totals and a clean print-ready layout.", href: "/services/invoice", icon: "↗", tag: "BUSINESS" },
  { title: "Organisation ID cards", desc: "Employee, member and event badges for your organisation.", href: "/services/id-cards", icon: "▣", tag: "BADGES" },
  { title: "Certificate designer", desc: "Elegant certificates for courses, workshops and recognition.", href: "/services/certificates", icon: "✧", tag: "AWARDS" },
  { title: "QR & barcode studio", desc: "Generate QR codes and common barcode formats in your browser.", href: "/tools", icon: "⌗", tag: "QUICK TOOL" },
  { title: "International passport assistance", desc: "Prepare passport application details, photograph and signature for official submission.", href: "/services/passport-generator", icon: "◇", tag: "APPLICATION SUPPORT" },
  { title: "International driving licence assistance", desc: "Prepare driving permit application details and supporting photographs for an authorised issuer.", href: "/services/driving-licence-generator", icon: "▤", tag: "APPLICATION SUPPORT" },
  { title: "Utility statement sample", desc: "Build a fictional statement layout for design and testing only.", href: "/services/utility-sample", icon: "▧", tag: "DESIGN SAMPLE" }
];

export default function Home() {
  return <main className="home-shell">
    <header className="topbar">
      <a className="brand-lockup" href="/"><span className="brand-symbol">d.</span><span>docubridge</span></a>
      <nav className="topnav"><a href="#services">Services</a><a href="/tools">QR & barcode</a><a href="/dashboard">My workspace</a></nav>
      <a className="topbar-cta" href="/account">Sign in <span>↗</span></a>
    </header>
    <section className="hero-v2">
      <div className="hero-copy">
        <div className="hero-chip"><span/> YOUR DOCUMENT WORKSPACE</div>
        <h1>Make paperwork<br/><em>feel effortless.</em></h1>
        <p>Thoughtful tools for the documents your work and everyday projects depend on. Create, preview and export — all in one simple workspace.</p>
        <div className="hero-buttons"><a href="#services" className="hero-primary">Explore the studio <span>→</span></a><a href="/tools" className="hero-secondary">Try quick tools</a></div>
        <div className="hero-proof"><span>✓ Live previews</span><span>✓ Easy PDF printing</span><span>✓ Simple workflows</span></div>
      </div>
      <div className="hero-art" aria-label="Document preview illustration">
        <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
        <div className="art-card art-back"><div className="art-mini-line"/><div className="art-mini-line short"/><div className="art-mini-box"/></div>
        <div className="art-card art-front"><div className="art-card-top"><span>DOCUBRIDGE</span><b>↗</b></div><div className="art-doc-title">Your next<br/>great document.</div><div className="art-doc-line"/><div className="art-doc-line short"/><div className="art-doc-footer"><span>PREVIEW READY</span><b>✓</b></div></div>
        <div className="art-float"><span>✦</span> Made simple</div>
      </div>
    </section>
    <section className="services-v2" id="services">
      <div className="section-intro"><div><div className="section-kicker">THE DOCUBRIDGE STUDIO</div><h2>What would you like<br/>to create today?</h2></div><p>Pick a tool to open its guided editor. Your changes appear in a live preview, ready to export.</p></div>
      <div className="service-grid-v2">{services.map((s,i)=><a className={"service-tile tile-"+i} href={s.href} key={s.title}><div className="tile-top"><span className="tile-icon">{s.icon}</span><span className="tile-tag">{s.tag}</span></div><div className="tile-bottom"><h3>{s.title}</h3><p>{s.desc}</p><span className="tile-link">Open editor <b>↗</b></span></div></a>)}</div>
    </section>
    <section className="workflow-band"><div className="workflow-inner"><div><div className="section-kicker light">A BETTER WAY TO GET IT DONE</div><h2>From blank page<br/>to ready-to-share.</h2><p>No complicated software. Just a clear process that keeps you moving.</p></div><div className="workflow-steps"><div><b>01</b><span><strong>Choose a tool</strong><small>Start with the document you need.</small></span></div><div><b>02</b><span><strong>Make it yours</strong><small>Fill in the details and see changes instantly.</small></span></div><div><b>03</b><span><strong>Export and go</strong><small>Download an SVG or save a PDF from print.</small></span></div></div></div></section>
    <section className="bottom-cta"><div><div className="section-kicker">YOUR WORKSPACE</div><h2>Ready when you are.</h2><p>Sign in to access your DocuBridge account.</p></div><a href="/account" className="hero-primary">Open my account <span>→</span></a></section>
    <footer className="footer-v2"><a className="brand-lockup" href="/"><span className="brand-symbol">d.</span><span>docubridge</span></a><span>© {new Date().getFullYear()} DocuBridge</span><small>Application assistance helps prepare supporting information; official passports and driving permits are issued only by authorised authorities.</small></footer>
  </main>;
}
