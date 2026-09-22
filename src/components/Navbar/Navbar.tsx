import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import {
  Home,
  Info,
  Grid2X2,
  FolderKanban,
  BriefcaseBusiness,
  CircleDot,
  ArrowUpRight,
} from 'lucide-react'

import { navItems } from '../../data/siteData'

import './Navbar.css'


/* =========================================================
   MOBILE ICON MAPPING
========================================================= */

const mobileIcons: Record<string, LucideIcon> = {
  home: Home,
  about: Info,
  services: Grid2X2,
  projects: FolderKanban,
  careers: BriefcaseBusiness,
}


/* =========================================================
   NAVBAR PROPS
========================================================= */

interface NavbarProps {
  onNavigate: (id: string) => void
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
     CONTACT PAGE STATE
  ======================================================= */

  const isContactPage =
    location.pathname === '/contact'


  /* =======================================================
     HOME SECTION OBSERVER
  ======================================================= */

  useEffect(() => {

    /*
     * Don't observe Home sections while
     * on standalone Contact page.
     */

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


    /*
     * Only actual Home sections
     * become active.
     *
     * "contact-page" means standalone
     * Contact Us page.
     */

    if (
      id !== 'contact' &&
      id !== 'contact-page'
    ) {

      setActiveSection(id)

    }

  }


  /* =======================================================
     MOBILE ICON
  ======================================================= */

  const getMobileIcon = (
    id: string
  ): LucideIcon => {

    return (
      mobileIcons[id] ??
      CircleDot
    )

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


          {/* ===============================================
              LOGO
          =============================================== */}

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


          {/* ===============================================
              DESKTOP LINKS
          =============================================== */}

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


          {/* ===============================================
              STANDALONE CONTACT US BUTTON
              
              IMPORTANT:
              
              This uses "contact-page"
              instead of "contact".
          =============================================== */}

          <button
            className={`navbar-contact ${
              isContactPage
                ? 'navbar-contact--active'
                : ''
            }`}
            onClick={() =>
              go('contact-page')
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

      </header>


      {/* ===================================================
          MOBILE TOP LOGO
      =================================================== */}

      <div
        className={`mobile-topbar ${
          isHomeSection
            ? 'mobile-topbar--home'
            : 'mobile-topbar--inner'
        }`}
      >

        <button
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

      </div>


      {/* ===================================================
          MOBILE BOTTOM NAVIGATION
      =================================================== */}

      <nav
        className="mobile-bottom-nav"
        aria-label="Mobile navigation"
      >

        <div className="mobile-bottom-nav-inner">

          {navItems
            .slice(0, 5)
            .map((item) => {

              const active =
                activeSection ===
                  item.id &&
                !isContactPage


              const MobileIcon =
                getMobileIcon(
                  item.id
                )


              return (

                <button
                  key={item.id}
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

                    <MobileIcon
                      size={17}
                      strokeWidth={
                        active
                          ? 2
                          : 1.6
                      }
                    />

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