import { useEffect } from 'react'
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Metrics from './components/Metrics/Metrics'
import Capabilities from './components/Capabilities/Capabilities'
import Services from './components/Services/Services'
import Partners from './components/Partners/Partners'
import Contact from './components/Contact/Contact'
import ContactUs from './components/ContactUs/ContactUs'
import Clients from './components/Clients/Clients'
import Footer from './components/Footer/Footer'

import { useReveal } from './hooks/useReveal'
import { useCounters } from './hooks/useCounters'
import { metrics } from './data/siteData'
import { scrollToId } from './utils/scrollToId'

import './styles/global.css'


/* =========================================================
   HOME PAGE
========================================================= */

function HomePage({
  onNavigate,
}: {
  onNavigate: (id: string) => void
}) {

  /*
   * IMPORTANT:
   *
   * useReveal is inside HomePage.
   *
   * This makes sure the reveal animations are
   * initialized again when returning from /contact.
   */
  useReveal()


  /* =======================================================
     METRICS
  ======================================================= */

  const metricValues = useCounters(
    metrics.map((item) => item.value)
  )


  /* =======================================================
     LOCATION
  ======================================================= */

  const location = useLocation()


  /* =======================================================
     HANDLE HOME PAGE SCROLL
  ======================================================= */

  useEffect(() => {

    const pendingId =
      sessionStorage.getItem('scrollTarget')


    /* -----------------------------------------------------
       RETURNING FROM ANOTHER PAGE
    ----------------------------------------------------- */

    if (pendingId) {

      sessionStorage.removeItem(
        'scrollTarget'
      )


      let attempts = 0

      const maxAttempts = 120


      const tryScroll = () => {

        const element =
          document.getElementById(
            pendingId
          )


        if (element) {

          /*
           * Wait for the Home DOM and reveal
           * elements to initialize.
           */

          requestAnimationFrame(() => {

            requestAnimationFrame(() => {

              element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })

            })

          })

          return
        }


        if (attempts < maxAttempts) {

          attempts++

          requestAnimationFrame(
            tryScroll
          )

        }

      }


      requestAnimationFrame(
        tryScroll
      )


      return
    }


    /* -----------------------------------------------------
       NORMAL HOME PAGE
    ----------------------------------------------------- */

    if (location.pathname === '/') {

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      })

    }

  }, [location.pathname])


  /* =======================================================
     HOME CONTENT
  ======================================================= */

  return (
    <main>

      <Hero
        onNavigate={onNavigate}
      />


      <About
        onNavigate={onNavigate}
      />


      <Metrics
        values={metricValues}
      />


      <Capabilities />


      <Services
        onNavigate={onNavigate}
      />


      <Partners />


      <Contact />

    </main>
  )
}


/* =========================================================
   APP
========================================================= */

export default function App() {

  const navigate = useNavigate()

  const location = useLocation()


  /* =======================================================
     RESET SCROLL WHEN OPENING STANDALONE CONTACT PAGE
  ======================================================= */

  useEffect(() => {

    if (
      location.pathname === '/contact'
    ) {

      /*
       * Always start the standalone
       * Contact Us page from the top.
       */

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      })

    }

  }, [location.pathname])


  /* =======================================================
     SHARED NAVIGATION
  ======================================================= */

  const go = (id: string) => {


    /* =====================================================
       STANDALONE CONTACT US BUTTON
       
       Only the black Contact Us button uses
       "contact-page".
    ===================================================== */

    if (
      id === 'contact-page'
    ) {

      navigate('/contact')

      return
    }


    /* =====================================================
       NORMAL HOME SECTIONS
       
       Examples:
       
       home
       about
       expertise
       services
       projects
       contact
    ===================================================== */

    if (
      location.pathname !== '/'
    ) {

      /*
       * Remember which Home section
       * the user wants.
       */

      sessionStorage.setItem(
        'scrollTarget',
        id
      )


      /*
       * Return to Home.
       */

      navigate('/')

      return
    }


    /* =====================================================
       ALREADY ON HOME
       
       Scroll directly to the section.
    ===================================================== */

    scrollToId(id)
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="site-shell">


      {/* ===================================================
          NAVBAR
      =================================================== */}

      <Navbar
        onNavigate={go}
      />


      {/* ===================================================
          ROUTES
      =================================================== */}

      <Routes>


        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={
            <HomePage
              onNavigate={go}
            />
          }
        />


        {/* =================================================
            STANDALONE CONTACT US PAGE
        ================================================= */}

        <Route
          path="/contact"
          element={
            <ContactUs />
          }
        />


        {/* =================================================
            CERTIFICATIONS / CLIENTS
        ================================================= */}

        <Route
          path="/certifications"
          element={
            <Clients />
          }
        />


      </Routes>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <Footer />

    </div>
  )
}