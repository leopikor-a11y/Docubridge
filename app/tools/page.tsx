import UtilityClient from "./utility-client";

export const metadata = { title: "Digital tools | DocuBridge" };

export default function ToolsPage() {
  return <main className="wrap toolPage">
    <a className="backLink" href="/">← Back to DocuBridge</a>
    <div className="eyebrow">DIGITAL WORKSPACE</div>
    <h1 className="pageTitle">Create something useful.</h1>
    <p className="lead">Generate QR codes and common barcodes in your browser. Your input is processed locally in this demo.</p>
    <UtilityClient />
  </main>;
}
