const services = [
  ["Invoice & receipt builder","Create clean business documents."],
  ["ID card templates","Employee, membership and event cards."],
  ["Passport application help","Guidance, checklists and photo preparation."],
  ["Driving licence application help","Application guidance and document checklists."],
  ["Utility bill sample layouts","Clearly marked fictional examples for design/testing."],
  ["QR code creator","Create QR codes for links and contact details."],
  ["Barcode creator","Generate common retail and inventory barcodes."],
  ["Certificates","Build certificates for courses and events."]
];
const tools = ["PDF tools","Image resize & conversion","PDF merge","Passport photo preparation","Signature creator","QR & barcode tools"];

export default function Home() {
  return <main>
    <nav className="nav wrap">
      <a className="brand" href="#"><span className="brandMark">D</span> DocuBridge</a>
      <div className="navLinks"><a href="#services">Services</a><a href="#tools">Digital tools</a><a href="#pricing">Pricing</a><a className="navButton" href="/account">Sign in</a></div>
    </nav>
    <section className="hero wrap">
      <div className="eyebrow">DOCUMENTS • DIGITAL TOOLS • SIMPLE WORKFLOWS</div>
      <h1>Important documents.<br/><em>Made simpler.</em></h1>
      <p className="heroText">Prepare everyday business documents, organise application paperwork and use practical digital tools — all in one place.</p>
      <div className="heroActions"><a className="button primary" href="#services">Explore services</a><a className="button secondary" href="#tools">Browse digital tools</a></div>
      <div className="trustLine"><span>✓ Pay per document</span><span>✓ Clear USD pricing</span><span>✓ Download-ready workflows</span></div>
    </section>
    <section className="section wrap" id="services">
      <div className="sectionHead"><div><div className="eyebrow">WHAT YOU CAN DO</div><h2>Document services</h2></div><p>Choose a service and follow a guided workflow.</p></div>
      <div className="serviceGrid">{services.map(([name,desc],i)=><article className="serviceCard" key={name}><div className="serviceIcon">{["▤","▣","◎","▧","▥","⌗","▦","✧"][i]}</div><h3>{name}</h3><p>{desc}</p><a href={["/services/invoice","/services/id-cards","/services/passport-help","/services/licence-help","/services/utility-sample","/tools","/tools","/services/certificates"][i]}>Explore service <span>↗</span></a></article>)}</div>
    </section>
    <section className="toolsBand" id="tools"><div className="wrap toolsInner"><div><div className="eyebrow">QUICK UTILITIES</div><h2>Useful tools, ready when you are.</h2><p>Simple utilities for common document and image tasks.</p></div><div className="toolList">{tools.map(t=><a className="toolLink" href="/tools" key={t}><span>✦</span>{t}<b>→</b></a>)}</div></div></section>
    <section className="section wrap" id="pricing"><div className="eyebrow">SIMPLE CHECKOUT</div><h2>Pay only for what you use.</h2><p className="muted">Prices are displayed in USD. The final amount is shown before checkout.</p><div className="pricingCard"><div><h3>One document at a time</h3><p>No subscription required. Select a service, review the price and pay when your document is ready.</p></div><div className="priceTag">USD <strong>Pay per use</strong></div></div></section>
    <section className="accountBand" id="account"><div className="wrap accountInner"><div><div className="eyebrow">YOUR WORKSPACE</div><h2>Keep every order in one place.</h2><p>Customer accounts, order history and an administration workspace are planned for the production release.</p></div><a className="button primary" href="/account">Open your workspace</a></div></section>
    <footer className="wrap footer"><a className="brand" href="#"><span className="brandMark">D</span> DocuBridge</a><p>© {new Date().getFullYear()} DocuBridge. All rights reserved.</p><small>Government application assistance only. No counterfeit identity documents or false proof-of-address documents.</small></footer>
  </main>;
}
