import './Partners.css'

import AUTODESK from '../../assets/Partners/AUTODESK.png'
import JSSL from '../../assets/Partners/JSSL.png'
import JSW from '../../assets/Partners/JSW.png'
import KIRBY from '../../assets/Partners/KIRBY.png'
import LT from '../../assets/Partners/L&T.png'
import NISARG from '../../assets/Partners/NISARG.png'
import PDFFOXIT from '../../assets/Partners/PDFFOXIT.png'
import TEKLA from '../../assets/Partners/TEKLA.png'
import TRIMBLE from '../../assets/Partners/TRIMBLE.png'
import ZWCAD from '../../assets/Partners/ZWCAD.png'


/* =========================================================
   PARTNERS
========================================================= */

const partnerLogos = [
  {
    name: 'Trimble',
    image: TRIMBLE,
    className: 'bs-trimble',
  },
  {
    name: 'ZWCAD',
    image: ZWCAD,
    className: 'bs-zwcad',
  },
  {
    name: 'Autodesk',
    image: AUTODESK,
    className: 'bs-autodesk',
  },
  {
    name: 'PDF Foxit',
    image: PDFFOXIT,
    className: 'bs-foxit',
  },
  {
    name: 'Tekla',
    image: TEKLA,
    className: 'bs-tekla',
  },
  {
    name: 'Kirby',
    image: KIRBY,
    className: 'bs-kirby',
  },
]


/* =========================================================
   CLIENTS
========================================================= */

const clientLogos = [
  {
    name: 'JSSL',
    image: JSSL,
    className: 'bs-jssl',
  },
  {
    name: 'JSW',
    image: JSW,
    className: 'bs-jsw',
  },
  {
    name: 'Larsen & Toubro',
    image: LT,
    className: 'bs-lt',
  },
  {
    name: 'Nisarg Enviro',
    image: NISARG,
    className: 'bs-nisarg',
  },
]


/* =========================================================
   LONG SEQUENCES
   Repeating the logos prevents empty space.
========================================================= */

const partnerSequence = [
  ...partnerLogos,
  ...partnerLogos,
  ...partnerLogos,
]

const clientSequence = [
  ...clientLogos,
  ...clientLogos,
  ...clientLogos,
]


/* =========================================================
   LOGO ITEM
========================================================= */

function LogoItem({
  name,
  image,
  className,
}: {
  name: string
  image: string
  className: string
}) {
  return (
    <div
      className={`bs-logo-item ${className}`}
      aria-label={name}
      title={name}
    >
      <div className="bs-logo-inner">

        <img
          src={image}
          alt={name}
          draggable="false"
        />

      </div>
    </div>
  )
}


/* =========================================================
   PARTNER MARQUEE
   MOVES RIGHT
========================================================= */

function PartnerMarquee() {
  return (
    <div className="bs-marquee bs-partner-marquee">

      <div className="bs-marquee-track bs-partner-track">

        <div className="bs-marquee-group">

          {partnerSequence.map((logo, index) => (
            <LogoItem
              key={`partner-a-${logo.name}-${index}`}
              {...logo}
            />
          ))}

        </div>


        <div className="bs-marquee-group">

          {partnerSequence.map((logo, index) => (
            <LogoItem
              key={`partner-b-${logo.name}-${index}`}
              {...logo}
            />
          ))}

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   CLIENT MARQUEE
   MOVES LEFT
========================================================= */

function ClientMarquee() {
  return (
    <div className="bs-marquee bs-client-marquee">

      <div className="bs-marquee-track bs-client-track">

        <div className="bs-marquee-group">

          {clientSequence.map((logo, index) => (
            <LogoItem
              key={`client-a-${logo.name}-${index}`}
              {...logo}
            />
          ))}

        </div>


        <div className="bs-marquee-group">

          {clientSequence.map((logo, index) => (
            <LogoItem
              key={`client-b-${logo.name}-${index}`}
              {...logo}
            />
          ))}

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <div className="bs-heading">

      <span className="bs-heading-small">
        {eyebrow}
      </span>

      <h2>
        Our <strong>{title}</strong>
      </h2>

      <span className="bs-heading-accent" />

    </div>
  )
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Partners() {

  return (
    <section
      id="partners"
      className="bs-partners-section" 
    style={{
  background: '#ffffff',
  backgroundColor: '#ffffff'
}}
    >

      <div className="bs-partners-panel">


        {/* ===================================================
            COMPANY NAME
        ==================================================== */}

        <div className="bs-brand">

          <span className="bs-brand-line" />

          <div className="bs-brand-text">
            BHARAAT <span>STRUCTURALS</span>
          </div>

          <span className="bs-brand-line" />

        </div>


        {/* ===================================================
            DESCRIPTION
        ==================================================== */}

        <p className="bs-description">
          Our technology partners and clients are part of the
          project ecosystem behind every structure we deliver.
        </p>


        {/* ===================================================
            PARTNERS
        ==================================================== */}

        <SectionHeading
          eyebrow="TECHNOLOGY ECOSYSTEM"
          title="Partners"
        />

        <PartnerMarquee />


        {/* ===================================================
            CLIENTS
        ==================================================== */}

        <div className="bs-client-heading">

          <SectionHeading
            eyebrow="PROJECT RELATIONSHIPS"
            title="Clients"
          />

        </div>

        <ClientMarquee />


        {/* ===================================================
            BOTTOM MESSAGE
        ==================================================== */}

        <div className="bs-bottom-message">

          <span className="bs-bottom-line" />

          <p>
            BUILDING A STRONGER
          </p>

          <p>
            TOMORROW TOGETHER
          </p>

        </div>

      </div>

    </section>
  )
}