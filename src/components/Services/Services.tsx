import { useState } from 'react'
import Icon from '../common/Icon'
import './Services.css'

import connectionImage from '../../assets/services/connection.webp'
import manpowerImage from '../../assets/services/Man-Power-Supply-Services.webp'
import detailingImage from '../../assets/services/Steel-Detailing-Services.webp'

const services = [
  {
    no: '01',
    title: 'Steel Connection Design',
    tag: 'STRUCTURAL ENGINEERING',
    image: connectionImage,
    text: 'We design steel connections for industrial, commercial and infrastructure projects with a focus on safe, practical and cost-effective solutions.',
    points: [
      'Moment Connections',
      'Shear Connections',
      'Bracing Connections',
      'Truss Connections',
      'Erection Support',
    ],
  },
  {
    no: '02',
    title: 'Steel Detailing Services',
    tag: 'TEKLA · BIM · FABRICATION',
    image: detailingImage,
    text: 'Our steel detailing workflow covers 3D BIM modelling, shop drawings and erection drawings with detailed fabrication and site information.',
    points: [
      '3D BIM Modelling',
      'Shop Drawings',
      'Erection Drawings',
      'Bolting & Welding Details',
      'Shop Bolt Summary & BoM',
    ],
  },
  {
    no: '03',
    title: 'Man Power Supply',
    tag: 'ENGINEERING · DETAILING',
    image: manpowerImage,
    text: 'We train and develop young engineers and detailers while providing trained manpower to support design and detailing teams.',
    points: [
      'Engineer Training',
      'Detailer Training',
      'Skill Development',
      'Client Manpower Support',
      'Industry Preparation',
    ],
  },
]

export default function Services({
  onNavigate,
}: {
  onNavigate: (id: string) => void
}) {
  const [active, setActive] = useState(0)

  const service = services[active]

  return (
    <section id="services" className="services-section">

      <div className="services-bg-grid" />

      <div className="section-wrap">

        {/* HEADER */}
        <div className="services-heading">

          <div>
            <div className="eyebrow blue">
              OUR SERVICES
            </div>

            <h2 className="display-title">
              Built around
              <br />
              <span>steel.</span>
            </h2>
          </div>

          <div className="services-intro">

            <span className="services-code">
              BHARAAT STRUCTURALS / SERVICES
            </span>

            <p>
              Specialized steel connection design, detailing and
              engineering manpower services for industrial,
              commercial and infrastructure projects.
            </p>

          </div>

        </div>


        {/* SERVICES */}
        <div className="services-layout">

          {/* LEFT NAVIGATION */}
          <div className="services-sidebar">

            <div className="services-sidebar-head">
              <span>SELECT SERVICE</span>
              <span>0{services.length}</span>
            </div>

            <div className="services-list">

              {services.map((item, index) => (

                <button
                  key={item.no}
                  className={`service-row ${
                    active === index ? 'selected' : ''
                  }`}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                >

                  <span className="service-number">
                    {item.no}
                  </span>

                  <span className="service-row-copy">

                    <strong>
                      {item.title}
                    </strong>

                    <small>
                      {item.tag}
                    </small>

                  </span>

                  <span className="service-arrow">
                    <Icon
                      name="ArrowUpRight"
                      size={17}
                    />
                  </span>

                </button>

              ))}

            </div>


            {/* SERVICE TYPES */}
            <div className="service-industries">

              <span>PROJECT TYPES</span>

              <div>
                <b>Industrial</b>
                <b>Commercial</b>
                <b>Infrastructure</b>
                <b>Oil & Gas</b>
              </div>

            </div>

          </div>


          {/* RIGHT FEATURE */}
          <div className="service-feature">

            {/* IMAGE */}
            <img
              key={service.image}
              className="service-image"
              src={service.image}
              alt={service.title}
            />

            {/* DARK GRADIENT */}
            <div className="service-image-overlay" />


            {/* TOP TECHNICAL BAR */}
            <div className="feature-top">

              <span>
                BHARAAT STRUCTURALS
              </span>

              <span>
                SERVICE / {service.no}
              </span>

            </div>


            {/* BIG NUMBER */}
            <div className="feature-number">
              {service.no}
            </div>


            {/* IMAGE CORNERS */}
            <div className="feature-corner corner-tl" />
            <div className="feature-corner corner-br" />


            {/* CONTENT */}
            <div className="feature-content">

              <span className="feature-tag">
                {service.tag}
              </span>

              <h3>
                {service.title}
              </h3>

              <p>
                {service.text}
              </p>


              <div className="feature-points">

                {service.points.map((point, index) => (

                  <div
                    className="feature-point"
                    key={point}
                  >

                    <span>
                      0{index + 1}
                    </span>

                    <strong>
                      {point}
                    </strong>

                  </div>

                ))}

              </div>


              <button
                className="service-cta"
                onClick={() => onNavigate('contact')}
              >
                Discuss a project

                <Icon
                  name="ArrowUpRight"
                  size={14}
                />
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}