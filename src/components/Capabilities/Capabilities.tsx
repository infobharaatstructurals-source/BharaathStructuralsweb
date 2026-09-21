import Icon from '../common/Icon'
import './Capabilities.css'

export default function Capabilities() {
  return (
    <section id="expertise" className="capabilities-section section-light">
      <div className="section-wrap capabilities-grid">
        <div className="cap-copy" data-reveal>
          <div className="eyebrow blue" style={{fontSize:'23px'}}>OUR EXPERTISE</div>
          <h2 className="display-title">From model<br/>to <span>fabrication.</span></h2>
          <p>Our detailing workflow connects 3D modelling, engineering information, checking and documentation into one coordinated process.</p>
          <div className="cap-points">{['Tekla steel detailing','BIM coordination','Fabrication-ready drawings'].map(point=><div key={point}><Icon name="Check" size={15}/>{point}</div>)}</div>
        </div>
        <div className="technical-visual" data-reveal>
          <div className="visual-toolbar"><span>TEKLA / MODEL VIEW</span><span>3D</span></div>
          <div className="wireframe-building"><div className="wf-floor f1"/><div className="wf-floor f2"/><div className="wf-floor f3"/>{Array.from({length:7}).map((_,i)=><i key={i} style={{left:`${10+i*13}%`}}/>)}{Array.from({length:4}).map((_,i)=><b key={i} style={{top:`${17+i*20}%`}}/>)}</div>
          <div className="visual-tag tag-1">BEAM / B12</div><div className="visual-tag tag-2">COLUMN / C04</div><div className="visual-tag tag-3">GRID A—F</div>
        </div>
      </div>
    </section>
  )
}
