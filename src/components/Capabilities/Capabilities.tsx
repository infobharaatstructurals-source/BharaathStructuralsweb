import Icon from '../common/Icon'
import Beam from '../../assets/about/Beam25.png'
import Column from '../../assets/about/Col25.png'
import './Capabilities.css'

export default function Capabilities() {
  return (
    <section id="expertise" className="capabilities-section section-light">
      <div className="section-wrap capabilities-grid">

        {/* ================= LEFT CONTENT ================= */}
        <div className="cap-copy" data-reveal>

          <div
            className="eyebrow blue"
            style={{ fontSize: '23px' }}
          >
            OUR EXPERTISE
          </div>

          <h2 className="display-title">
            From model
            <br />
            to <span>fabrication.</span>
          </h2>

          <p>
            Our detailing workflow connects 3D modelling, engineering
            information, checking and documentation into one coordinated
            process.
          </p>

          <div className="cap-points">

            {[
              'Tekla steel detailing',
              'BIM coordination',
              'Fabrication-ready drawings'
            ].map((point) => (
              <div key={point}>
                <Icon name="Check" size={15} />
                <span>{point}</span>
              </div>
            ))}

          </div>
        </div>


        {/* ================= 3D MODEL VISUAL ================= */}
        <div className="technical-visual" data-reveal>

          {/* Toolbar */}
          <div className="visual-toolbar">
            <span>TEKLA / MODEL VIEW</span>
            <span>3D</span>
          </div>


          {/* ================= MODEL STAGE ================= */}
          <div className="model-stage">

            {/* Background grid */}
            <div className="model-grid" />


            {/* Horizontal grid lines */}
            <div className="horizontal-line line-1" />
            <div className="horizontal-line line-2" />
            <div className="horizontal-line line-3" />
            <div className="horizontal-line line-4" />


            {/* Vertical structural lines */}
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="vertical-line"
                style={{
                  left: `${12 + index * 13}%`
                }}
              />
            ))}


            {/* ================= REAL BEAM ================= */}
            <img
              src={Beam}
              alt="Steel beam"
              className="real-beam"
            />


            {/* ================= REAL COLUMN ================= */}
            <img
              src={Column}
              alt="Steel column"
              className="real-column"
            />


            {/* Blue ambient light */}
            <div className="model-glow" />

          </div>


          {/* ================= HUD TAGS ================= */}

          <div className="visual-tag tag-1">
            BEAM / B12
          </div>

          <div className="visual-tag tag-2">
            COLUMN / C04
          </div>

          <div className="visual-tag tag-3">
            GRID A—F
          </div>

        </div>

      </div>
    </section>
  )
}