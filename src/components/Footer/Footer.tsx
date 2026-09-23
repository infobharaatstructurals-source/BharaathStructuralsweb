import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { scrollToId } from '../../utils/scrollToId'
import './Footer.css'

export default function Footer() {
  const navigate = useNavigate()

  /*
   * =========================================================
   * HANDLE SECTION HASH AFTER HOME PAGE LOADS
   * =========================================================
   *
   * When coming from another page:
   *
   * /contact
   *    ↓
   * click About
   *    ↓
   * /#about
   *
   * The Home page needs time to render its sections.
   * After the page is mounted, this effect finds the hash
   * and scrolls to the correct section.
   */

  useEffect(() => {
    const isHomePage =
      window.location.pathname === '/' ||
      window.location.pathname === ''

    if (!isHomePage) {
      return
    }

    const hash = window.location.hash

    if (!hash) {
      return
    }

    const sectionId = hash.substring(1)

    if (!sectionId) {
      return
    }

    /*
     * Wait until the Home page sections are rendered.
     */
    const timer = window.setTimeout(() => {
      const section = document.getElementById(sectionId)

      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }, 150)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])


  /*
   * =========================================================
   * SECTION NAVIGATION
   * =========================================================
   */

  const go = (id: string) => {
    const isHomePage =
      window.location.pathname === '/' ||
      window.location.pathname === ''

    /*
     * Already on Home page
     */
    if (isHomePage) {
      scrollToId(id)

      /*
       * Keep URL hash updated.
       */
      window.history.replaceState(
        null,
        '',
        `/#${id}`
      )

      return
    }

    /*
     * Coming from another page.
     *
     * Go to Home with the required section hash.
     *
     * Example:
     *
     * /contact
     *     ↓
     * /#about
     */
    window.location.href = `/#${id}`
  }


  /* =========================================================
     GOOGLE MAPS
     ========================================================= */

  const googleMapsUrl =
    "https://www.google.com/maps/place/13%C2%B002'29.1%22N+77%C2%B036'49.3%22E/@13.041595,77.614392,1340m/data=!3m1!1e3!4m4!3m3!8m2!3d13.0414167!4d77.6136944!5m1!1e2?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDkxNS4wIKXMDSoASAFQAw%3D%3D"


  /* =========================================================
     SOCIAL LINKS
     ========================================================= */

  const linkedInUrl =
    'https://in.linkedin.com/company/bharaat-structurals'

  const FacebookUrl =
    'https://www.facebook.com/share/1D9c55xM1D/'

  const InstagramUrl =
    'https://www.instagram.com/bharaatstructurals?stkn=MWthbDV1M244anFjZA=='


  return (
    <footer className="footer">

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
              src="/Logo.webp"
              alt="Bharaat Structurals"
              className="footer-logo-image"
            />
          </button>


          <p className="footer-description">
            Precision steel detailing
            <br />
            &amp; BIM solutions.
          </p>


          {/* =================================================
              SOCIAL MEDIA
          ================================================= */}

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
                <img
                  width="48"
                  height="48"
                  src="https://img.icons8.com/ios-filled/50/linkedin.png"
                  alt="LinkedIn"
                />
              </a>


              {/* FACEBOOK */}

              <a
                href={FacebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bharaat Structurals Facebook"
                className="footer-social"
              >
                <img
                  width="48"
                  height="48"
                  src="https://img.icons8.com/ios-filled/50/facebook--v1.png"
                  alt="Facebook"
                />
              </a>


              {/* INSTAGRAM */}

              <a
                href={InstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bharaat Structurals Instagram"
                className="footer-social"
              >
                <img
                  width="48"
                  height="48"
                  src="https://img.icons8.com/ios-filled/50/instagram-new--v1.png"
                  alt="Instagram"
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


          {/* ABOUT */}

          <button
            type="button"
            onClick={() => go('about')}
          >
            About
          </button>


          {/* PROJECTS */}

          <button
            type="button"
            onClick={() => go('projects')}
          >
            Projects
          </button>


          {/* CAREERS */}

          <button
            type="button"
            onClick={() => go('careers')}
          >
            Careers
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


          {/* SERVICES */}

          <button
            type="button"
            onClick={() => go('services')}
          >
            Services
          </button>


          {/* CONTACT */}

          <button
            type="button"
            onClick={() => navigate('/contact')}
          >
            Contact us
          </button>


          {/* SIGN UP */}

          <button
            type="button"
            onClick={() => navigate('/contact')}
          >
            Sign up
          </button>


          {/* LOGIN */}

          <button
            type="button"
            onClick={() => navigate('/contact')}
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

              <img
                width="50"
                height="50"
                src="https://img.icons8.com/ios-filled/50/new-post.png"
                alt="Email"
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

              <img
                width="50"
                height="50"
                src="https://img.icons8.com/ios-filled/50/phone-disconnected.png"
                alt="Phone"
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

              <img
                width="50"
                height="50"
                src="https://img.icons8.com/ios-filled/50/marker.png"
                alt="Location"
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