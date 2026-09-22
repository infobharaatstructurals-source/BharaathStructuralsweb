import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Clock3,
  MessageCircle,
  ExternalLink,
  X,
  Navigation,
} from 'lucide-react'

import './Contact.css'

export default function Contact() {
  const [showMap, setShowMap] = useState(false)
  const [isOfficeOpen, setIsOfficeOpen] = useState(false)

  /*
    Exact location supplied:
    13°02'29.1"N 77°36'49.3"E

    Decimal:
    Latitude  = 13.0414167
    Longitude = 77.6136944
  */

  const latitude = 13.0414167
  const longitude = 77.6136944

  const googleMapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`

  const googleEmbedUrl =
    `https://www.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`


  /*
    =========================================================
    OFFICE HOURS

    Monday - Friday
    09:00 AM - 06:00 PM
    India Standard Time

    Saturday + Sunday = CLOSED
    =========================================================
  */
  
  const checkOfficeStatus = () => {
    const now = new Date()

    /*
      Convert current time to India Standard Time.
      This makes the status work correctly even if
      the visitor is outside India.
    */

    const indiaTime = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now)

    const weekday =
      indiaTime.find((part) => part.type === 'weekday')?.value || ''

    const hour =
      Number(
        indiaTime.find((part) => part.type === 'hour')?.value || 0
      )

    const minute =
      Number(
        indiaTime.find((part) => part.type === 'minute')?.value || 0
      )

    /*
      Convert current time into minutes.
    */

    const currentMinutes =
      hour * 60 + minute

    const openingMinutes =
      9 * 60

    const closingMinutes =
      18 * 60

    /*
      Monday - Friday only.
    */

    const workingDay =
      weekday !== 'Sat' &&
      weekday !== 'Sun'

    /*
      09:00 AM inclusive
      06:00 PM exclusive
    */

    const workingHours =
      currentMinutes >= openingMinutes &&
      currentMinutes < closingMinutes

    setIsOfficeOpen(
      workingDay && workingHours
    )
  }


  /*
    Check immediately when component loads,
    then keep checking every 30 seconds.

    This means:
    05:59 PM -> AVAILABLE
    06:00 PM -> OFFICE IS CLOSED NOW

    No page refresh required.
  */

  useEffect(() => {
    checkOfficeStatus()

    const statusTimer = window.setInterval(
      checkOfficeStatus,
      30000
    )

    return () => {
      window.clearInterval(statusTimer)
    }
  }, [])


  const toggleMap = () => {
    setShowMap((current) => !current)
  }


  /*
    Proper mailto URL.

    The browser/OS will open the user's
    configured email application.
  */

  const emailAddress =
    'pasha.nadeem@bharaatstructurals.com'

  const emailSubject =
    encodeURIComponent(
      'Project Enquiry - Bharaat Structurals'
    )

  const emailBody =
    encodeURIComponent(
      `Hello Pasha,

I would like to discuss a project with Bharaat Structurals.

Regards,`
    )

  const mailtoUrl =
    `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`


  return (
    <section
      id="contact"
      className="contact-section"
    >

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="contact-bg-grid" />

      <div className="contact-glow contact-glow-left" />
      <div className="contact-glow contact-glow-right" />
      <div className="contact-glow contact-glow-center" />


      {/* =====================================================
          MAIN WRAPPER
      ====================================================== */}

      <div className="contact-wrap">


        {/* ===================================================
            MAIN CONTENT
        ==================================================== */}

        <div className="contact-content">


          {/* =================================================
              LEFT
          ================================================== */}

          <div className="contact-left">

            <div className="contact-eyebrow">

              <span className="contact-eyebrow-dot" />

              START A CONVERSATION

            </div>


            <h2 className="contact-title">

              Have a project

              <br />

              <span>
                in mind?
              </span>

            </h2>


            <p className="contact-description">

              Tell us what you are building, where you are in the
              project and what you need detailed. Our team will
              help you take the next step with confidence.

            </p>


            {/* =================================================
                CONTACT ACTIONS
            ================================================== */}

            <div className="contact-actions">


              {/* =================================================
                  EMAIL
              ================================================== */}

              <a
                href={mailtoUrl}
                className="contact-action"
                aria-label={`Email ${emailAddress}`}
              >

                <div className="contact-action-icon">

                  <Mail
                    size={18}
                    strokeWidth={1.8}
                  />

                </div>


                <div className="contact-action-content">

                  <span>
                    EMAIL
                  </span>

                  <strong>
                    {emailAddress}
                  </strong>

                </div>


                <div className="contact-action-arrow">

                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.8}
                  />

                </div>

              </a>


              {/* =================================================
                  PHONE
              ================================================== */}

              <a
                href="tel:+918025349898"
                className="contact-action"
                aria-label="Call Bharaat Structurals office"
              >

                <div className="contact-action-icon">

                  <Phone
                    size={18}
                    strokeWidth={1.8}
                  />

                </div>


                <div className="contact-action-content">

                  <span>
                    CALL OUR OFFICE
                  </span>

                  <strong>
                    +91 80 2534 9898
                  </strong>

                </div>


                <div className="contact-action-arrow">

                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.8}
                  />

                </div>

              </a>
                
              {/* =================================================
                  Contact Us Form
              ================================================== */}
                <a
                href="/contact"
                className="contact-action"
                aria-label="Open Contact Us form"
              >
                <div className="contact-action-icon">
                  <Phone
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="contact-action-content">
                  <span>CONTACT OUR TEAM</span>

                  <strong
                  style={{
                    whiteSpace: 'nowrap',
                    wordSpacing: '4px',
                  }}
                >
                  FILL OUT THE FORM
                </strong>
                </div>

                <div className="contact-action-arrow">
                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>
              </a>
                              
            </div>

          </div>


          {/* =================================================
              RIGHT CARD
          ================================================== */}

          <div className="contact-card-wrap">


            {/* =================================================
                NORMAL CONTACT CARD
            ================================================== */}

            {!showMap && (

              <div className="contact-card">


                {/* =================================================
                    CARD TOP
                ================================================== */}

                <div className="contact-card-top">

                  <div className="contact-card-brand">

                    <span>
                      BHARAAT
                    </span>

                    <strong>
                      STRUCTURALS
                    </strong>

                  </div>


                  {/* =================================================
                      LIVE OFFICE STATUS
                  ================================================== */}

                  <div
                    className={`contact-card-status ${
                      isOfficeOpen
                        ? 'is-open'
                        : 'is-closed'
                    }`}
                  >

                    <span
                      style={{
                        backgroundColor: isOfficeOpen
                          ? '#2498ff'
                          : '#7c8a94',

                        boxShadow: isOfficeOpen
                          ? '0 0 10px rgba(36, 152, 255, 0.8)'
                          : 'none',
                      }}
                    />

                    {isOfficeOpen
                      ? 'AVAILABLE'
                      : 'OFFICE IS CLOSED NOW'}

                  </div>

                </div>


                {/* =================================================
                    DIVIDER
                ================================================== */}

                <div className="contact-card-divider" />


                {/* =================================================
                    LOCATION
                    CLICKABLE
                ================================================== */}

                <button
                  type="button"
                  className="contact-info contact-location-button"
                  onClick={toggleMap}
                  aria-label="Show Bharaat Structurals location on map"
                >

                  <div className="contact-info-icon">

                    <MapPin
                      size={17}
                      strokeWidth={1.7}
                    />

                  </div>


                  <div className="contact-info-text">

                    <span>
                      OFFICE
                    </span>

                    <strong>
                      Bengaluru, Karnataka
                    </strong>

                    <small>
                      13°02'29.1"N 77°36'49.3"E
                    </small>

                  </div>


                  <div className="location-open-icon">

                    <Navigation
                      size={14}
                      strokeWidth={1.8}
                    />

                  </div>

                </button>


                {/* =================================================
                    PHONE
                ================================================== */}

                <a
                  href="tel:+918025349898"
                  className="contact-info contact-info-link"
                  aria-label="Call office"
                >

                  <div className="contact-info-icon">

                    <Phone
                      size={17}
                      strokeWidth={1.7}
                    />

                  </div>


                  <div className="contact-info-text">

                    <span>
                      PHONE
                    </span>

                    <strong>
                      +91 80 2534 9898
                    </strong>

                    <small>
                      Office line
                    </small>

                  </div>

                </a>


                {/* =================================================
                    EMAIL
                ================================================== */}

                <a
                  href={mailtoUrl}
                  className="contact-info contact-info-link"
                  aria-label={`Email ${emailAddress}`}
                >

                  <div className="contact-info-icon">

                    <Mail
                      size={17}
                      strokeWidth={1.7}
                    />

                  </div>


                  <div className="contact-info-text">

                    <span>
                      EMAIL
                    </span>

                    <strong>
                      {emailAddress}
                    </strong>

                    <small>
                      Project enquiries
                    </small>

                  </div>

                </a>


                {/* =================================================
                    WORKING HOURS
                ================================================== */}

                <div className="contact-info">

                  <div className="contact-info-icon">

                    <Clock3
                      size={17}
                      strokeWidth={1.7}
                    />

                  </div>


                  <div className="contact-info-text">

                    <span>
                      WORKING HOURS
                    </span>

                    <strong>
                      Monday – Friday
                    </strong>

                    <small>
                      09:00 AM – 06:00 PM
                    </small>

                  </div>

                </div>


                {/* =================================================
                    CARD BOTTOM
                ================================================== */}

                <div className="contact-card-bottom">


                  <div className="contact-card-message">

                    <div className="contact-message-icon">

                      <MessageCircle
                        size={15}
                        strokeWidth={1.8}
                      />

                    </div>

                    <span>
                      Let's build something precise.
                    </span>

                  </div>


                  {/* =================================================
                      FIND US ON MAPS
                  ================================================== */}

                  <button
                    type="button"
                    className="contact-map-button"
                    onClick={toggleMap}
                  >

                    <MapPin
                      size={14}
                      strokeWidth={1.8}
                    />

                    <span>
                      Find us on Maps
                    </span>

                  </button>

                </div>

              </div>

            )}


            {/* =================================================
                MAP CARD
            ================================================== */}

            {showMap && (

              <div className="contact-map-card">


                {/* =================================================
                    MAP HEADER
                ================================================== */}

                <div className="contact-map-header">

                  <div>

                    <span>
                      BHARAAT STRUCTURALS
                    </span>

                    <strong>
                      Our location
                    </strong>

                  </div>


                  <button
                    type="button"
                    className="map-close-icon"
                    onClick={toggleMap}
                    aria-label="Close map"
                  >

                    <X
                      size={17}
                      strokeWidth={1.8}
                    />

                  </button>

                </div>


                {/* =================================================
                    MAP
                ================================================== */}

                <div className="contact-map-container">

                  <iframe
                    title="Bharaat Structurals location"
                    src={googleEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />


                  {/* =================================================
                      MAP UI OVERLAY
                  ================================================== */}

                  <div className="map-grid-overlay" />


                  {/* =================================================
                      LOCATION MARKER
                  ================================================== */}

                  <div className="map-location-marker">

                    <div className="map-marker-pulse" />


                    <div className="map-marker-pin">

                      <MapPin
                        size={17}
                        strokeWidth={2}
                      />

                    </div>


                    <div className="map-marker-label">

                      <strong>
                        BHARAAT STRUCTURALS
                      </strong>

                      <span>
                        Bengaluru, Karnataka
                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      MAP COORDINATES
                  ================================================== */}

                  <div className="map-coordinates">

                    <Navigation
                      size={11}
                      strokeWidth={1.8}
                    />

                    13.0414167, 77.6136944

                  </div>


                  {/* =================================================
                      MAP SCALE
                  ================================================== */}

                  <div className="map-scale">

                    <span />

                    <small>
                      500 m
                    </small>

                  </div>

                </div>


                {/* =================================================
                    MAP FOOTER
                ================================================== */}

                <div className="contact-map-footer">


                  <div className="contact-map-address">

                    <div className="contact-map-address-icon">

                      <MapPin
                        size={15}
                        strokeWidth={1.8}
                      />

                    </div>


                    <div>

                      <span>
                        OFFICE LOCATION
                      </span>

                      <strong>
                        Bengaluru, Karnataka
                      </strong>

                      <small>
                        13°02'29.1"N 77°36'49.3"E
                      </small>

                    </div>

                  </div>


                  {/* =================================================
                      MAP ACTIONS
                  ================================================== */}

                  <div className="contact-map-actions">


                    <button
                      type="button"
                      className="contact-map-close"
                      onClick={toggleMap}
                    >

                      <X
                        size={14}
                        strokeWidth={1.8}
                      />

                      Close map

                    </button>


                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-map-external"
                    >

                      <ExternalLink
                        size={14}
                        strokeWidth={1.8}
                      />

                      Open

                    </a>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>


      </div>

    </section>
  )
}