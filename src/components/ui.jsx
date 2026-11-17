import React,{useEffect,useRef} from 'react'
import {Chart,registerables} from 'chart.js'
Chart.register(...registerables)
export const Slider=({l,v,set,min=0,max=100,step=1,u=''})=>(<label className="sl"><span>{l}<b>{v}{u}</b></span><input type="range" min={min} max={max} step={step} value={v} onChange={e=>set(+e.target.value)}/></label>)
export const Stat=({l,v,u})=>(<div className="stat"><small>{l}</small><b>{v}<small> {u}</small></b></div>)
export const Tag=({t})=><span className={'tag '+(t==='assumed'?'a':t==='measured'?'m':'')}>{t}</span>
export const LabSheet=({aim,app,prin,proc,obs,res,out})=>(<div className="sheet">{[['Aim',aim],['Apparatus',app],['Principle',prin],['Procedure',proc],['Observation',obs],['Result',res],['Learning outcome',out]].map(([k,v])=><p key={k}><b>{k}:</b> {v}</p>)}</div>)
export const Mod=({t,sub,children})=>(<section><h2>{t}</h2><p className="lead">{sub}</p>{children}</section>)
export function LineChart({title,x,y,xs,ys,labels,cur,extra,type='line'}){const ref=useRef(),ch=useRef()
 useEffect(()=>{const ds=[{label:ys,data:labels.map((l,i)=>({x:l,y:y[i]})),borderColor:'#008B8B',backgroundColor:'#008B8B33',pointRadius:0,tension:.3,fill:true}]
  if(extra)ds.push({label:extra.name,data:extra.labels.map((l,i)=>({x:l,y:extra.y[i]})),borderColor:'#0284C7',pointRadius:0,tension:.3});ds[0].label=extra?extra.main:ys
  if(cur)ds.push({label:'Current value',data:[cur],borderColor:'#EA580C',backgroundColor:'#EA580C',pointRadius:7,showLine:false})
  const opt={responsive:true,maintainAspectRatio:false,animation:false,scales:{x:{type:'linear',title:{display:true,text:xs},grid:{display:true}},y:{title:{display:true,text:ys},grid:{display:true},beginAtZero:true}},plugins:{title:{display:true,text:title},tooltip:{enabled:true}}}
  if(ch.current){ch.current.data.datasets=ds;ch.current.options=opt;ch.current.update()}else ch.current=new Chart(ref.current,{type:'line',data:{datasets:ds},options:opt})},[title,x,y,cur?.x,cur?.y,labels])
 useEffect(()=>()=>ch.current?.destroy(),[]);return <div style={{height:240}}><canvas ref={ref}/></div>}
