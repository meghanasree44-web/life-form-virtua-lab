import React,{useState} from 'react'
import {PLANTS,STAGES,stageIndex,runSim,health,healthLabel,r1} from '../lib/model'
import {Slider,LineChart} from './ui'
export default function Compare({S}){const [B,setB]=useState({sunH:3,irrAmt:.5,N:20}),p=PLANTS[S.plant],A=runSim(S,p.cycle),Bs=runSim({...S,...B},p.cycle),SB={...S,...B}
 const row=(n,s,c)=><tr><td><b>{n}</b></td><td>{STAGES(p)[stageIndex(s.prog,p)]}</td><td>{r1(s.height)} cm</td><td>{r1(s.prog)}%</td><td>{r1(s.waterUsed)} L</td><td>{health(c)}/100 ({healthLabel(health(c))})</td></tr>
 return(<div className="card"><h3>Compare two experiments (simulated for {p.cycle} days)</h3>
 <p className="note">Experiment A uses your current settings above. Experiment B is a stressed condition you can edit. Both run through the same educational model.</p>
 <div className="grid"><div><Slider l="B: sunlight" v={B.sunH} set={v=>setB({...B,sunH:v})} max={12} u=" h"/><Slider l="B: water per event" v={B.irrAmt} set={v=>setB({...B,irrAmt:v})} max={10} step={.5} u=" mm"/><Slider l="B: nitrogen" v={B.N} set={v=>setB({...B,N:v})} u=" %"/></div>
 <LineChart title="Plant height: A vs B" xs="Simulated time (days)" ys="Height (cm)" labels={A.history.map(h=>h.t)} y={A.history.map(h=>h.h)} extra={{name:'Experiment B',main:'Experiment A',labels:Bs.history.map(h=>h.t),y:Bs.history.map(h=>h.h)}}/></div>
 <table><thead><tr><th></th><th>Stage</th><th>Height</th><th>Progress</th><th>Water</th><th>Health now</th></tr></thead><tbody>{row('A (current)',A,S)}{row('B (stressed)',Bs,SB)}</tbody></table>
 <p className="note">Differences come from light, water-stress and nitrogen factors in the model. Real plants vary; these are simulated estimates, not harvest predictions.</p></div>)}
