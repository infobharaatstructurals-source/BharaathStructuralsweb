import './Clients.css'

export default function Clients() {
  const certificatePath =
    '/src/assets/about/Bharaath Structurals_page-0001.jpg'

  return (
    <section
      id="clients"
      className="certificate-section"
    >
      <div className="certificate-container">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="certificate-header">

          <div className="certificate-eyebrow">
            BHARAAT STRUCTURALS
          </div>

          <h1>
            Our Certification
          </h1>

          <p>
            Quality and precision are at the core of everything
            we deliver.
          </p>

        </div>


        {/* =====================================================
            CERTIFICATE
        ===================================================== */}

        <div className="certificate-viewer">

          <div className="certificate-image-wrap">

            <img
              src={certificatePath}
              alt="Bharaat Structurals ISO 9001:2015 Certificate"
              className="certificate-image"
            />

          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="certificate-actions">

            <a
              href={certificatePath}
              download="Bharaat-Structurals-ISO-9001-Certificate.jpg"
              className="certificate-download"
            >
              <span>
                Download Certificate
              </span>

              <span className="certificate-download-icon">
                ↓
              </span>
            </a>


            <a
              href={certificatePath}
              target="_blank"
              rel="noopener noreferrer"
              className="certificate-open"
            >
              View Full Certificate
            </a>

          </div>

        </div>

      </div>
    </section>
  )
}