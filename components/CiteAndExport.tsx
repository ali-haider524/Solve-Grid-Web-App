"use client";

import { useEffect, useState } from "react";
import styles from "./CiteAndExport.module.css";

type CiteAndExportProps = { name: string; url: string; year: string };

function resultElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>('#main-content [aria-live="polite"]');
}

function hasResult(el: HTMLElement | null) {
  return Boolean(el && el.querySelector("[class*='resultRows'], table, [class*='interpretation']"));
}

export default function CiteAndExport({ name, url, year }: CiteAndExportProps) {
  const [retrieved, setRetrieved] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setRetrieved(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
  }, []);

  const citation = `SolveGrid. (${year}). ${name} [Online calculator]. ${retrieved ? `Retrieved ${retrieved}, from ` : ""}${url}`;

  async function copy(text: string, done: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(done);
    } catch {
      setMessage("Copy failed. Select the text and copy it manually.");
    }
  }

  function copyResults() {
    const el = resultElement();
    if (!hasResult(el) || !el) return setMessage("Run the calculator first, then copy the results.");
    void copy(el.innerText.replace(/^RESULT\s*/, "").trim(), "Results copied. Paste them into your document.");
  }

  function downloadWord() {
    const el = resultElement();
    if (!hasResult(el) || !el) return setMessage("Run the calculator first, then download the results.");
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("button, svg").forEach((node) => node.remove());
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${name} results</title>
<style>body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.5}h1{font-size:14pt}h2{font-size:12pt}
table{border-collapse:collapse;margin:8pt 0}th,td{border-top:1px solid #000;border-bottom:1px solid #000;padding:3pt 8pt;text-align:left}
div{margin:2pt 0}span{margin-right:8pt}p{margin:6pt 0}</style></head>
<body><h1>${name} results</h1>${clone.innerHTML}<p style="font-size:10pt">Calculated with ${citation}</p></body></html>`;
    const blob = new Blob(["﻿", html], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-results.doc`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    setMessage("Word file downloaded. It opens in Microsoft Word, LibreOffice and Google Docs.");
  }

  return (
    <section className={styles.wrap} aria-labelledby="cite-this-calculator">
      <div>
        <p className={styles.eyebrow}>USE IN YOUR THESIS</p>
        <h2 id="cite-this-calculator">Cite this calculator and export your results</h2>
        <p className={styles.note}>APA 7 reference for software or an online tool. Cite the statistical method in your text as well.</p>
        <blockquote className={styles.citation}>{citation}</blockquote>
        <div className={styles.actions}>
          <button onClick={() => void copy(citation, "Citation copied.")} type="button">Copy citation</button>
          <button onClick={copyResults} type="button">Copy results</button>
          <button onClick={downloadWord} type="button">Download results (.doc)</button>
        </div>
        {message ? <p className={styles.message} role="status">{message}</p> : null}
      </div>
    </section>
  );
}
