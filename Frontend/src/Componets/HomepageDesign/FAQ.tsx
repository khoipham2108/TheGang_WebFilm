
import { useState } from 'react'
function Item({q,a}:{q:string,a:string}){
  const [open,setOpen]=useState(false)
  return (
    <div className="card item">
      <div className="q" onClick={()=>setOpen(!open)}>
        <span style={{fontSize:18, fontWeight:700}}>{q}</span>
        <span style={{fontSize:24}}>{open?'−':'+'}</span>
      </div>
      {open && <div className="a">{a}</div>}
    </div>
  )
}
export default function FAQ(){
  const data=[
    {q:'What is The Gangs+?',a:'A demo streaming-style landing page.'},
    {q:'What can I watch?',a:'Anything you add as posters and trailers.'},
    {q:'Where can I watch?',a:'Desktop and mobile — responsive.'},
    {q:'How much does it cost?',a:'This is a static demo — pricing is up to you.'},
  ]
  return (
    <section className="faq container">
      <h2>Frequently Asked Questions</h2>
      <div style={{maxWidth:760, margin:'0 auto'}}>
        {data.map((it,i)=>(<Item key={i} q={it.q} a={it.a}/>))}
      </div>
    </section>
  )
}
