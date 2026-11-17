import React,{useState,useContext,createContext} from 'react'
import {Slider} from './ui'
export const XCtx=createContext({done:[],mark:()=>{}})
export const qp=(k)=>{try{return +new URLSearchParams(location.search).get(k)||0}catch{return 0}}
export const Tabs=({tabs,v,set})=>{const {done}=useContext(XCtx);return <div className="tabs noprint">{tabs.map(([id,l],i)=><button key={id} className={v===i?'on':''} onClick={()=>set(i)}>{i+1}. {l.toUpperCase()}{done.includes(id)?' ✓':''}</button>)}</div>}
export const ZSlider=({z=[],...p})=><div className="zs"><Slider {...p}/><div className="zones">{z.map(x=><span key={x}>{x}</span>)}</div></div>
export const Ro=({l,v,u,n,c})=><div className="ro"><small>{l}</small><b style={c?{color:c}:null}>{v}<i>{u}</i></b><em>{n}</em></div>
export default function Experiment({id,tag,title,intro,steps,ro,app,ctl,diag,note}){
 const {done,mark}=useContext(XCtx),[k,setK]=useState(done.includes(id)?steps.length:0),all=k>=steps.length,R=x=>typeof x==='function'?x(k):x
 return(<div className="xp"><div className="card"><small className="mono">{tag}</small><h3 className="serif">{title}</h3><p className="note">{intro}</p>
 {steps.map((s,i)=><div key={i} className={'step '+(i<k?'past':i===k?'cur':'')}>{i+1}. {s}</div>)}
 <div><button className="btn" disabled={all} onClick={()=>{setK(k+1);if(k+1>=steps.length)mark(id)}}>{all?'Procedure Completed ✓':'Advance Procedure Step'}</button><button className="btn gr" onClick={()=>setK(0)}>Reset &amp; Repeat</button></div>
 {note&&<div className="callout">{note}</div>}</div>
 <div><div className="dark"><div className="ros">{R(ro).map(r=><Ro key={r.l} {...r}/>)}</div>{R(app)}</div><div className="card">{R(ctl)}</div>{diag&&<div className="diag"><small className="mono">DIAGNOSIS</small>{R(diag)}</div>}</div></div>)}
