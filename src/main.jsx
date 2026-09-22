import React,{useState} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";
const SYMBOLS=["🍒","🍋","🔔","⭐","💎","7️⃣"];
const PAYOUTS={"🍒":5,"🍋":8,"🔔":12,"⭐":20,"💎":40,"7️⃣":100};
const randomSymbol=()=>SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)];
const makeReels=()=>Array.from({length:5},()=>Array.from({length:3},randomSymbol));
function App(){
 const [reels,setReels]=useState(makeReels),[credits,setCredits]=useState(1000),[bet,setBet]=useState(10),[spinning,setSpinning]=useState(false),[message,setMessage]=useState("Good luck!"),[win,setWin]=useState(0),[jackpot,setJackpot]=useState(100);
 const canSpin=credits>=bet&&!spinning;
 function spin(){
  if(!canSpin)return;
  setSpinning(true);setWin(0);setMessage("Spinning...");setCredits(c=>c-bet);
  let ticks=0;
  const timer=setInterval(()=>{
   ticks++;setReels(makeReels());
   if(ticks>=12){
    clearInterval(timer);
    const final=makeReels();setReels(final);
    const counts={};final.forEach(r=>counts[r[1]]=(counts[r[1]]||0)+1);
    const best=Math.max(...Object.values(counts));const winner=Object.keys(counts).find(s=>counts[s]===best);
    let payout=best>=3?Math.floor(bet*(PAYOUTS[winner]||0)/5):0;
    if(best===5&&winner==="7️⃣")payout+=jackpot;
    setWin(payout);setCredits(c=>c+payout);setJackpot(j=>Math.min(100,j+Math.max(1,Math.floor(bet/10))));
    setMessage(payout?"WIN! +"+payout+" credits":"No win — spin again!");setSpinning(false);
   }
  },90);
 }
 return <main className="app">
  <header><div className="brand">MAGIC<span>SLOTS</span></div><div className="jackpot">JACKPOT<strong>${jackpot}</strong></div></header>
  <section className="machine"><div className="marquee">✨ MAGIC SLOTS ✨</div>
   <div className="reels">{reels.map((reel,i)=><div className="reel" key={i}>{reel.map((s,j)=><div className={"symbol "+(spinning?"blur":"")} key={j}>{s}</div>)}</div>)}</div>
   <div className={"message "+(win?"winner":"")}>{message}</div>
   <div className="paytable">{SYMBOLS.map(s=><span key={s}>{s} ×{PAYOUTS[s]}</span>)}</div>
  </section>
  <section className="controls"><div className="balance"><small>CREDITS</small><strong>{credits.toLocaleString()}</strong></div>
   <div className="bet"><button onClick={()=>setBet(Math.max(1,bet-1))}>−</button><div><small>BET</small><strong>{bet}</strong></div><button onClick={()=>setBet(Math.min(100,bet+1))}>+</button></div>
   <button className="spin" disabled={!canSpin} onClick={spin}>{spinning?"SPINNING":"SPIN"}</button>
  </section><p className="demo">DEMO PLAY • VIRTUAL CREDITS ONLY</p>
 </main>
}
createRoot(document.getElementById("root")).render(<App/>);