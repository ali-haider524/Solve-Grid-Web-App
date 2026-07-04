"use client";

import { useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import styles from "./BmiCalculator.module.css";

type UnitMode = "metric" | "imperial";
const number = (input: string) => { const parsed = Number(input); return Number.isFinite(parsed) ? parsed : null; };
const format = (input: number | null) => input === null || !Number.isFinite(input) ? "—" : String(Number(input.toPrecision(5)));

function getRange(bmi: number | null) {
  if (bmi === null) return { label: "Enter measurements", detail: "Add valid height and weight measurements to calculate BMI.", tone: "neutral" };
  if (bmi < 18.5) return { label: "Below the standard screening range", detail: "BMI is only a screening measure. It does not describe overall health on its own.", tone: "neutral" };
  if (bmi < 25) return { label: "Standard screening range", detail: "BMI is only one health screening measure and does not account for every individual factor.", tone: "positive" };
  if (bmi < 30) return { label: "Above the standard screening range", detail: "BMI is only a screening measure. A qualified professional can provide personal context if needed.", tone: "neutral" };
  return { label: "Higher screening range", detail: "BMI is only a screening measure. It does not diagnose any health condition.", tone: "neutral" };
}

export default function BmiCalculator() {
  const [unitMode, setUnitMode] = useState<UnitMode>("metric");
  const [age, setAge] = useState("");
  const [weightKg, setWeightKg] = useState(""); const [heightCm, setHeightCm] = useState("");
  const [weightLb, setWeightLb] = useState(""); const [heightFt, setHeightFt] = useState(""); const [heightIn, setHeightIn] = useState("");
  const ageValue = number(age);
  const isAdult = ageValue === null || ageValue >= 20;
  const bmi = useMemo(() => {
    if (!isAdult) return null;
    if (unitMode === "metric") { const kg=number(weightKg), cm=number(heightCm); return kg===null||cm===null||kg<=0||cm<=0 ? null : kg / ((cm/100)**2); }
    const lb=number(weightLb), ft=number(heightFt), inch=number(heightIn); const totalInches=(ft??0)*12+(inch??0); return lb===null||ft===null||inch===null||lb<=0||totalInches<=0 ? null : 703*lb/(totalInches**2);
  },[isAdult,unitMode,weightKg,heightCm,weightLb,heightFt,heightIn]);
  const range = getRange(bmi);
  return <main id="main-content" className={styles.page}><ToolHeader active="everyday" />
    <section className={styles.hero}><p>ADULT BMI CALCULATOR</p><h1>A clear BMI screening calculation.</h1><span>Calculate adult body mass index using metric or imperial measurements. Age is used only to confirm this adult screening tool is appropriate; it does not create a child or teen BMI assessment.</span></section>
    <section className={styles.workspace}><article className={styles.inputCard}><p className={styles.eyebrow}>MEASUREMENTS</p><h2>Calculate adult BMI</h2>
      <label className={styles.ageField}><span>Age (optional)</span><input value={age} onChange={(event)=>setAge(event.target.value)} inputMode="numeric" placeholder="20 or older" /><small>This calculator is designed for adults 20 and older.</small></label>
      <div className={styles.tabs}><button onClick={()=>setUnitMode("metric")} className={unitMode==="metric" ? styles.active : ""} type="button">Metric</button><button onClick={()=>setUnitMode("imperial")} className={unitMode==="imperial" ? styles.active : ""} type="button">Imperial</button></div>
      {unitMode === "metric" ? <div className={styles.fields}><label><span>Weight</span><input value={weightKg} onChange={(event)=>setWeightKg(event.target.value)} inputMode="decimal" /><small>kilograms</small></label><label><span>Height</span><input value={heightCm} onChange={(event)=>setHeightCm(event.target.value)} inputMode="decimal" /><small>centimetres</small></label></div> : <div className={styles.fieldsThree}><label><span>Weight</span><input value={weightLb} onChange={(event)=>setWeightLb(event.target.value)} inputMode="decimal" /><small>pounds</small></label><label><span>Height</span><input value={heightFt} onChange={(event)=>setHeightFt(event.target.value)} inputMode="numeric" /><small>feet</small></label><label><span>Height</span><input value={heightIn} onChange={(event)=>setHeightIn(event.target.value)} inputMode="numeric" /><small>inches</small></label></div>}
      <div className={styles.formula}>{unitMode === "metric" ? "BMI = weight (kg) ÷ height² (m)" : "BMI = 703 × weight (lb) ÷ height² (in)"}</div></article>
      <aside className={styles.resultCard}><p className={styles.eyebrow}>BMI RESULT</p><h2>Body mass index</h2>{!isAdult ? <div className={styles.ageNotice}><b>This adult BMI tool is not for ages under 20.</b><span>For children and teens, BMI interpretation requires age- and sex-specific percentile assessment by a qualified health professional. This page does not estimate those percentiles.</span></div> : <><strong>{format(bmi)}</strong><div className={`${styles.range} ${range.tone === "positive" ? styles.positive : ""}`}><b>{range.label}</b><span>{range.detail}</span></div></>}<div className={styles.notice}><p>IMPORTANT</p><span>Designed for adults 20 and older. BMI is a screening measure, not a diagnosis, and does not account for every individual factor.</span></div></aside></section>
  </main>;
}
