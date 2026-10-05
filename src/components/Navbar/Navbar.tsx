import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'

import {
  ArrowUpRight,
} from 'lucide-react'

import { navItems } from '../../data/siteData'

import './Navbar.css'


/* =========================================================
   NAVBAR PROPS
========================================================= */

interface NavbarProps {
  onNavigate: (id: string) => void
}


/* =========================================================
   CUSTOM MOBILE ICONS
========================================================= */

/*
 * HOME ICON
 */

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="
          m2.25 12
          l8.955-8.955
          a1.124 1.124 0 0 1 1.59 0
          L21.75 12
          M4.5 9.75
          v10.125
          c0 .621.504 1.125 1.125 1.125
          H9.75
          v-4.875
          c0-.621.504-1.125 1.125-1.125
          h2.25
          c.621 0 1.125.504 1.125 1.125
          V21
          h4.125
          c.621 0 1.125-.504 1.125-1.125
          V9.75
          M8.25 21
          h8.25
        "
      />
    </svg>
  )
}


/*
 * ABOUT ICON
 *
 * Keeping the same icon style/path
 * you provided for About.
 */

function AboutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="
          M12.5 11.95
          q.725-.8 1.113-1.825
          T14 8
          t-.387-2.125
          T12.5 4.05
          q1.5.2 2.5 1.325
          T16 8
          t-1 2.625
          t-2.5 1.325

          M17.45 20
          q.275-.45.413-.962
          T18 18
          v-1
          q0-.9-.4-1.713
          t-1.05-1.437
          q1.275.45 2.363 1.163
          T20 17
          v1
          q0 .825-.587 1.413
          T18 20z

          M20 11
          h-1
          q-.425 0-.712-.288
          T18 10
          t.288-.712
          T19 9
          h1
          V8
          q0-.425.288-.712
          T21 7
          t.713.288
          T22 8
          v1
          h1
          q.425 0 .713.288
          T24 10
          t-.288.713
          T23 11
          h-1
          v1
          q0 .425-.288.713
          T21 13
          t-.712-.288
          T20 12z

          M8 12
          q-1.65 0-2.825-1.175
          T4 8
          t1.175-2.825
          T8 4
          t2.825 1.175
          T12 8
          t-1.175 2.825
          T8 12z

          m-8 6
          v-.8
          q0-.85.438-1.562
          T1.6 14.55
          q1.55-.775 3.15-1.162
          T8 13
          t3.25.388
          t3.15 1.162
          q.725.375 1.163 1.088
          T16 17.2
          v.8
          q0 .825-.587 1.413
          T14 20
          H2
          q-.825 0-1.412-.587
          T0 18z
        "
      />
    </svg>
  )
}


/*
 * EXPERTISE ICON
 *
 * Custom filled star icon supplied by the user.
 */

function ExpertiseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="m21.3 18.7l-3-3l1.4-1.4l3 3zm-3.6-12l-1.4-1.4l3-3l1.4 1.4zm-11.4 0l-3-3l1.4-1.4l3 3zm-3.6 12l-1.4-1.4l3-3l1.4 1.4zM5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"
      />
    </svg>
  )
}


/*
 * SERVICES ICON
 *
 * Simple grid icon matching the
 * same clean visual language.
 */

function ServicesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
      />
    </svg>
  )
}


/*
 * PARTNERS ICON
 *
 * Based directly on the SVG
 * path you provided.
 */

function PartnersIcon() {
  return (
    <svg
      viewBox="0 0 640 512"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="
          m272.2 64.6
          l-51.1 51.1
          c-15.3 4.2-29.5 11.9-41.5 22.5
          L153 161.9
          c-10.2 9.1-23.5 14.1-37.2 14.1
          H96v128
          c20.4.6 39.8 8.9 54.3 23.4
          l35.6 35.6
          l7 7
          l27 27
          c6.2 6.2 16.4 6.2 22.6 0
          c1.7-1.7 3-3.7 3.7-5.8
          c2.8-7.7 9.3-13.5 17.3-15.3
          s16.4.6 22.2 6.5
          l10.8 10.6
          c11.6 11.6 30.4 11.6 41.9 0
          c5.4-5.4 8.3-12.3 8.6-19.4
          c.4-8.8 5.6-16.6 13.6-20.4
          s17.3-3 24.4 2.1
          c9.4 6.7 22.5 5.8 30.9-2.6
          c9.4-9.4 9.4-24.6 0-33.9
          L340.1 243
          l-35.8 33
          c-27.3 25.2-69.2 25.6-97 .9
          c-31.7-28.2-32.4-77.4-1.6-106.5
          l70.1-66.2
          C303.2 78.4 339.4 64 377.1 64
          c36.1 0 71 13.3 97.9 37.2
          l30.1 26.8
          H624
          c8.8 0 16 7.2 16 16
          v208
          c0 17.7-14.3 32-32 32
          h-32
          c-11.8 0-22.2-6.4-27.7-16
          h-84.9
          c-3.4 6.7-7.9 13.1-13.5 18.7
          c-17.1 17.1-40.8 23.8-63 20.1
          c-3.6 7.3-8.5 14.1-14.6 20.2
          c-27.3 27.3-70 30-100.4 8.1
          c-25.1 20.8-62.5 19.5-86-4.1
          L159 404
          l-7-7
          l-35.6-35.6
          c-5.5-5.5-12.7-8.7-20.4-9.3
          c0 17.6-14.4 31.9-32 31.9
          H32
          c-17.7 0-32-14.3-32-32
          V144
          c0-8.8 7.2-16 16-16
          h99.8
          c2 0 3.9-.7 5.3-2
          l26.5-23.6
          C175.5 77.7 211.4 64 248.7 64
          H259
          c4.4 0 8.9.2 13.2.6

          M544 320
          V176
          h-48
          c-5.9 0-11.6-2.2-15.9-6.1
          l-36.9-32.8
          C425 120.9 401.5 112 377.1 112
          c-25.4 0-49.8 9.7-68.3 27.1
          l-70.1 66.2
          c-10.3 9.8-10.1 26.3.5 35.7
          c9.3 8.3 23.4 8.1 32.5-.3
          l71.9-66.4
          c9.7-9 24.9-8.4 33.9 1.4
          s8.4 24.9-1.4 33.9
          l-.8.8
          l74.4 74.4
          c10 10 16.5 22.3 19.4 35.1
          h74.8z

          M64 336
          a16 16 0 1 0-32 0
          a16 16 0 1 0 32 0

          m528 16
          a16 16 0 1 0 0-32
          a16 16 0 1 0 0 32
        "
      />
    </svg>
  )
}


/* =========================================================
   MOBILE ICON MAPPING
========================================================= */

const mobileIcons: Record<
  string,
  () => ReactElement
> = {
  home: HomeIcon,
  about: AboutIcon,
  expertise: ExpertiseIcon,
  services: ServicesIcon,
  partners: PartnersIcon,
}


/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar({
  onNavigate,
}: NavbarProps) {

  const location = useLocation()

  const [
    activeSection,
    setActiveSection,
  ] = useState('home')


  /* =======================================================
     CONTACT PAGE
  ======================================================= */

  const isContactPage =
    location.pathname === '/contact'


  /* =======================================================
     HOME SECTION OBSERVER
  ======================================================= */

  useEffect(() => {

    if (
      location.pathname !== '/'
    ) {
      return
    }


    const sections = navItems
      .map((item) =>
        document.getElementById(
          item.id
        )
      )
      .filter(Boolean) as HTMLElement[]


    if (
      !sections.length
    ) {
      return
    }


    const observer =
      new IntersectionObserver(
        (entries) => {

          const visibleSections =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              )


          if (
            visibleSections.length > 0
          ) {

            setActiveSection(
              visibleSections[0]
                .target
                .id
            )

          }

        },
        {
          rootMargin:
            '-20% 0px -65% 0px',

          threshold: [
            0.1,
            0.25,
            0.5,
          ],
        }
      )


    sections.forEach(
      (section) => {
        observer.observe(section)
      }
    )


    return () => {
      observer.disconnect()
    }

  }, [location.pathname])


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const go = (
    id: string
  ) => {

    onNavigate(id)


    if (
      id !== 'contact' &&
      id !== 'contact-page'
    ) {

      setActiveSection(id)

    }

  }


  /* =======================================================
     MOBILE CONTACT
  ======================================================= */

  const goToContact = () => {

    go('contact-page')

  }


  /* =======================================================
     NAVBAR STATE
  ======================================================= */

  const isHomeSection =
    activeSection === 'home' &&
    !isContactPage


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>


      {/* ===================================================
          DESKTOP NAVBAR
      =================================================== */}

      <header
        className={`navbar ${
          isHomeSection
            ? 'navbar--home'
            : 'navbar--inner'
        }`}
      >

        <div className="navbar-inner">


          {/* =================================================
              LOGO
          ================================================= */}

          <button
            className="navbar-brand"
            onClick={() =>
              go('home')
            }
            aria-label="Bharaat Structurals Home"
          >

            <img
              src="/Logo.webp"
              alt="Bharaat Structurals"
            />

          </button>


          {/* =================================================
              DESKTOP LINKS
          ================================================= */}

          <nav
            className="navbar-links"
            aria-label="Primary navigation"
          >

            {navItems.map(
              (item) => {

                const active =
                  activeSection ===
                    item.id &&
                  !isContactPage


                return (

                  <button
                    key={item.id}
                    type="button"
                    className={`navbar-link ${
                      active
                        ? 'navbar-link--active'
                        : ''
                    }`}
                    onClick={() =>
                      go(item.id)
                    }
                  >

                    {item.label}

                  </button>

                )

              }
            )}

          </nav>


          {/* =================================================
              DESKTOP CONTACT BUTTON
          ================================================= */}

          <div
            className="navbar-actions"
          >

            <button
              type="button"
              className={`navbar-contact ${
                isContactPage
                  ? 'navbar-contact--active'
                  : ''
              }`}
              onClick={
                goToContact
              }
            >

              <span>
                Contact Us
              </span>


              <span
                className="navbar-contact-icon"
              >

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.7}
                />

              </span>

            </button>

          </div>

        </div>

      </header>


      {/* ===================================================
          MOBILE TOP BAR

          LOGO LEFT
          CONTACT US RIGHT
      =================================================== */}

      <div
        className={`mobile-topbar ${
          isHomeSection
            ? 'mobile-topbar--home'
            : 'mobile-topbar--inner'
        }`}
      >

        {/* LOGO */}

        <button
          type="button"
          className="mobile-logo-button"
          onClick={() =>
            go('home')
          }
          aria-label="Bharaat Structurals Home"
        >

          <img
            src="/Logo.webp"
            alt="Bharaat Structurals"
          />

        </button>


        {/* CONTACT US */}

        <button
          type="button"
          className={`mobile-contact-button ${
            isContactPage
              ? 'mobile-contact-button--active'
              : ''
          }`}
          onClick={
            goToContact
          }
        >

          <span>
            Contact Us
          </span>


          <span
            className="mobile-contact-icon"
          >

            <ArrowUpRight
              size={12}
              strokeWidth={1.8}
            />

          </span>

        </button>

      </div>


      {/* ===================================================
          MOBILE BOTTOM NAVIGATION
      =================================================== */}

      <nav
        className="mobile-bottom-nav"
        aria-label="Mobile navigation"
      >

        <div
          className="mobile-bottom-nav-inner"
        >

          {navItems
            .slice(0, 5)
            .map((item) => {

              const active =
                activeSection ===
                  item.id &&
                !isContactPage


              const Icon =
                mobileIcons[item.id]


              return (

                <button
                  key={item.id}
                  type="button"
                  className={`mobile-bottom-item ${
                    active
                      ? 'mobile-bottom-item--active'
                      : ''
                  }`}
                  onClick={() =>
                    go(item.id)
                  }
                  aria-label={
                    item.label
                  }
                >

                  <span
                    className="mobile-bottom-icon"
                  >

                    {Icon ? (
                      <Icon />
                    ) : (
                      <CircleFallbackIcon />
                    )}

                  </span>


                  <span
                    className="mobile-bottom-label"
                  >

                    {item.label}

                  </span>

                </button>

              )

            })}

        </div>

      </nav>

    </>
  )
}


/* =========================================================
   FALLBACK ICON
========================================================= */

function CircleFallbackIcon() {

  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >

      <circle
        cx="12"
        cy="12"
        r="8"
      />

    </svg>
  )
}