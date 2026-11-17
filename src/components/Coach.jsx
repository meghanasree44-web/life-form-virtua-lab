import React from 'react'
import {PLANTS,siteScore,mediumProps,factors,r1,STAGES,stageIndex} from '../lib/model'
export default function Coach({m,G}){const {S,site,rain,med,seed}=G,p=PLANTS[S.plant],mp=mediumProps(med),f=factors(S),w=Object.entries(f).sort((a,b)=>a[1]-b[1])[0]
 const t=[ 'Read the ten topic cards, then study the layer diagram: every layer protects the roof or feeds the plant.',
 `Site score is ${r1(siteScore(site).total)}/100. ${siteScore(site).warn[0]||'No warnings. Remember: a virtual score is not engineering approval.'}`,
 `Rain of ${rain.mm} mm on ${rain.area} m² collects ${r1(rain.mm*rain.area)} L (V = R × A).`,
 `Your mix holds ${r1(mp.wr)}/100 water and drains ${r1(mp.dr)}/100. ${mp.total!==100?'Make the total exactly 100%.':'Mix total is 100%.'}`,
 `${p.name}: germinates in about ${p.germ} days at ${p.t[0]}–${p.t[1]} °C. ${seed.treated?'Seeds treated.':'Apply a seed treatment first.'}`,
 w[1]<.7?`Weakest factor right now: ${w[0]} (${w[1].toFixed(2)}). Fix it and watch growth speed change.`:`Conditions are good for ${p.name}. Stage: ${STAGES(p)[stageIndex(S.prog,p)]}.`][m]||'Complete the practicals, then review your report.'
 return <div className="coach"><b>Real-time science coach</b> {t}</div>}
