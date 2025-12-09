
import { useState } from 'react'
export default function Subscription(){
  const [period,setPeriod]=useState<'monthly'|'annual'>('annual')
  const price = (m:number,a:number)=> period==='annual'?`$${a.toFixed(2)} / YEAR` : `$${m.toFixed(2)} / MONTH`
  return (
    <section className="sub container">
      <h2>Choose Your Plan</h2>
      <p className="lead">Upgrade or cancel anytime</p>
      <div className="toggle">
        <div className="pill" style={{transform: `translateX(${period==='annual'?'100%':'0'})`}}></div>
        <div className="grid">
          <button className={period==='monthly'?'active':''} onClick={()=>setPeriod('monthly')}>Monthly</button>
          <button className={period==='annual'?'active':''} onClick={()=>setPeriod('annual')}>Annual</button>
        </div>
      </div>
      <div className="plans">
        <div className="plan">
          <h4>Standard</h4>
          <ul>
            <li><span>✓</span><span>Up to 1080p Full HD video</span></li>
            <li><span>✓</span><span>Up to 5.1 audio</span></li>
            <li><span>✓</span><span>Stream on 2 devices at a time</span></li>
            <li><span>✓</span><span>Ad‑free streaming</span></li>
            <li><span>✓</span><span>Downloads</span></li>
          </ul>
          <button className="btn btn-neon" style={{width:'100%'}}>{price(15.99,159.98)}</button>
        </div>
        <div className="plan reco">
          <div className="badge">Recommended</div>
          <h4>Premium</h4>
          <ul>
            <li><span>✓</span><span>Up to 4K UHD & HDR video</span></li>
            <li><span>✓</span><span>Dolby Atmos audio</span></li>
            <li><span>✓</span><span>Stream on 4 devices at a time</span></li>
            <li><span>✓</span><span>Ad‑free streaming</span></li>
            <li><span>✓</span><span>Downloads</span></li>
          </ul>
          <button className="btn btn-neon" style={{width:'100%'}}>{price(18.99,189.98)}</button>
        </div>
      </div>
      <p style={{fontSize:10, color:'var(--muted)', marginTop:12}}>*Savings compared to 12 months of the monthly subscription price.</p>
    </section>
  )
}
