import Icon from '../common/Icon'
import { scrollToId } from '../../utils/scrollToId'
import './Footer.css'

export default function Footer() {
  const go = (id: string) => {
    scrollToId(id)
  }

  const googleMapsUrl =
    "https://www.google.com/maps/place/13%C2%B002'29.1%22N+77%C2%B036'49.3%22E/@13.041595,77.614392,1340m/data=!3m1!1e3!4m4!3m3!8m2!3d13.0414167!4d77.6136944!5m1!1e2?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDkxNS4wIKXMDSoASAFQAw%3D%3D"

  const linkedInUrl =
    'https://in.linkedin.com/company/bharaat-structurals'

  return (
    <footer className="footer">

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="footer-grid">

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="footer-brand">

          <button
            type="button"
            className="brand-footer-logo"
            onClick={() => go('home')}
            aria-label="Bharaat Structurals home"
          >
            <img
              src="/Logo.png"
              alt="Bharaat Structurals"
              className="footer-logo-image"
            />
          </button>


          <p className="footer-description">
            Precision steel detailing
            <br />
            &amp; BIM solutions.
          </p>


          {/* SOCIAL MEDIA */}

          <div className="footer-social-block">

            <span className="footer-social-label">
              Follow us
            </span>

            <div className="footer-socials">

              {/* LINKEDIN */}

              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bharaat Structurals LinkedIn"
                className="footer-social"
              >
                <Icon
                  name="Linkedin"
                  size={18}
                />
              </a>


              {/* FACEBOOK */}

              <a
                href="#contact"
                aria-label="Bharaat Structurals Facebook"
                className="footer-social"
              >
                <Icon
                  name="Facebook"
                  size={18}
                />
              </a>


              {/* INSTAGRAM */}

              <a
                href="#contact"
                aria-label="Bharaat Structurals Instagram"
                className="footer-social"
              >
                <Icon
                  name="Instagram"
                  size={18}
                />
              </a>


              {/* YOUTUBE */}

              <a
                href="#contact"
                aria-label="Bharaat Structurals YouTube"
                className="footer-social"
              >
                <Icon
                  name="Youtube"
                  size={18}
                />
              </a>

            </div>

          </div>

        </div>


        {/* =================================================
            COMPANY
        ================================================= */}

        <div className="footer-column">

          <div className="footer-heading">
            <span />
            <h4>Company</h4>
          </div>


          <button
            type="button"
            onClick={() => go('about')}
          >
            About
          </button>


          <button
            type="button"
            onClick={() => go('projects')}
          >
            Projects
          </button>


          <button
            type="button"
            onClick={() => go('careers')}
          >
            Careers
          </button>


          <button
            type="button"
            onClick={() => go('technology')}
          >
            Technology
          </button>

        </div>


        {/* =================================================
            HELP
        ================================================= */}

        <div className="footer-column footer-help">

          <div className="footer-heading">
            <span />
            <h4>Help</h4>
          </div>


          <button
            type="button"
            onClick={() => go('services')}
          >
            Services
          </button>


          <button
            type="button"
            onClick={() => go('contact')}
          >
            Contact us
          </button>


          <button
            type="button"
            onClick={() => go('contact')}
          >
            Sign up
          </button>


          <button
            type="button"
            onClick={() => go('contact')}
          >
            Login
          </button>

        </div>


        {/* =================================================
            CONTACT
        ================================================= */}

        <div className="footer-column footer-contact">

          <div className="footer-heading">
            <span />
            <h4>Contact</h4>
          </div>


          {/* EMAIL */}

          <a
            href="mailto:pasha.nadeem@bharaatstructurals.com"
            className="footer-contact-link"
          >

            <span className="footer-contact-icon">
              <Icon
                name="Mail"
                size={17}
              />
            </span>

            <span>
              pasha.nadeem@bharaatstructurals.com
            </span>

          </a>


          {/* PHONE */}

          <a
            href="tel:+918025349898"
            className="footer-contact-link"
          >

            <span className="footer-contact-icon">
              <Icon
                name="Phone"
                size={17}
              />
            </span>

            <span>
              +91 80 2534 9898
            </span>

          </a>


          {/* LOCATION */}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link footer-location-link"
            aria-label="Open Bharaat Structurals location in Google Maps"
          >

            <span className="footer-contact-icon">
              <Icon
                name="MapPin"
                size={17}
              />
            </span>

            <span className="footer-location-text">

              <span>
                Bengaluru, Karnataka, India
              </span>

              <small>
                82/B, Near SBI Bank, AC Post,
                <br />
                Veerannapalya, Nagavara,
                <br />
                Bengaluru, Karnataka – 560045
              </small>

            </span>

          </a>

        </div>


        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="footer-bottom">

          <span>
            © 2026 Bharaat Structurals. All rights reserved.
          </span>

          <span>
            Precision · Coordination · Delivery
          </span>

        </div>

      </div>

    </footer>
  )
}