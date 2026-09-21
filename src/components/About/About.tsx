import { useEffect, useRef } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'

import './About.css'

import ColumnImage from '../../assets/about/Column.png'
import BeamImage from '../../assets/about/Beam.png'
import ConnectedBeamColImage from '../../assets/about/ConnectedBeamCol.png'
import CertificateImage from '../../assets/about/Bharaath Structurals_page-0001.jpg'

interface AboutProps {
  onNavigate: (id: string) => void
}

export default function About({ onNavigate }: AboutProps) {
  const visualRef = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    const visual = visualRef.current

    if (!visual) return

    const handlePointerMove = (event: PointerEvent) => {
      const rect = visual.getBoundingClientRect()

      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height

      const rotateY = (x - 0.5) * 6
      const rotateX = (0.5 - y) * 4

      const moveX = (x - 0.5) * 7
      const moveY = (y - 0.5) * 7

      visual.style.setProperty('--mouse-x', `${moveX}px`)
      visual.style.setProperty('--mouse-y', `${moveY}px`)
      visual.style.setProperty('--mouse-rotate-x', `${rotateX}deg`)
      visual.style.setProperty('--mouse-rotate-y', `${rotateY}deg`)
    }

    const handlePointerLeave = () => {
      visual.style.setProperty('--mouse-x', '0px')
      visual.style.setProperty('--mouse-y', '0px')
      visual.style.setProperty('--mouse-rotate-x', '0deg')
      visual.style.setProperty('--mouse-rotate-y', '0deg')
    }

    visual.addEventListener('pointermove', handlePointerMove)
    visual.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      visual.removeEventListener('pointermove', handlePointerMove)
      visual.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  const aboutRef = useRef<HTMLElement | null>(null);
useEffect(() => {
  const section = aboutRef.current;

  if (!section) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;

        section.classList.add("is-visible");

        // Stop observing after animation has been triggered
        observer.unobserve(section);
      }
    },
    {
      threshold: 0.25,
    }
  );

  observer.observe(section);

  return () => observer.disconnect();
}, []);
  return (
    <section ref={aboutRef} id="about" className="about-section">

      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        className="about-grid-lines"
        aria-hidden="true"
      />

      <div
        className="blueprint-line blueprint-line--large"
        aria-hidden="true"
      />

      <div
        className="blueprint-line blueprint-line--small"
        aria-hidden="true"
      />


      {/* =====================================================
          MAIN CONTAINER
          ===================================================== */}

      <div className="about-container">


        {/* ===================================================
            STRUCTURAL VISUAL
            =================================================== */}

        <div
          ref={visualRef}
          className="about-visual"
          aria-hidden="true"
        >

          <div className="visual-grid" />

          <div className="visual-ground" />


          {/* Technical rings */}

          <div className="technical-ring technical-ring--one" />

          <div className="technical-ring technical-ring--two" />

          <div className="technical-ring technical-ring--three" />


          {/* =================================================
              ASSEMBLY
              ================================================= */}

          <div className="assembly-stage">


            {/* =================================================
                INDIVIDUAL MEMBERS

                These are inside one wrapper.

                The wrapper is responsible for making BOTH
                individual images disappear before the final
                connected image appears.
                ================================================= */}

            <div className="assembly-parts">


              {/* COLUMN */}

              <div className="assembly-column">

                <img
                  src={ColumnImage}
                  alt=""
                  draggable={false}
                />

              </div>


              {/* BEAM */}

              <div className="assembly-beam">

                <img
                  src={BeamImage}
                  alt=""
                  draggable={false}
                />

              </div>

            </div>


            {/* =================================================
                CONNECTION IMPACT
                ================================================= */}

            <div className="connection-impact">

              <span className="impact-core" />

              <span className="impact-ring" />

              <span className="impact-ring impact-ring--two" />

            </div>


            {/* =================================================
                FINAL CONNECTED IMAGE

                This appears AFTER the two individual parts
                have disappeared.
                ================================================= */}

            <div className="assembly-connected">

              <img
                src={ConnectedBeamColImage}
                alt=""
                draggable={false}
              />

            </div>


            <div className="connection-glow" />

          </div>


          {/* =================================================
              TECHNICAL LABEL
              ================================================= */}

          <div className="assembly-label assembly-label--top" style={{color:'black',fontSize:'10px'}}>

            <span>01</span>

            <span>
              STRUCTURAL ASSEMBLY
            </span>

          </div>


          <div className="assembly-label assembly-label--connection">

            <span className="label-line" />

            <span>
              CONNECTION
            </span>
                <div className="assembly-label assembly-label--bottom" style={{color:'black',fontSize:'10px'}}>

            <span>STEEL</span>

            <span>BIM</span>

            <span>DETAIL</span>

          </div>
          </div>


          

        </div>


        {/* ===================================================
            LEFT HEADING
            =================================================== */}

        <div
          className="about-intro"
          data-reveal
        >

          <div className="about-eyebrow">

            <span className="about-eyebrow-line" />

            <span style={{fontSize:'28px',fontWeight:"bolder"}}>
              WHO WE ARE
            </span>

          </div>


          <h2 className="about-title">

            Engineering

            <br />

            <span>
              better structures.
            </span>

          </h2>

            {/* <div className="about-index" >

            <span>01</span>

            <span className="about-index-line" />

            <span>ABOUT BS</span>

          </div> */}
        

        </div>


        {/* ===================================================
            RIGHT CONTENT
            =================================================== */}

        <div
          className="about-content"
          data-reveal
        >

          <p className="about-lead">
             
             Bharaat Structurals, established in <span style={{color:'blue'}}> 2020</span>, is a leading provider of Tekla steel structures detailing services.
             <br />
            Bharaat Structurals brings together structural
            steel expertise, digital modelling and disciplined
            detailing workflows to help teams move from
            design intent to fabrication with confidence.

          </p>
            

          <div className="about-divider" />


          <div className="about-description">

            <p>
              Our approach is built around technical accuracy,
              coordination and clear deliverables. Every model
              is developed with the next stage of construction
              in mind.
            </p>

            <p>
              From structural modelling and detailing to
              fabrication-ready information, we focus on
              creating reliable digital outputs that support
              real-world construction.
            </p>

          </div>


          {/* =================================================
              FEATURES
              ================================================= */}

          <div className="about-features">


            <div className="about-feature">

              <span className="about-feature-icon">

                <Check
                  size={14}
                  strokeWidth={2.5}
                />

              </span>

              <div>

                <strong>
                  PRECISION
                </strong>

                <span>
                  Detail-driven engineering
                </span>

              </div>

            </div>


            <div className="about-feature">

              <span className="about-feature-icon">

                <Check
                  size={14}
                  strokeWidth={2.5}
                />

              </span>

              <div>

                <strong>
                  COORDINATION
                </strong>

                <span>
                  Connected digital workflows
                </span>

              </div>

            </div>


            <div className="about-feature">

              <span className="about-feature-icon">

                <Check
                  size={14}
                  strokeWidth={2.5}
                />

              </span>

              <div>

                <strong>
                  DELIVERY
                </strong>

                <span>
                  Fabrication-ready information
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              CTA
              ================================================= */}

         <button
        className="about-link"
        type="button"
        onClick={() => onNavigate('clients')}
      >
        <span>
              <a
              href={CertificateImage}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: 'black',
                fontSize: '15px'
              }}
            >
              Certifications & Development
            </a>
        </span>
        

        <span className="about-link-icon">
         <a
              href={CertificateImage}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: 'black',
                fontSize: '15px'
              }}
            ><ArrowUpRight
            size={17}
            strokeWidth={1.8}
          /></a> 
          
        </span>
      </button>

        </div>

      </div>


      {/* =====================================================
          BACKGROUND MONOGRAM
          ===================================================== */}

      <div
        className="about-monogram"
        aria-hidden="true"
      >
        BS
      </div>


      {/* =====================================================
          BOTTOM TECHNICAL LABEL
          ===================================================== */}

      <div
        className="about-coordinate"
        aria-hidden="true"
      >

        {/* <span>
          BS / STRUCTURAL ENGINEERING
        </span> */}
         
        <span style={{color:'black',fontSize:'10px'}}>
          PRECISION · COORDINATION · DELIVERY
        </span>

      </div>

    </section>
  )
}