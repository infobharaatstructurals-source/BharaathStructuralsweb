import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  MapPin,
  Menu,
  UserRound,
} from 'lucide-react'

import CareerSidebar from '../CareerSidebar/CareerSidebar'

import './Dashboard.css'


/* =========================================================
   API
========================================================= */

const API_URL =
  'http://localhost:5000/api'


/* =========================================================
   TYPES
========================================================= */

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  emailVerified: boolean
}


interface Application {
  id: string
  jobTitle: string
  location: string
  employmentType: string
  status: string
  appliedAt: string
}


/* =========================================================
   MOCK DATA
========================================================= */

const MOCK_AVAILABLE_JOBS = 6


const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'APP-001',
    jobTitle: 'Software Engineer',
    location: 'Bengaluru',
    employmentType: 'Full Time',
    status: 'Under Review',
    appliedAt: '30 Sep 2026',
  },
  {
    id: 'APP-002',
    jobTitle: 'Structural Engineer',
    location: 'Bengaluru',
    employmentType: 'Full Time',
    status: 'Shortlisted',
    appliedAt: '26 Sep 2026',
  },
  {
    id: 'APP-003',
    jobTitle: 'Tekla Detailer',
    location: 'Bengaluru',
    employmentType: 'Full Time',
    status: 'Applied',
    appliedAt: '20 Sep 2026',
  },
]


/* =========================================================
   DASHBOARD
========================================================= */

export default function Dashboard() {

  const navigate = useNavigate()


  /* =======================================================
     STATE
  ======================================================= */

  const [user, setUser] =
    useState<User | null>(null)

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  const [loading, setLoading] =
    useState(true)


  /* =======================================================
     LOAD USER
  ======================================================= */

  useEffect(() => {

    const loadUser = async () => {

      try {

        const response =
          await fetch(
            `${API_URL}/auth/me`,
            {
              method: 'GET',
              credentials: 'include',
            }
          )


        if (!response.ok) {

          navigate('/login')

          return
        }


        const data =
          await response.json()


        if (
          !data.success ||
          !data.user
        ) {

          navigate('/login')

          return
        }


        setUser(data.user)

      } catch (error) {

        console.error(
          'Dashboard user loading error:',
          error
        )

        navigate('/login')

      } finally {

        setLoading(false)

      }

    }


    loadUser()

  }, [navigate])


  /* =======================================================
     CLOSE MOBILE SIDEBAR
  ======================================================= */

  const closeMobileMenu = () => {

    setMobileMenuOpen(false)

  }


  /* =======================================================
     STATUS CLASS
  ======================================================= */

  const getStatusClass = (
    status: string
  ) => {

    switch (
      status.toLowerCase()
    ) {

      case 'shortlisted':
        return (
          'bs-dashboard-status-shortlisted'
        )

      case 'selected':
        return (
          'bs-dashboard-status-selected'
        )

      case 'rejected':
        return (
          'bs-dashboard-status-rejected'
        )

      case 'applied':
        return (
          'bs-dashboard-status-applied'
        )

      default:
        return (
          'bs-dashboard-status-review'
        )

    }

  }


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <main
        className="
          bs-dashboard-loading
        "
      >

        <div
          className="
            bs-dashboard-loader
          "
        />

        <p>
          Loading your dashboard...
        </p>

      </main>

    )

  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <main
      className="
        bs-dashboard-page
      "
    >


      {/* ===================================================
          CAREER SIDEBAR
      =================================================== */}

      <CareerSidebar
        mobileOpen={
          mobileMenuOpen
        }
        onMobileClose={
          closeMobileMenu
        }
      />


      {/* ===================================================
          MOBILE TOP BAR
      =================================================== */}

      <header
        className="
          bs-dashboard-mobile-header
        "
      >

        <button
          type="button"
          className="
            bs-dashboard-mobile-menu
          "
          onClick={() =>
            setMobileMenuOpen(true)
          }
          aria-label="Open navigation"
        >

          <Menu
            size={21}
            strokeWidth={1.8}
          />

        </button>


        <div
          className="
            bs-dashboard-mobile-brand
          "
        >

          <img
            src="/Logo.webp"
            alt="Bharaat Structurals"
          />

        </div>


        <button
          type="button"
          className="
            bs-dashboard-mobile-profile
          "
          onClick={() =>
            navigate('/profile')
          }
          aria-label="Open profile"
        >

          <span>

            {user?.firstName
              ?.charAt(0)
              .toUpperCase() || 'A'}

          </span>

        </button>

      </header>


      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <section
        className="
          bs-dashboard-content
        "
      >

        <div
          className="
            bs-dashboard-body
          "
        >


          {/* ===============================================
              WELCOME HERO
          =============================================== */}

          <section
            className="
              bs-dashboard-welcome
            "
          >

            <div
              className="
                bs-dashboard-welcome-content
              "
            >

              <span
                className="
                  bs-dashboard-eyebrow
                "
              >
                BHARAAT STRUCTURALS
              </span>


              <h2>

                Welcome back,{' '}

                <strong>
                  {user?.firstName ||
                    'Candidate'}
                </strong>

              </h2>


              <p>
                Find the right opportunity
                and manage your job
                applications from one place.
              </p>

            </div>


            {/* =============================================
                HERO DECORATION
            ============================================= */}

            <div
              className="
                bs-dashboard-welcome-decoration
              "
            >

              <div
                className="
                  bs-dashboard-circle
                  circle-one
                "
              />

              <div
                className="
                  bs-dashboard-circle
                  circle-two
                "
              />

              <BriefcaseBusiness
                size={46}
                strokeWidth={1.4}
              />

            </div>


          </section>


          {/* ===============================================
              STATISTICS
          =============================================== */}

          <section
            className="
              bs-dashboard-stats
            "
          >


            {/* Available Jobs */}

            <button
              type="button"
              className="
                bs-dashboard-stat-card
              "
              onClick={() =>
                navigate('/jobs')
              }
            >

              <div
                className="
                  bs-dashboard-stat-icon
                "
              >

                <BriefcaseBusiness
                  size={22}
                  strokeWidth={1.8}
                />

              </div>


              <div
                className="
                  bs-dashboard-stat-content
                "
              >

                <span>
                  Available Jobs
                </span>

                <strong>
                  {MOCK_AVAILABLE_JOBS}
                </strong>

              </div>

            </button>


            {/* My Applications */}

            <button
              type="button"
              className="
                bs-dashboard-stat-card
              "
              onClick={() =>
                navigate('/applications')
              }
            >

              <div
                className="
                  bs-dashboard-stat-icon
                "
              >

                <ClipboardList
                  size={22}
                  strokeWidth={1.8}
                />

              </div>


              <div
                className="
                  bs-dashboard-stat-content
                "
              >

                <span>
                  My Applications
                </span>

                <strong>
                  {MOCK_APPLICATIONS.length}
                </strong>

              </div>

            </button>


          </section>


          {/* ===============================================
              QUICK ACTIONS
          =============================================== */}

          <section
            className="
              bs-dashboard-section
            "
          >

            <div
              className="
                bs-dashboard-section-heading
              "
            >

              <div>

                <span>
                  QUICK ACTIONS
                </span>

                <h3>
                  Explore Opportunities
                </h3>

              </div>

            </div>


            <div
              className="
                bs-dashboard-actions
              "
            >


              {/* Browse Jobs */}

              <button
                type="button"
                className="
                  bs-dashboard-action-card
                "
                onClick={() =>
                  navigate('/jobs')
                }
              >

                <div
                  className="
                    bs-dashboard-action-icon
                  "
                >

                  <BriefcaseBusiness
                    size={22}
                    strokeWidth={1.8}
                  />

                </div>


                <div
                  className="
                    bs-dashboard-action-content
                  "
                >

                  <strong>
                    Browse Jobs
                  </strong>

                  <span>
                    Explore available positions
                  </span>

                </div>


                <ArrowRight
                  size={18}
                  strokeWidth={1.8}
                  className="
                    bs-dashboard-action-arrow
                  "
                />

              </button>


              {/* My Applications */}

              <button
                type="button"
                className="
                  bs-dashboard-action-card
                "
                onClick={() =>
                  navigate('/applications')
                }
              >

                <div
                  className="
                    bs-dashboard-action-icon
                  "
                >

                  <FileText
                    size={22}
                    strokeWidth={1.8}
                  />

                </div>


                <div
                  className="
                    bs-dashboard-action-content
                  "
                >

                  <strong>
                    My Applications
                  </strong>

                  <span>
                    Track your applications
                  </span>

                </div>


                <ArrowRight
                  size={18}
                  strokeWidth={1.8}
                  className="
                    bs-dashboard-action-arrow
                  "
                />

              </button>

            </div>

          </section>


          {/* ===============================================
              RECENT APPLICATIONS
          =============================================== */}

          <section
            className="
              bs-dashboard-section
            "
          >

            <div
              className="
                bs-dashboard-section-heading
              "
            >

              <div>

                <span>
                  APPLICATIONS
                </span>

                <h3>
                  Recent Applications
                </h3>

              </div>


              <button
                type="button"
                className="
                  bs-dashboard-view-all
                "
                onClick={() =>
                  navigate('/applications')
                }
              >

                View All

                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                />

              </button>

            </div>


            <div
              className="
                bs-dashboard-applications
              "
            >

              {MOCK_APPLICATIONS.map(
                (application) => (

                  <button
                    type="button"
                    key={application.id}
                    className="
                      bs-dashboard-application
                    "
                    onClick={() =>
                      navigate(
                        `/applications/${application.id}`
                      )
                    }
                  >

                    {/* =================================
                        LEFT
                    ================================== */}

                    <div
                      className="
                        bs-dashboard-application-left
                      "
                    >

                      <div
                        className="
                          bs-dashboard-application-icon
                        "
                      >

                        <BriefcaseBusiness
                          size={20}
                          strokeWidth={1.7}
                        />

                      </div>


                      <div
                        className="
                          bs-dashboard-application-info
                        "
                      >

                        <h4>
                          {application.jobTitle}
                        </h4>


                        <div
                          className="
                            bs-dashboard-application-meta
                          "
                        >

                          <span>

                            <MapPin
                              size={13}
                              strokeWidth={1.8}
                            />

                            {application.location}

                          </span>


                          <span>
                            {application.employmentType}
                          </span>

                        </div>


                        <p>
                          Applied on{' '}
                          {application.appliedAt}
                        </p>

                      </div>

                    </div>


                    {/* =================================
                        RIGHT
                    ================================== */}

                    <div
                      className="
                        bs-dashboard-application-right
                      "
                    >

                      <span
                        className={`
                          bs-dashboard-status
                          ${
                            getStatusClass(
                              application.status
                            )
                          }
                        `}
                      >
                        {application.status}
                      </span>


                      <ArrowRight
                        size={17}
                        strokeWidth={1.8}
                      />

                    </div>

                  </button>

                )
              )}

            </div>

          </section>


          {/* ===============================================
              PROFILE CARD
          =============================================== */}

          <section
            className="
              bs-dashboard-profile-card
            "
          >

            <div
              className="
                bs-dashboard-profile-icon
              "
            >

              <UserRound
                size={23}
                strokeWidth={1.8}
              />

            </div>


            <div
              className="
                bs-dashboard-profile-content
              "
            >

              <span>
                YOUR PROFILE
              </span>


              <h3>

                {user?.firstName}{' '}
                {user?.lastName}

              </h3>


              <p>
                {user?.email}
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate('/profile')
              }
            >

              View Profile

              <ArrowRight
                size={16}
                strokeWidth={1.8}
              />

            </button>

          </section>


        </div>

      </section>

    </main>
  )
}