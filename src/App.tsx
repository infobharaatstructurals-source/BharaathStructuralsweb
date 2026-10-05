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

import Login from './components/Auth/Login/Login'
import Signup from './components/Auth/Signup/Signup'
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword'

import Dashboard from './components/Careers/Dashboard/Dashboard'
import Jobs from './components/Careers/Jobs/Jobs'
import Applications from './components/Careers/Applications/Applications'
import Profile from './components/Careers/Profile/Profile'

import JobDetails from './components/Careers/JobDetails/JobDetails'
import Apply from './components/Careers/Apply/Apply'
import SubmittedApplication from './components/Careers/Applications/SubmittedApplication'
import AddUser from './components/Careers/AddUser/AddUser'
import ProtectedRoute from './features/auth/ProtectedRoute'

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
   * Initialize reveal animations
   * whenever HomePage is mounted.
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
     AUTH PAGES
     
     Main website Navbar/Footer should not appear.
  ======================================================= */

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password'


  /* =======================================================
     CAREER PAGES
     
     Career pages have their own CareerSidebar.
     
     Therefore the main website Navbar/Footer should
     NOT appear on these pages.
  ======================================================= */

  const isCareerPage =
    location.pathname === '/dashboard' ||
    location.pathname === '/jobs' ||
    location.pathname === '/applications' ||
    location.pathname === '/profile' ||
    location.pathname === '/add-user' ||
    location.pathname.startsWith('/jobs/') ||
    location.pathname.startsWith('/applications/')


  /* =======================================================
     SHOW MAIN WEBSITE NAVBAR / FOOTER?
  ======================================================= */

  const showMainSiteLayout =
    !isAuthPage && !isCareerPage


  /* =======================================================
     RESET SCROLL WHEN OPENING STANDALONE CONTACT PAGE
  ======================================================= */

  useEffect(() => {

    if (
      location.pathname === '/contact'
    ) {

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
       STANDALONE CONTACT US PAGE
    ===================================================== */

    if (
      id === 'contact-page'
    ) {

      navigate('/contact')

      return
    }


    /* =====================================================
       NORMAL HOME SECTIONS
    ===================================================== */

    if (
      location.pathname !== '/'
    ) {

      sessionStorage.setItem(
        'scrollTarget',
        id
      )

      navigate('/')

      return
    }


    /* =====================================================
       ALREADY ON HOME
    ===================================================== */

    scrollToId(id)
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="site-shell">


      {/* ===================================================
          MAIN WEBSITE NAVBAR

          Hidden on:
          - Login
          - Signup
          - Forgot Password
          - Dashboard
          - Jobs
          - Applications
          - Profile
          - Add User
      =================================================== */}

      {showMainSiteLayout && (
        <Navbar
          onNavigate={go}
        />
      )}


      {/* ===================================================
          ROUTES
      =================================================== */}

      <Routes>


        {/* =================================================
            AUTH
        ================================================= */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        <Route
          path="/signup"
          element={
            <Signup />
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />


        {/* =================================================
            PROTECTED CAREER ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                'candidate',
                'hr',
                'admin',
              ]}
            />
          }
        >

          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />

          <Route
            path="/jobs"
            element={
              <Jobs />
            }
          />

          <Route
            path="/jobs/:jobId"
            element={
              <JobDetails />
            }
          />

          <Route
            path="/jobs/:jobId/apply"
            element={
              <Apply />
            }
          />

          <Route
            path="/applications"
            element={
              <Applications />
            }
          />

          <Route
            path="/applications/:applicationId"
            element={
              <SubmittedApplication />
            }
          />

          <Route
            path="/profile"
            element={
              <Profile />
            }
          />

        </Route>


        {/* =================================================
            HR + ADMIN ONLY
        ================================================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                'hr',
                'admin',
              ]}
            />
          }
        >

          <Route
            path="/add-user"
            element={
              <AddUser />
            }
          />

        </Route>


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
          MAIN WEBSITE FOOTER

          Hidden on Career pages and Auth pages.
      =================================================== */}

      {showMainSiteLayout && (
        <Footer />
      )}

    </div>
  )
}