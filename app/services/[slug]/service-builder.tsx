"use client";

import { useMemo, useState } from "react";
import { createClient as createSupabaseClient } from "../../../lib/supabase/client";
import { ArrowLeft, Download, FileDown, Info, Printer, RotateCcw, ShieldCheck } from "lucide-react";

type Values = Record<string, string>;
type Field = { key: string; label: string; placeholder?: string; type?: string; wide?: boolean };

const TODAY = new Date().toISOString().slice(0, 10);

const configs: Record<string, { title: string; eyebrow: string; description: string; price: string; fields: Field[]; sample?: boolean; kind: string }> = {
  invoice: {
    title: "Invoice & receipt builder",
    eyebrow: "BUSINESS DOCUMENTS",
    description: "Create a clean, professional invoice for your business. Add your details, check the totals and export a copy.",
    price: "From $4.00",
    kind: "invoice",
    fields: [
      { key: "business", label: "Your business", placeholder: "Northstar Studio" },
      { key: "businessEmail", label: "Business email", placeholder: "billing@example.com", type: "email" },
      { key: "customer", label: "Bill to", placeholder: "Customer or company name" },
      { key: "invoiceNo", label: "Invoice number", placeholder: "INV-2026-001" },
      { key: "issueDate", label: "Issue date", type: "date" },
      { key: "dueDate", label: "Due date", type: "date" },
      { key: "description", label: "Item or service", placeholder: "Consulting services", wide: true },
      { key: "quantity", label: "Quantity", type: "number" },
      { key: "unitPrice", label: "Price per unit (USD)", type: "number" },
      { key: "taxRate", label: "Tax rate (%)", type: "number" },
      { key: "notes", label: "Payment notes", placeholder: "Thank you for your business.", wide: true }
    ]
  },
  "id-cards": {
    title: "ID card studio",
    eyebrow: "ORGANISATION BADGES",
    description: "Design an employee, membership or event badge for an organisation you represent. This is not a government identity document.",
    price: "From $5.00",
    kind: "id",
    fields: [
      { key: "fullName", label: "Card holder", placeholder: "Alex Morgan" },
      { key: "organization", label: "Organisation", placeholder: "Northstar Studio" },
      { key: "role", label: "Role or membership", placeholder: "Design team" },
      { key: "cardId", label: "Internal badge reference", placeholder: "TEAM-024" },
      { key: "email", label: "Contact email", placeholder: "alex@example.com", type: "email" },
      { key: "validity", label: "Valid through", type: "date" }
    ]
  },
  "passport-generator": {
    title: "Fictional passport-style prop",
    eyebrow: "CREATIVE SAMPLE",
    description: "Create a fictional prop for a film, game or design presentation. It deliberately avoids real passport layouts and official identifiers.",
    price: "From $6.00",
    kind: "passport",
    sample: true,
    fields: [
      { key: "fullName", label: "Fictional character", placeholder: "Jordan Vale" },
      { key: "realm", label: "Imaginary world", placeholder: "The Azure Isles" },
      { key: "role", label: "Character description", placeholder: "Cartographer" },
      { key: "propCode", label: "Prop reference", placeholder: "PROP-0007" }
    ]
  },
  "driving-licence-generator": {
    title: "Fictional driving-card prop",
    eyebrow: "CREATIVE SAMPLE",
    description: "Design a fictional driving-card prop for a story or creative project. It is not a licence and cannot be used for identification or driving.",
    price: "From $6.00",
    kind: "licence",
    sample: true,
    fields: [
      { key: "fullName", label: "Fictional character", placeholder: "Taylor Reed" },
      { key: "realm", label: "Imaginary setting", placeholder: "Westhaven" },
      { key: "role", label: "Demo category", placeholder: "CLASS DEMO" },
      { key: "propCode", label: "Prop reference", placeholder: "PROP-0012" }
    ]
  },
  "utility-sample": {
    title: "Utility bill sample layout",
    eyebrow: "FICTIONAL DESIGN SAMPLE",
    description: "Create a visibly fictional utility statement for layout testing and product demonstrations. It is not proof of address or payment.",
    price: "From $3.00",
    kind: "utility",
    sample: true,
    fields: [
      { key: "provider", label: "Fictional provider", placeholder: "Demo Utilities Co." },
      { key: "customer", label: "Fictional customer", placeholder: "Morgan Example" },
      { key: "serviceAddress", label: "Sample address", placeholder: "123 Example Street, Sampletown", wide: true },
      { key: "accountRef", label: "Demo account reference", placeholder: "DEMO-1001" },
      { key: "period", label: "Billing period", placeholder: "1–30 November 2026" },
      { key: "dueDate", label: "Sample due date", type: "date" },
      { key: "amount", label: "Sample amount (USD)", type: "number" }
    ]
  },
  certificates: {
    title: "Certificate designer",
    eyebrow: "AWARDS & RECOGNITION",
    description: "Create a polished certificate for a course, workshop, event or internal recognition programme.",
    price: "From $4.00",
    kind: "certificate",
    fields: [
      { key: "recipient", label: "Recipient name", placeholder: "Alex Morgan", wide: true },
      { key: "achievement", label: "Certificate title", placeholder: "Certificate of Completion", wide: true },
      { key: "course", label: "Course or achievement", placeholder: "Digital Skills Workshop", wide: true },
      { key: "issuer", label: "Presented by", placeholder: "Northstar Learning" },
      { key: "issueDate", label: "Issue date", type: "date" },
      { key: "certificateId", label: "Reference (optional)", placeholder: "CERT-2026-001" }
    ]
  }
};

const defaults: Record<string, string> = {
  business: "Northstar Studio",
  businessEmail: "billing@example.com",
  customer: "Morgan Example",
  invoiceNo: "INV-2026-001",
  issueDate: TODAY,
  dueDate: TODAY,
  description: "Professional services",
  quantity: "1",
  unitPrice: "250",
  taxRate: "0",
  notes: "Thank you for your business.",
  fullName: "Alex Morgan",
  organization: "Northstar Studio",
  role: "Member",
  cardId: "TEAM-024",
  email: "alex@example.com",
  validity: TODAY,
  realm: "The Azure Isles",
  propCode: "PROP-0007",
  provider: "Demo Utilities Co.",
  serviceAddress: "123 Example Street, Sampletown",
  accountRef: "DEMO-1001",
  period: "1–30 November 2026",
  amount: "84.50",
  recipient: "Alex Morgan",
  achievement: "Certificate of Completion",
  course: "Digital Skills Workshop",
  issuer: "Northstar Learning",
  certificateId: "CERT-2026-001"
};

function xml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[char] || char));
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number.isFinite(value) ? value : 0);
}

function buildSvg(kind: string, v: Values, totals: { subtotal: number; tax: number; total: number }) {
  const text = (x: number, y: number, value: string, size = 24, color = "#172b39", weight = 400) =>
    '<text x="' + x + '" y="' + y + '" font-family="Arial, sans-serif" font-size="' + size + '" font-weight="' + weight + '" fill="' + color + '">' + xml(value || " ") + "</text>";
  const base = (w: number, h: number, inner: string, bg = "#ffffff") =>
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '"><rect width="100%" height="100%" rx="18" fill="' + bg + '"/>' + inner + "</svg>";

  if (kind === "invoice") {
    const rows = [
      text(70, 245, v.description, 22),
      text(70, 300, "Quantity: " + v.quantity, 17, "#64748b"),
      text(580, 245, money(Number(v.unitPrice) * Number(v.quantity)), 22, "#172b39", 700),
      text(70, 430, "Subtotal", 18, "#64748b"),
      text(580, 430, money(totals.subtotal), 18, "#172b39", 700),
      text(70, 475, "Tax (" + v.taxRate + "%)", 18, "#64748b"),
      text(580, 475, money(totals.tax), 18, "#172b39", 700),
      text(70, 555, "TOTAL DUE", 18, "#0e766e", 700),
      text(580, 555, money(totals.total), 30, "#0e766e", 700),
      text(70, 660, v.notes, 16, "#64748b")
    ].join("");
    return base(820, 720, '<rect x="0" y="0" width="820" height="14" fill="#0e766e"/>' + text(70, 90, v.business, 30, "#123042", 700) + text(70, 130, v.businessEmail, 16, "#64748b") + text(600, 95, "INVOICE", 31, "#0e766e", 700) + text(600, 135, v.invoiceNo, 16) + text(70, 205, "BILL TO  " + v.customer, 18, "#172b39", 700) + '<path d="M70 335H750" stroke="#dbe5e8"/>' + rows + '<path d="M70 390H750" stroke="#dbe5e8"/><path d="M70 510H750" stroke="#dbe5e8"/>');
  }
  if (kind === "certificate") {
    return base(900, 650, '<rect x="24" y="24" width="852" height="602" rx="10" fill="none" stroke="#b99256" stroke-width="4"/><rect x="42" y="42" width="816" height="566" rx="8" fill="none" stroke="#dfc99f" stroke-width="1.5"/>' + text(450, 130, "RECOGNITION", 18, "#9a7848", 700).replace('x="450"', 'x="450" text-anchor="middle"') + text(450, 215, v.achievement || "Certificate of Completion", 38, "#273b4b", 700).replace('x="450"', 'x="450" text-anchor="middle"') + text(450, 280, "This certificate is presented to", 19, "#64748b").replace('x="450"', 'x="450" text-anchor="middle"') + text(450, 355, v.recipient, 42, "#0e766e", 700).replace('x="450"', 'x="450" text-anchor="middle"') + text(450, 410, "For " + v.course, 20, "#475569").replace('x="450"', 'x="450" text-anchor="middle"') + text(250, 520, "Presented by " + v.issuer, 17, "#475569").replace('x="250"', 'x="250" text-anchor="middle"') + text(650, 520, "Date " + v.issueDate, 17, "#475569").replace('x="650"', 'x="650" text-anchor="middle"') + text(450, 575, v.certificateId, 14, "#9aa5ad").replace('x="450"', 'x="450" text-anchor="middle"'), "#fffdf8");
  }
  if (kind === "id") {
    return base(900, 560, '<rect x="0" y="0" width="900" height="112" fill="#142d3b"/><circle cx="125" cy="272" r="72" fill="#e3edf0"/><text x="125" y="292" text-anchor="middle" font-family="Arial" font-size="58" font-weight="700" fill="#0e766e">' + xml((v.fullName || "A").slice(0, 1).toUpperCase()) + "</text>" + text(54, 70, v.organization.toUpperCase(), 27, "#ffffff", 700) + text(250, 230, v.fullName, 34, "#142d3b", 700) + text(250, 285, v.role, 23, "#0e766e", 700) + text(250, 360, "BADGE REF  " + v.cardId, 19) + text(250, 410, v.email, 18, "#64748b") + text(250, 460, "VALID THROUGH  " + v.validity, 16, "#64748b") + '<rect x="730" y="476" width="120" height="38" rx="8" fill="#e8f1f1"/>' + text(790, 502, "MEMBER", 15, "#0e766e", 700).replace('x="790"', 'x="790" text-anchor="middle"'), "#f8fbfc");
  }
  const propTitle = kind === "passport" ? "FICTIONAL PROP DOCUMENT" : kind === "licence" ? "FICTIONAL PROP CARD" : "FICTIONAL BILL SAMPLE";
  if (kind === "passport" || kind === "licence") {
    return base(900, 560, '<rect x="0" y="0" width="900" height="118" fill="#193d4b"/>' + text(55, 74, propTitle, 24, "#ffffff", 700) + '<circle cx="145" cy="286" r="66" fill="#e4edf0"/><text x="145" y="302" text-anchor="middle" font-family="Arial" font-size="50" font-weight="700" fill="#0e766e">' + xml((v.fullName || "S").slice(0, 1).toUpperCase()) + "</text>" + text(250, 230, v.fullName, 32, "#153344", 700) + text(250, 295, (kind === "passport" ? "IMAGINARY WORLD  " : "FICTIONAL SETTING  ") + v.realm, 19, "#526878") + text(250, 350, v.role, 21, "#0e766e", 700) + text(250, 415, "PROP REFERENCE  " + v.propCode, 18) + '<g transform="rotate(-17 450 310)">' + text(450, 332, "SAMPLE • NOT VALID", 54, "#d34b45", 700).replace('x="450"', 'x="450" text-anchor="middle"') + "</g>", "#eef4f4");
  }
  return base(820, 720, '<rect x="0" y="0" width="820" height="120" fill="#193d4b"/>' + text(60, 75, v.provider, 30, "#ffffff", 700) + text(60, 190, "SAMPLE STATEMENT", 28, "#193d4b", 700) + text(60, 245, "ACCOUNT HOLDER  " + v.customer, 18) + text(60, 292, "SERVICE LOCATION  " + v.serviceAddress, 17, "#64748b") + text(60, 345, "ACCOUNT REF  " + v.accountRef, 17) + text(60, 390, "BILLING PERIOD  " + v.period, 17) + '<path d="M60 430H760" stroke="#dbe5e8"/>' + text(60, 500, "SAMPLE AMOUNT", 18, "#64748b") + text(60, 550, money(Number(v.amount)), 34, "#0e766e", 700) + '<g transform="rotate(-15 420 360)">' + text(420, 370, "SAMPLE • NOT VALID", 58, "#d34b45", 700).replace('x="420"', 'x="420" text-anchor="middle"') + "</g>", "#ffffff");
}

export default function ServiceBuilder({ slug }: { slug: string }) {
  const config = configs[slug];
  const [values, setValues] = useState<Values>(() => ({ ...defaults }));
  const [saved, setSaved] = useState(false);
  const [exportError, setExportError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const totals = useMemo(() => {
    const subtotal = Math.max(0, Number(values.unitPrice) || 0) * Math.max(0, Number(values.quantity) || 0);
    const tax = subtotal * Math.max(0, Number(values.taxRate) || 0) / 100;
    return { subtotal, tax, total: subtotal + tax };
  }, [values.unitPrice, values.quantity, values.taxRate]);

  if (!config) return <div className="builder-empty">This service is not available yet.</div>;

  function update(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function reset() {
    setValues({ ...defaults });
    setSaved(false);
    setExportError("");
  }

  function downloadSvg() {
    try {
      const content = buildSvg(config.kind, values, totals);
      const blob = new Blob([content], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "docubridge-" + slug + "-sample.svg";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setSaved(true);
      setExportError("");
    } catch {
      setExportError("The file could not be exported. Please try again.");
    }
  }

  function printPdf() {
    setSaved(true);
    window.print();
  }

  async function saveToWorkspace() {
    setSaving(true);
    setSaveMessage("");
    setExportError("");
    try {
      const supabase = createSupabaseClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        window.location.href = "/account?next=" + encodeURIComponent(window.location.pathname);
        return;
      }
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ user_id: user.id, service_slug: slug, status: "draft", currency: "USD", amount_usd: 0 })
        .select("id")
        .single();
      if (orderError || !order) throw orderError || new Error("Could not create a draft order.");

      const svg = buildSvg(config.kind, values, totals);
      const path = user.id + "/" + order.id + "/preview.svg";
      const { error: uploadError } = await supabase.storage
        .from("customer-documents")
        .upload(path, new Blob([svg], { type: "image/svg+xml" }), {
          contentType: "image/svg+xml",
          upsert: false
        });
      if (uploadError) {
        await supabase.from("orders").delete().eq("id", order.id).eq("user_id", user.id);
        throw uploadError;
      }

      const { error: fileError } = await supabase.from("order_files").insert({
        order_id: order.id,
        user_id: user.id,
        storage_path: path,
        file_kind: "output"
      });
      if (fileError) {
        await supabase.storage.from("customer-documents").remove([path]);
        await supabase.from("orders").delete().eq("id", order.id).eq("user_id", user.id);
        throw fileError;
      }
      setSaved(true);
      setSaveMessage("Draft saved privately to your workspace. No payment has been made.");
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Unable to save this draft. Please sign in and try again.");
    } finally {
      setSaving(false);
    }
  }

  const isInvoice = config.kind === "invoice";
  const isSample = Boolean(config.sample);

  return (
    <main className="builder-page">
      <div className="builder-topline">
        <a className="builder-back" href="/"><ArrowLeft size={16} /> All services</a>
        <span className="builder-secure"><ShieldCheck size={15} /> Private browser editor</span>
      </div>
      <section className="builder-heading">
        <div>
          <div className="builder-eyebrow">{config.eyebrow}</div>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <div className="builder-price"><span>STARTING PRICE</span><strong>{config.price}</strong><small>Preview mode · no payment required</small></div>
      </section>

      {isSample && <div className="sample-notice"><Info size={18} /><div><strong>Fictional sample only</strong><span>This output is prominently marked SAMPLE — NOT VALID. Do not enter real personal information or use it as identification, proof of address, or an official record.</span></div></div>}

      <div className="builder-layout">
        <section className="editor-panel">
          <div className="panel-heading"><div><span>01</span><div><h2>Enter your details</h2><p>Your preview updates as you type.</p></div></div><button type="button" className="reset-button" onClick={reset}><RotateCcw size={15}/> Reset</button></div>
          <div className="field-grid">
            {config.fields.map((field) => (
              <label className={field.wide ? "field field-wide" : "field"} key={field.key}>
                <span>{field.label}</span>
                <input
                  type={field.type || "text"}
                  min={field.type === "number" ? "0" : undefined}
                  step={field.key === "taxRate" ? "0.01" : field.type === "number" ? "0.01" : undefined}
                  value={values[field.key] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(event) => update(field.key, event.target.value)}
                />
              </label>
            ))}
          </div>
          {isInvoice && <div className="totals-card"><div><span>Subtotal</span><strong>{money(totals.subtotal)}</strong></div><div><span>Tax</span><strong>{money(totals.tax)}</strong></div><div className="grand-total"><span>Total due</span><strong>{money(totals.total)}</strong></div></div>}
          <div className="privacy-note"><ShieldCheck size={16}/><span>Your entries stay in this browser preview. They are not uploaded or saved to an account.</span></div>
        </section>

        <section className="preview-panel">
          <div className="panel-heading preview-heading"><div><span>02</span><div><h2>Live preview</h2><p>Review your document before exporting.</p></div></div><span className="live-pill"><i/> LIVE</span></div>
          <div className="preview-stage">
            <div className={"document-preview doc-" + config.kind} id="document-preview">
              {config.kind === "invoice" && <>
                <div className="doc-top-accent"/><div className="invoice-doc-head"><div><strong>{values.business}</strong><span>{values.businessEmail}</span></div><div className="invoice-title"><b>INVOICE</b><span>{values.invoiceNo}</span></div></div>
                <div className="invoice-meta"><div><small>BILL TO</small><strong>{values.customer}</strong></div><div><small>ISSUED</small><strong>{values.issueDate}</strong></div><div><small>DUE DATE</small><strong>{values.dueDate}</strong></div></div>
                <div className="invoice-table"><div className="invoice-table-head"><span>DESCRIPTION</span><span>QTY</span><span>AMOUNT</span></div><div className="invoice-table-row"><span>{values.description}</span><span>{values.quantity}</span><b>{money(Number(values.unitPrice) * Number(values.quantity))}</b></div></div>
                <div className="invoice-sum"><div><span>Subtotal</span><b>{money(totals.subtotal)}</b></div><div><span>Tax ({values.taxRate}%)</span><b>{money(totals.tax)}</b></div><div className="sum-total"><span>Total due</span><strong>{money(totals.total)}</strong></div></div>
                <div className="invoice-foot"><b>Thank you for your business.</b><span>{values.notes}</span></div>
              </>}
              {config.kind === "certificate" && <div className="certificate-doc"><div className="cert-kicker">AWARD OF RECOGNITION</div><div className="cert-rule"/><h3>{values.achievement}</h3><p>This certificate is proudly presented to</p><div className="cert-recipient">{values.recipient}</div><p>For {values.course}</p><div className="cert-footer"><div><b>{values.issuer}</b><span>Presented by</span></div><div><b>{values.issueDate}</b><span>Date issued</span></div></div><small>{values.certificateId}</small></div>}
              {config.kind === "id" && <div className="id-card-doc"><div className="id-card-band"><span>{values.organization}</span><small>ORGANISATION ACCESS CARD</small></div><div className="id-card-body"><div className="avatar-placeholder">{(values.fullName || "A").slice(0,1).toUpperCase()}</div><div className="id-details"><strong>{values.fullName}</strong><b>{values.role}</b><span>BADGE REF · {values.cardId}</span><span>{values.email}</span><span>VALID THROUGH · {values.validity}</span></div></div><div className="id-card-foot">ORGANISATION ISSUED · NOT A GOVERNMENT ID</div></div>}
              {config.kind === "passport" && <div className="prop-doc"><div className="prop-doc-top"><span>✦</span><b>STORYWORLD ARCHIVE</b></div><div className="prop-doc-copy"><div className="prop-avatar">{(values.fullName || "A").slice(0,1).toUpperCase()}</div><div><small>FICTIONAL CHARACTER</small><h3>{values.fullName}</h3><p>Imaginary world · {values.realm}</p><p>{values.role}</p><span>PROP REF · {values.propCode}</span></div></div><div className="prop-watermark">SAMPLE · NOT VALID</div><div className="prop-doc-bottom">CREATIVE PROP · NO OFFICIAL STATUS</div></div>}
              {config.kind === "licence" && <div className="prop-doc licence-prop"><div className="prop-doc-top"><span>✦</span><b>FICTIONAL MOBILITY CLUB</b></div><div className="prop-doc-copy"><div className="prop-avatar">{(values.fullName || "A").slice(0,1).toUpperCase()}</div><div><small>DEMO PROP CARD</small><h3>{values.fullName}</h3><p>Imaginary setting · {values.realm}</p><p>Demo category · {values.role}</p><span>PROP REF · {values.propCode}</span></div></div><div className="prop-watermark">SAMPLE · NOT VALID</div><div className="prop-doc-bottom">NOT A LICENCE · NO DRIVING PRIVILEGES</div></div>}
              {config.kind === "utility" && <div className="utility-doc"><div className="utility-doc-head"><div><span>DEMO STATEMENT</span><h3>{values.provider}</h3></div><b>UTILITY<br/>SAMPLE</b></div><div className="utility-watermark">SAMPLE · NOT VALID</div><div className="utility-doc-customer"><small>FICTIONAL CUSTOMER</small><strong>{values.customer}</strong><span>{values.serviceAddress}</span></div><div className="utility-doc-grid"><div><small>DEMO ACCOUNT</small><b>{values.accountRef}</b></div><div><small>BILLING PERIOD</small><b>{values.period}</b></div><div><small>SAMPLE DUE DATE</small><b>{values.dueDate}</b></div></div><div className="utility-amount"><span>SAMPLE AMOUNT</span><strong>{money(Number(values.amount))}</strong></div><div className="utility-disclaimer">FICTIONAL LAYOUT FOR DESIGN TESTING ONLY · NOT PROOF OF ADDRESS OR PAYMENT</div></div>}
            </div>
          </div>
          <div className="export-actions"><button type="button" className="export-primary" onClick={downloadSvg}><Download size={17}/> Download SVG</button><button type="button" className="export-secondary" onClick={printPdf}><Printer size={17}/> Print / Save PDF</button><button type="button" className="export-secondary" onClick={saveToWorkspace} disabled={saving}>{saving ? "Saving…" : "Save to workspace"}</button></div>
          {saved && <p className="export-success"><ShieldCheck size={15}/> Your export is ready.</p>}
          {saveMessage && <p className="export-success"><ShieldCheck size={15}/> {saveMessage}</p>}
          {exportError && <p className="export-error">{exportError}</p>}
          <p className="export-help"><FileDown size={14}/> To create a PDF, choose “Save as PDF” in your browser's print dialog.</p>
        </section>
      </div>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden !important; }
          #document-preview, #document-preview * { visibility: visible !important; }
          #document-preview { position: absolute !important; inset: 12mm auto auto 12mm !important; width: 180mm !important; max-width: 180mm !important; min-height: auto !important; box-shadow: none !important; }
          @page { size: A4; margin: 10mm; }
        }
      `}</style>
    </main>
  );
}
