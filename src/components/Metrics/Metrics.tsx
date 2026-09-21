import { metrics } from '../../data/siteData'
import './Metrics.css'
export default function Metrics({ values }: { values: number[] }) { return <section className="metrics-section" data-metrics>
    {/* <div className="metric-backdrop">BS</div> */}
    <div className="section-wrap metrics-grid">{metrics.map((item, i) => <div className="metric" key={item.label} data-reveal><span className="metric-no">0{i + 1}</span><strong>{values[i]}+</strong><b>{item.label}</b><small>{item.caption}</small></div>)}</div></section> }
