"use client";

import { useMemo, useState } from "react";
import ToolHeader from "../../components/ToolHeader";
import styles from "./DistanceCalculator.module.css";

type Mode = "coordinates" | "travel";
type TravelUnknown = "distance" | "speed" | "time";
const value = (input: string) => { const parsed = Number(input); return Number.isFinite(parsed) ? parsed : null; };
const fmt = (input: number | null) => input === null || !Number.isFinite(input) ? "—" : String(Number(input.toPrecision(12)));

export default function DistanceCalculator() {
  const [mode, setMode] = useState<Mode>("coordinates");
  const [x1,setX1] = useState("0"); const [y1,setY1] = useState("0"); const [x2,setX2] = useState("0"); const [y2,setY2] = useState("0");
  const [unknown,setUnknown] = useState<TravelUnknown>("distance");
  const [speed,setSpeed] = useState("0"); const [time,setTime] = useState("0"); const [distance,setDistance] = useState("0");
  const coordinate = useMemo(() => { const a=value(x1),b=value(y1),c=value(x2),d=value(y2); if([a,b,c,d].some((item)=>item===null)) return { distance:null, midpoint:null }; return { distance:Math.hypot((c as number)-(a as number),(d as number)-(b as number)), midpoint:[((a as number)+(c as number))/2,((b as number)+(d as number))/2] }; },[x1,y1,x2,y2]);
  const travel = useMemo(() => { const s=value(speed),t=value(time),d=value(distance); if(unknown==="distance") return s===null||t===null?null:s*t; if(unknown==="speed") return d===null||t===null||t===0?null:d/t; return d===null||s===null||s===0?null:d/s;},[unknown,speed,time,distance]);
  return <main id="main-content" className={styles.page}><ToolHeader active="everyday" />
    <section className={styles.hero}><p>FREE ONLINE DISTANCE CALCULATOR</p><h1>Distance for coordinates and travel.</h1><span>Find straight-line distance and midpoint between two points, or solve speed, distance, and time problems.</span></section>
    <section className={styles.workspace}><article className={styles.inputCard}><div className={styles.tabs}><button onClick={()=>setMode("coordinates")} className={mode==="coordinates"?styles.active:""} type="button">Coordinate distance</button><button onClick={()=>setMode("travel")} className={mode==="travel"?styles.active:""} type="button">Speed · distance · time</button></div>
      {mode === "coordinates" ? <><div className={styles.cardTitle}><p>COORDINATE WORKSPACE</p><h2>Two-point distance</h2></div><div className={styles.coordinateGrid}>{[
        { label: "x₁", input: x1, setInput: setX1 },
        { label: "y₁", input: y1, setInput: setY1 },
        { label: "x₂", input: x2, setInput: setX2 },
        { label: "y₂", input: y2, setInput: setY2 },
      ].map(({ label, input, setInput }) => <label key={label}><span>{label}</span><input value={input} onChange={(event) => setInput(event.target.value)} inputMode="decimal" /></label>)}</div><div className={styles.formula}>d = √((x₂ − x₁)² + (y₂ − y₁)²)</div></> : <><div className={styles.cardTitle}><p>TRAVEL WORKSPACE</p><h2>Find one unknown</h2></div><div className={styles.unknownButtons}>{(["distance","speed","time"] as TravelUnknown[]).map((item)=><button onClick={()=>setUnknown(item)} className={unknown===item?styles.active:""} key={item} type="button">Find {item}</button>)}</div><div className={styles.coordinateGrid}>{unknown!=="speed"&&<label><span>Speed</span><input value={speed} onChange={(event)=>setSpeed(event.target.value)} inputMode="decimal" /><small>distance per time</small></label>}{unknown!=="time"&&<label><span>Time</span><input value={time} onChange={(event)=>setTime(event.target.value)} inputMode="decimal" /><small>time units</small></label>}{unknown!=="distance"&&<label><span>Distance</span><input value={distance} onChange={(event)=>setDistance(event.target.value)} inputMode="decimal" /><small>distance units</small></label>}</div><div className={styles.formula}>distance = speed × time</div></>}
    </article><aside className={styles.resultCard}>{mode==="coordinates" ? <><p className={styles.eyebrow}>COORDINATE RESULT</p><h2>Distance</h2><strong>{fmt(coordinate.distance)}</strong><div className={styles.resultRow}><span>Midpoint</span><b>{coordinate.midpoint ? `(${fmt(coordinate.midpoint[0])}, ${fmt(coordinate.midpoint[1])})` : "—"}</b></div><div className={styles.tip}><p>GRAPH IT NEXT</p><span>Enter a related equation in the Graphing Calculator to visualize coordinates and function relationships.</span></div></> : <><p className={styles.eyebrow}>TRAVEL RESULT</p><h2>{unknown === "distance" ? "Distance" : unknown === "speed" ? "Speed" : "Time"}</h2><strong>{fmt(travel)}</strong><div className={styles.resultRow}><span>Formula</span><b>{unknown === "distance" ? "speed × time" : unknown === "speed" ? "distance ÷ time" : "distance ÷ speed"}</b></div><div className={styles.tip}><p>UNIT TIP</p><span>Use consistent units. For example, kilometres per hour with hours returns kilometres.</span></div></> }</aside></section>
  </main>;
}
