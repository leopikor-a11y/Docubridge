"use client";

import { useMemo, useState } from "react";
import { createClient as createSupabaseClient } from "../../../lib/supabase/client";
import { ArrowLeft, Download, FileDown, Info, Printer, RotateCcw, ShieldCheck } from "lucide-react";

type Values = Record<string, string>;
type Field = { key: string; label: string; placeholder?: string; type?: string; wide?: boolean };

const TODAY = new Date().toISOString().slice(0, 10);\n
const COUNTRY_CODES = ["AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA","ZM","ZW"];
const COUNTRY_NAMES = COUNTRY_CODES
  .map((code) => ({ code, name: new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code }))
  .sort((a, b) => a.name.localeCompare(b.name));


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
    title: "International passport application",
    eyebrow: "PASSPORT APPLICATION PREPARATION",
    description: "Select the passport authority country, complete the applicant details, add your existing passport dates where applicable, and prepare your application support pack. Passport issuance is handled only by the official authority.",
    price: "Application preparation",
    kind: "passport",
    fields: [
      { key: "fullName", label: "Full legal name", placeholder: "As shown on supporting identity records", wide: true },
      { key: "country", label: "Passport issuing country", placeholder: "Select a country", wide: true, type: "country" },
      { key: "applicationType", label: "Application type", placeholder: "New passport / renewal / replacement" },
      { key: "dateOfBirth", label: "Date of birth", type: "date" },
      { key: "nationality", label: "Nationality", placeholder: "Select nationality", type: "country" },\n      { key: "passportIssueDate", label: "Existing passport issue date (if applicable)", type: "date" },\n      { key: "passportExpiryDate", label: "Existing passport expiry date (if applicable)", type: "date" },
      { key: "email", label: "Contact email", placeholder: "you@example.com", type: "email" },
      { key: "phone", label: "Contact telephone", placeholder: "Include country code" }
    ]
  },
  "driving-licence-generator": {
    title: "International driving licence application assistant",
    eyebrow: "DRIVING PERMIT APPLICATION PREPARATION",
    description: "Prepare your details, photograph and signature for an international driving permit or national licence process. Issuance and eligibility are determined by the authorised authority.",
    price: "Application preparation",
    kind: "licence",
    fields: [
      { key: "fullName", label: "Full legal name", placeholder: "As shown on your driving licence", wide: true },
      { key: "country", label: "Country of current driving licence", placeholder: "Select a country", wide: true, type: "country" },
      { key: "destinationCountry", label: "Country where you plan to drive", placeholder: "Select a country", wide: true, type: "country" },
      { key: "applicationType", label: "Service required", placeholder: "International driving permit / renewal / replacement" },
      { key: "licenceNumber", label: "Existing licence reference (optional)", placeholder: "Enter only if required by the authority" },
      { key: "dateOfBirth", label: "Date of birth", type: "date" },
      { key: "email", label: "Contact email", placeholder: "you@example.com", type: "email" },
      { key: "phone", label: "Contact telephone", placeholder: "Include country code" }
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
  country: "",
  destinationCountry: "",
  applicationType: "",
  nationality: "",
  dateOfBirth: "",
  phone: "",
  licenceNumber: "",
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
  if (kind === "passport" || kind === "licence") {
    const title = kind === "passport" ? "PASSPORT APPLICATION SUMMARY" : "DRIVING PERMIT APPLICATION SUMMARY";
    const rows = [
      ["Applicant", v.fullName], ["Issuing country", v.country], ["Destination country", v.destinationCountry],
      ["Application type", v.applicationType], ["Date of birth", v.dateOfBirth], ["Nationality", v.nationality],
      ["Nationality", v.nationality], ["Existing passport issue date", v.passportIssueDate], ["Existing passport expiry date", v.passportExpiryDate], ["Contact email", v.email], ["Telephone", v.phone], ["Existing licence reference", v.licenceNumber]
    ].filter((row) => row[1]).map((row, i) => text(65, 245 + i * 42, row[0] + ": " + row[1], 18, "#263746")).join("");
    return base(820, 760, '<rect x="0" y="0" width="820" height="16" fill="#1c302a"/>' +
      text(65, 92, "DOCUBRIDGE", 18, "#24856a", 700) + text(65, 155, title, 27, "#172b39", 700) +
      text(65, 190, "Applicant-prepared information for official submission", 15, "#64748b") +
      '<path d="M65 210H755" stroke="#dbe5e8"/>' + rows +
      '<rect x="55" y="635" width="710" height="75" rx="10" fill="#edf4ef"/>' +
      text(75, 665, "PREPARATION DOCUMENT — NOT AN OFFICIAL IDENTITY OR TRAVEL DOCUMENT", 13, "#23634d", 700) +
      text(75, 690, "Submit through the relevant government or authorised issuing authority.", 13, "#526878"));
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
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

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
    setPassportPhoto(null);
    setSignatureFile(null);
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
      link.download = "docubridge-" + slug + (isApplication ? "-application-summary.svg" : "-sample.svg");
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
      const fileRows: { order_id: string; user_id: string; storage_path: string; file_kind: "input" | "output" }[] = [];
      const previewPath = user.id + "/" + order.id + "/application-summary.svg";
      const { error: previewError } = await supabase.storage.from("customer-documents").upload(previewPath, new Blob([svg], { type: "image/svg+xml" }), { contentType: "image/svg+xml", upsert: false });
      if (previewError) throw previewError;
      fileRows.push({ order_id: order.id, user_id: user.id, storage_path: previewPath, file_kind: "output" });
      for (const [file, label] of [[passportPhoto, "passport-photo"], [signatureFile, "signature"]] as const) {
        if (!file) continue;
        if (!["image/jpeg", "image/png"].includes(file.type)) throw new Error("Upload the photograph and signature as JPG or PNG files.");
        if (file.size > 5 * 1024 * 1024) throw new Error("Each image must be 5 MB or smaller.");
        const extension = file.type === "image/png" ? "png" : "jpg";
        const filePath = user.id + "/" + order.id + "/" + label + "." + extension;
        const { error } = await supabase.storage.from("customer-documents").upload(filePath, file, { contentType: file.type, upsert: false });
        if (error) throw error;
        fileRows.push({ order_id: order.id, user_id: user.id, storage_path: filePath, file_kind: "input" });
      }
      const { error: fileError } = await supabase.from("order_files").insert(fileRows);
      if (fileError) throw fileError;
      setSaved(true);
      setSaveMessage(isApplication ? "Application preparation draft and attachments saved privately. No payment has been made." : "Draft saved privately to your workspace. No payment has been made.");
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Unable to save this draft. Please sign in and try again.");
    } finally {
      setSaving(false);
    }
  }

  const isInvoice = config.kind === "invoice";
  const isSample = Boolean(config.sample);
  const isApplication = config.kind === "passport" || config.kind === "licence";

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
      {isApplication && <div className="sample-notice"><Info size={18} /><div><strong>Application preparation only — not government-issued</strong><span>DocuBridge does not issue passports or driving licences. Confirm eligibility, required photo specifications, fees and submission steps with the official authority.</span></div></div>}

      <div className="builder-layout">
        <section className="editor-panel">
          <div className="panel-heading"><div><span>01</span><div><h2>Enter your details</h2><p>Your preview updates as you type.</p></div></div><button type="button" className="reset-button" onClick={reset}><RotateCcw size={15}/> Reset</button></div>
          <div className="field-grid">
            {config.fields.map((field) => (
              <label className={field.wide ? "field field-wide" : "field"} key={field.key}>
                <span>{field.label}</span>
                {field.type === "country" ? (
                  <select
                    value={values[field.key] ?? ""}
                    onChange={(event) => update(field.key, event.target.value)}
                    required={field.key === "country"}
                  >
                    <option value="">{field.placeholder || "Select a country"}</option>
                    {COUNTRY_NAMES.map((country) => <option key={country.code} value={country.name}>{country.name}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    min={field.type === "number" ? "0" : undefined}
                    step={field.key === "taxRate" ? "0.01" : field.type === "number" ? "0.01" : undefined}
                    value={values[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) => update(field.key, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
          {isApplication && <div className="application-uploads">
            <div><h3>Passport photograph and signature</h3><p>Attach your own files for your application preparation pack. JPG or PNG, maximum 5 MB each.</p></div>
            <label className="upload-field"><span>Passport photograph</span><input type="file" accept="image/jpeg,image/png" onChange={(event) => setPassportPhoto(event.target.files?.[0] || null)} />{passportPhoto && <small>Selected: {passportPhoto.name}</small>}</label>
            <label className="upload-field"><span>Signature image</span><input type="file" accept="image/jpeg,image/png" onChange={(event) => setSignatureFile(event.target.files?.[0] || null)} />{signatureFile && <small>Selected: {signatureFile.name}</small>}</label>
            <p className="upload-privacy"><ShieldCheck size={14}/> Files upload only when you save, and remain in your private account storage.</p>
          </div>}
          {isInvoice && <div className="totals-card"><div><span>Subtotal</span><strong>{money(totals.subtotal)}</strong></div><div><span>Tax</span><strong>{money(totals.tax)}</strong></div><div className="grand-total"><span>Total due</span><strong>{money(totals.total)}</strong></div></div>}
          <div className="privacy-note"><ShieldCheck size={16}/><span>{isApplication ? "Your personal details stay in this browser until you save the application pack to your private workspace." : "Your entries stay in this browser preview. They are not uploaded or saved to an account."}</span></div>
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
              {config.kind === "passport" && <div className="application-summary-preview"><strong>PASSPORT APPLICATION SUMMARY</strong><span>{values.fullName || "Applicant name"}</span><small>{values.country || "Issuing country"} · {values.applicationType || "Application type"}</small><small>Existing passport issue date: {values.passportIssueDate || "Not provided"}</small><small>Existing passport expiry date: {values.passportExpiryDate || "Not provided"}</small><small>Photograph: {passportPhoto ? "Selected" : "Not attached"} · Signature: {signatureFile ? "Selected" : "Not attached"}</small><em>APPLICATION PREPARATION ONLY — NOT A PASSPORT</em></div>}
              {config.kind === "licence" && <div className="application-summary-preview"><strong>INTERNATIONAL DRIVING PERMIT APPLICATION</strong><span>{values.fullName || "Applicant name"}</span><small>{values.country || "Current licence country"} → {values.destinationCountry || "Destination country"}</small><small>Photograph: {passportPhoto ? "Selected" : "Not attached"} · Signature: {signatureFile ? "Selected" : "Not attached"}</small><em>APPLICATION PREPARATION ONLY — NOT A DRIVING LICENCE</em></div>}
              {config.kind === "utility" && <div className="utility-doc"><div className="utility-doc-head"><div><span>DEMO STATEMENT</span><h3>{values.provider}</h3></div><b>UTILITY<br/>SAMPLE</b></div><div className="utility-watermark">SAMPLE · NOT VALID</div><div className="utility-doc-customer"><small>FICTIONAL CUSTOMER</small><strong>{values.customer}</strong><span>{values.serviceAddress}</span></div><div className="utility-doc-grid"><div><small>DEMO ACCOUNT</small><b>{values.accountRef}</b></div><div><small>BILLING PERIOD</small><b>{values.period}</b></div><div><small>SAMPLE DUE DATE</small><b>{values.dueDate}</b></div></div><div className="utility-amount"><span>SAMPLE AMOUNT</span><strong>{money(Number(values.amount))}</strong></div><div className="utility-disclaimer">FICTIONAL LAYOUT FOR DESIGN TESTING ONLY · NOT PROOF OF ADDRESS OR PAYMENT</div></div>}
            </div>
          </div>
          <div className="export-actions"><button type="button" className="export-primary" onClick={downloadSvg}><Download size={17}/> {isApplication ? "Generate application pack" : "Download SVG"}</button><button type="button" className="export-secondary" onClick={printPdf}><Printer size={17}/> Print / Save PDF</button><button type="button" className="export-secondary" onClick={saveToWorkspace} disabled={saving}>{saving ? "Saving…" : "Save to workspace"}</button></div>
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
