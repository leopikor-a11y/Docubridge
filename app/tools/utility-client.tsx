"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

export default function UtilityClient() {
  const [mode,setMode]=useState<"qr"|"barcode">("qr");
  const [value,setValue]=useState("https://example.com");
  const [format,setFormat]=useState("CODE128");
  const [error,setError]=useState("");
  const canvas=useRef<HTMLCanvasElement>(null);
  const svg=useRef<SVGSVGElement>(null);

  useEffect(()=>{
    let active=true;
    setError("");
    if(mode==="qr" && canvas.current) {
      QRCode.toCanvas(canvas.current,value || " ",{width:260,margin:2,errorCorrectionLevel:"M"})
        .catch(()=>active && setError("Unable to create this QR code. Check the content and try again."));
    }
    if(mode==="barcode" && svg.current) {
      try { JsBarcode(svg.current,value || " ",{format,lineColor:"#15251f",width:2,height:90,displayValue:true,margin:12}); }
      catch { setError("This value is not valid for the selected barcode format."); }
    }
    return ()=>{active=false;};
  },[mode,value,format]);

  function download() {
    if(mode==="qr" && canvas.current) {
      const a=document.createElement("a");a.download="docubridge-qr.png";a.href=canvas.current.toDataURL("image/png");a.click();
    } else if(svg.current) {
      const blob=new Blob([new XMLSerializer().serializeToString(svg.current)],{type:"image/svg+xml"});
      const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="docubridge-barcode.svg";a.click();URL.revokeObjectURL(url);
    }
  }

  return <section className="utilityPanel">
    <div className="tabs"><button className={mode==="qr"?"active":""} onClick={()=>setMode("qr")}>QR code</button><button className={mode==="barcode"?"active":""} onClick={()=>setMode("barcode")}>Barcode</button></div>
    <div className="utilityGrid">
      <div className="utilityForm">
        <label>{mode==="qr"?"Website, text or contact details":"Barcode value"}</label>
        <textarea value={value} onChange={e=>setValue(e.target.value)} rows={4} placeholder="Enter content here"/>
        {mode==="barcode" && <><label>Format</label><select value={format} onChange={e=>setFormat(e.target.value)}><option>CODE128</option><option>CODE39</option><option>EAN13</option><option>UPC</option><option>ITF</option></select></>}
        <p className="hint">Use only information you have permission to encode. Barcode formats have different length and character requirements.</p>
        <button className="button primary" onClick={download}>Download {mode==="qr"?"PNG":"SVG"}</button>
        {error && <p className="error">{error}</p>}
      </div>
      <div className="previewBox"><div className="previewLabel">LIVE PREVIEW</div>{mode==="qr"?<canvas ref={canvas}/>:<svg ref={svg}/>}</div>
    </div>
  </section>;
}
