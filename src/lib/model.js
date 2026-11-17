// Educational growth & calculation model (no UI code). All coefficients are ASSUMED teaching values.
export const clamp=(x,a,b)=>Math.min(b,Math.max(a,x))
export const trap=(x,a,b,c,d)=>x<=a||x>=d?0:x<b?(x-a)/(b-a):x<=c?1:(d-x)/(d-c)
export const r1=(x)=>Math.round(x*10)/10
export const PLANTS={
 tomato:{name:'Tomato',t:[18,28],sun:6,m:[25,40],sp:45,germ:7,cycle:90,h:120,kc:.9,fruit:true,water:'High',seed:'Flat, cream-coloured, 3–4 mm',note:'Fruiting crop; needs strong sun and potassium for fruit set.'},
 spinach:{name:'Spinach',t:[10,22],sun:4,m:[28,42],sp:15,germ:5,cycle:40,h:20,kc:.8,fruit:false,water:'Medium',seed:'Dry, prickly-looking, 3 mm',note:'Cool-season leafy crop; bolts in heat.'},
 coriander:{name:'Coriander',t:[14,26],sun:4,m:[25,40],sp:10,germ:8,cycle:45,h:40,kc:.8,fruit:false,water:'Medium',seed:'Round split fruits, 4 mm',note:'Slow germination; split the seed husk before sowing.'},
 chilli:{name:'Chilli',t:[20,32],sun:6,m:[22,38],sp:40,germ:9,cycle:100,h:70,kc:.85,fruit:true,water:'Medium',seed:'Flat, pale yellow, 3 mm',note:'Warm-season; tolerates heat better than tomato.'},
 lettuce:{name:'Lettuce',t:[10,22],sun:4,m:[28,42],sp:25,germ:5,cycle:50,h:25,kc:.8,fruit:false,water:'Medium',seed:'Small, slender, 2–3 mm',note:'Shallow roots; dries out fast on roofs.'},
 radish:{name:'Radish',t:[10,25],sun:4,m:[25,38],sp:7,germ:4,cycle:28,h:20,kc:.75,fruit:false,water:'Medium',seed:'Round, reddish-brown, 2–3 mm',note:'Fastest crop; needs loose medium for the root.'},
 fenugreek:{name:'Fenugreek',t:[12,28],sun:4,m:[22,38],sp:8,germ:5,cycle:35,h:40,kc:.7,fruit:false,water:'Low–Medium',seed:'Hard, yellow-brown, 4 mm',note:'Tolerates dry spells; soaking speeds germination.'}}
export const MEDIA={ soil:{n:'Garden soil',wr:30,dr:35,ae:30,nu:60,bd:1300},coco:{n:'Cocopeat',wr:70,dr:60,ae:65,nu:20,bd:100},
 compost:{n:'Compost',wr:55,dr:50,ae:50,nu:90,bd:500},vermi:{n:'Vermicompost',wr:55,dr:50,ae:55,nu:100,bd:450},
 perlite:{n:'Perlite',wr:20,dr:95,ae:95,nu:0,bd:100},sand:{n:'Sand',wr:10,dr:95,ae:60,nu:5,bd:1600}}
export const mediumProps=(m)=>{const total=Object.values(m).reduce((a,b)=>a+b,0),t=total||1,o={total}
 for(const k of ['wr','dr','ae','nu','bd'])o[k]=Object.keys(MEDIA).reduce((s,i)=>s+MEDIA[i][k]*m[i]/t,0);return o}
export const STAGES=(p)=>p.fruit?['Germination','Seedling','Vegetative growth','Leaf development','Flowering','Fruiting','Harvest']:['Germination','Seedling','Vegetative growth','Leaf development','Mature (harvest)']
export const stageIndex=(prog,p)=>{const s=STAGES(p),cut=p.fruit?[4,12,40,60,75,95]:[4,12,45,95];let i=0;cut.forEach((c,k)=>{if(prog>=c)i=k+1});return Math.min(i,s.length-1)}
export const factors=(S)=>{const p=PLANTS[S.plant],eff=S.sunH*S.intensity/100,sp=S.spacing/p.sp
 const f={light:clamp(trap(eff,p.sun*.2,p.sun,12,13),.05,1),water:clamp(trap(S.moisture,5,p.m[0],p.m[1],55),.05,1),
 temp:clamp(trap(S.temp,p.t[0]-9,p.t[0],p.t[1],p.t[1]+9),.05,1),space:sp<1?.4+.6*sp:sp>2.5?.9:1}
 const nf=v=>clamp(trap(v,0,45,80,105),.1,1);f.nutr=Math.min(nf(S.N),nf(S.P),nf(S.K));f.hum=clamp(trap(S.hum,10,35,85,101),.3,1);const ws=S.wind-(S.support?6:0);f.wind=ws>10?clamp(1-(ws-10)/25,.4,1):1;return f}
export const growthRate=(S)=>{const f=factors(S);return f.light*f.water*f.temp*f.space*f.nutr}
export const et0=(T)=>Math.max(1,.2*T-1)
export const area=(S)=>Math.max(S.beds*S.bedArea,.1)
export const step=(S,dt)=>{const p=PLANTS[S.plant],eff={drip:.9,sprinkler:.75,manual:.6}[S.method]
 let m=S.moisture+(S.irrAmt*S.irrFreq*eff-(0.5+.15*Math.max(0,S.temp-10))*(1.3-MP[S.medium].wr/100)*(1.3-S.hum/200)*(1+S.wind/30))*dt
 if(m>45)m-=(m-45)*.3*MP[S.medium].dr/50*dt;m=clamp(m,2,60)
 const S2={...S,moisture:m,waterUsed:S.waterUsed+S.irrAmt*S.irrFreq*area(S)*dt,t:S.t+dt}
 const rate=growthRate(S2),germ=S.t<p.germ
 S2.prog=Math.min(100,S.prog+(germ?100*dt/p.cycle*.3*Math.min(1,rate*2):100*dt/(p.cycle-p.germ)*rate))
 S2.height=p.h*Math.pow(S2.prog/100,.8);if(S2.prog>=100)S2.running=false
 S2.history=[...S.history,{t:+S2.t.toFixed(2),h:S2.height,w:S2.waterUsed,m,prog:S2.prog}].slice(-400);return S2}
export const rainLitres=(R,A)=>R*A
export const moistureContent=(wet,dry)=>(wet-dry)/dry*100
export const siteScore=(s)=>{const sc={sun:clamp(s.sun*(1-(s.shade||0)/100)/6,0,1)*25,drain:{good:15,fair:8,poor:0}[s.drain],load:clamp((s.load-100)/150,0,1)*25,wind:{low:10,medium:6,high:0}[s.wind],
 slope:s.slope<=10?10:s.slope<=20?5:0,water:{good:8,fair:4,poor:0}[s.waterAv],access:{easy:7,limited:3,difficult:0}[s.access]}
 const total=Object.values(sc).reduce((a,b)=>a+b,0),w=[]
 if(s.load<150)w.push('Roof load below 150 kg/m²: only light containers. Consult a structural engineer.')
 if(s.drain==='poor')w.push('Poor drainage risks waterlogging and roof leaks.');if(s.wind==='high')w.push('High wind: use windbreaks and anchored containers.')
 if(s.slope>20)w.push('Steep slope: unsafe for people and containers.');if(s.sun<4)w.push('Under 4 h of sun limits most vegetables to leafy crops.')
 return{sc,total,warn:w}}
export const wetWeight=(m,litres)=>{const p=mediumProps(m);return litres*p.bd/1000*(1+p.wr/100*.6)}

export const MP={garden:{n:'Garden soil',wr:30,dr:35},mix:{n:'Rooftop mix (cocopeat+compost+perlite)',wr:50,dr:60},coco:{n:'Cocopeat-heavy',wr:70,dr:60},sandy:{n:'Sandy mix',wr:15,dr:90}}
PLANTS.mint={name:'Mint',t:[15,28],sun:4,m:[30,45],sp:20,germ:10,cycle:60,h:35,kc:.85,fruit:false,water:'High',seed:'Very tiny, dark brown (often grown from cuttings)',note:'Spreads fast; keep in its own pot.'}
PLANTS.brinjal={name:'Brinjal',t:[22,32],sun:6,m:[25,40],sp:50,germ:8,cycle:110,h:90,kc:.9,fruit:true,water:'High',seed:'Flat, round, light brown, 3 mm',note:'Warm-season fruiting crop; needs support and potassium.'}
const X={tomato:['Warm season / Oct–Feb in India','Pick red fruit, from ~65 days after transplant',1,'Rich, well-drained mix'],spinach:['Cool season','Cut outer leaves from ~30 days',1,'Moisture-retentive, nitrogen-rich'],coriander:['Cool season','Cut leaves from ~30 days',1.5,'Light, well-drained'],chilli:['Warm season','Pick green/red fruit from ~75 days',1,'Well-drained, compost-rich'],lettuce:['Cool season','Harvest heads at ~40–50 days',.5,'Light, moist, fine-textured'],radish:['Cool season','Pull roots at ~25–30 days',1.5,'Loose, deep, aerated'],fenugreek:['Cool/mild season','Cut leaves from ~25 days',1,'Light, well-drained'],mint:['Most seasons, partial shade tolerant','Snip tips regularly after ~45 days',.3,'Moist, rich, well-drained'],brinjal:['Warm season','Pick glossy fruit from ~80 days',1,'Deep, rich, well-drained']}
for(const k in X)Object.assign(PLANTS[k],{season:X[k][0],harvest:X[k][1],depth:X[k][2],medium:X[k][3]})
export const health=(S)=>Math.round(100*Math.min(...Object.values(factors(S))))
export const healthLabel=(h)=>h>=80?'Healthy':h>=50?'Stressed':'Poor'
export const runSim=(S,days)=>{let s={...S,running:true,t:0,prog:0,height:0,waterUsed:0,history:[]},i=0;while(s.running&&s.t<days&&i++<2000)s=step(s,.5);return s}
export const rhFrom=(Td,Tw)=>{const es=T=>6.112*Math.exp(17.62*T/(243.12+T));return clamp(100*(es(Tw)-0.00066*(1+0.00115*Tw)*1013*(Td-Tw))/es(Td),0,100)}
export const balanceIrr=(S)=>{const eff={drip:.9,sprinkler:.75,manual:.6}[S.method];return Math.round((.5+.15*Math.max(0,S.temp-10))*(1.3-MP[S.medium].wr/100)*(1.3-S.hum/200)*(1+S.wind/30)/(eff*S.irrFreq)*10)/10}
