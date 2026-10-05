import {
  useMemo,
  useState,
} from 'react'

import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  MapPin,
  Search,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  useSelector,
} from 'react-redux'

import type {
  RootState,
} from '../../../app/store'

import type {
  Application,
} from '../../../features/applications/applicationsSlice'

import CareerSidebar from '../CareerSidebar/CareerSidebar'

import './Applications.css'


/* =========================================================
   APPLICATIONS PAGE
========================================================= */

export default function Applications() {

  const navigate = useNavigate()


  /* =======================================================
     REDUX APPLICATIONS
  ======================================================= */

  const applications =
    useSelector(
      (state: RootState) =>
        state.applications.applications
    )


  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [
    search,
    setSearch,
  ] = useState('')


  const [
    statusFilter,
    setStatusFilter,
  ] = useState('All')


  /* =======================================================
     FILTER APPLICATIONS
  ======================================================= */

  const filteredApplications =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase()


      return applications.filter(
        (application) => {

          const matchesSearch =
            !searchValue ||

            application.jobTitle
              .toLowerCase()
              .includes(searchValue) ||

            application.jobCode
              .toLowerCase()
              .includes(searchValue) ||

            application.location
              .toLowerCase()
              .includes(searchValue)


          const matchesStatus =
            statusFilter === 'All' ||

            application.status ===
              statusFilter


          return (
            matchesSearch &&
            matchesStatus
          )

        }
      )

    }, [
      applications,
      search,
      statusFilter,
    ])


  /* =======================================================
     STATUS CLASS
  ======================================================= */

  const getStatusClass = (
    status: Application['status']
  ) => {

    switch (status) {

      case 'Selected':

        return (
          'bs-application-status-selected'
        )


      case 'Shortlisted':

        return (
          'bs-application-status-shortlisted'
        )


      case 'Rejected':

        return (
          'bs-application-status-rejected'
        )


      case 'Under Review':

        return (
          'bs-application-status-review'
        )


      case 'Withdrawn':

        return (
          'bs-application-status-withdrawn'
        )


      default:

        return (
          'bs-application-status-applied'
        )

    }

  }


  /* =======================================================
     VIEW SUBMITTED APPLICATION
  ======================================================= */

  const handleViewApplication = (
    applicationId: string
  ) => {

    navigate(
      `/applications/${applicationId}`
    )

  }


  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  // const clearFilters = () => {

  //   setSearch('')

  //   setStatusFilter('All')

  // }


  /* =======================================================
     COUNTS
  ======================================================= */

  const totalApplications =
    applications.length


  const underReviewCount =
    applications.filter(
      (application) =>
        application.status ===
        'Under Review'
    ).length


  const shortlistedCount =
    applications.filter(
      (application) =>
        application.status ===
        'Shortlisted'
    ).length


  const selectedCount =
    applications.filter(
      (application) =>
        application.status ===
        'Selected'
    ).length


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <main className="bs-applications-page">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <CareerSidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section
        className="
          bs-applications-content
        "
      >


        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            bs-applications-intro
          "
        >

          <div
            className="
              bs-applications-intro-content
            "
          >

            <span
              className="
                bs-applications-eyebrow
              "
            >
              CAREERS
            </span>


            <h1>
              My Applications
            </h1>


            <p>
              Track the jobs you have
              applied for and check
              your application status
              from one place.
            </p>

          </div>


          {/* HERO DECORATION */}

          <div
            className="
              bs-applications-intro-decoration
            "
          >

            <div
              className="
                bs-applications-intro-circle
                bs-applications-intro-circle-one
              "
            />

            <div
              className="
                bs-applications-intro-circle
                bs-applications-intro-circle-two
              "
            />

            <ClipboardList
              size={47}
              strokeWidth={1.35}
            />

          </div>


          {/* TOTAL */}

          <div
            className="
              bs-applications-intro-count
            "
          >

            <strong>
              {filteredApplications.length}
            </strong>

            <span>
              {filteredApplications.length === 1
                ? 'Application'
                : 'Applications'}
            </span>

          </div>

        </section>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <section
          className="
            bs-applications-summary
          "
        >

          <div
            className="
              bs-application-summary-card
            "
          >

            <div
              className="
                bs-application-summary-icon
              "
            >

              <ClipboardList
                size={20}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <span>
                Total
              </span>

              <strong>
                {totalApplications}
              </strong>

            </div>

          </div>


          <div
            className="
              bs-application-summary-card
            "
          >

            <div
              className="
                bs-application-summary-icon
              "
            >

              <CalendarDays
                size={20}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <span>
                Under Review
              </span>

              <strong>
                {underReviewCount}
              </strong>

            </div>

          </div>


          <div
            className="
              bs-application-summary-card
            "
          >

            <div
              className="
                bs-application-summary-icon
              "
            >

              <BriefcaseBusiness
                size={20}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <span>
                Shortlisted
              </span>

              <strong>
                {shortlistedCount}
              </strong>

            </div>

          </div>


          <div
            className="
              bs-application-summary-card
            "
          >

            <div
              className="
                bs-application-summary-icon
              "
            >

              <ClipboardList
                size={20}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <span>
                Selected
              </span>

              <strong>
                {selectedCount}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            FILTERS
        ================================================= */}

        <section
          className="
            bs-applications-filters
          "
        >

          <div
            className="
              bs-applications-search
            "
          >

            <Search
              size={17}
              strokeWidth={1.8}
            />

            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            aria-label="Filter applications by status"
          >

            <option value="All">
              All Status
            </option>

            <option value="Applied">
              Applied
            </option>

            <option value="Under Review">
              Under Review
            </option>

            <option value="Shortlisted">
              Shortlisted
            </option>

            <option value="Selected">
              Selected
            </option>

            <option value="Rejected">
              Rejected
            </option>

            <option value="Withdrawn">
              Withdrawn
            </option>

          </select>

        </section>


        {/* =================================================
            APPLICATION LIST
        ================================================= */}

        <section
          className="
            bs-applications-list
          "
        >

          {filteredApplications.length === 0 ? (

            <div
              className="
                bs-applications-empty
              "
            >

              <div
                className="
                  bs-applications-empty-icon
                "
              >

                <ClipboardList
                  size={26}
                  strokeWidth={1.7}
                />

              </div>


              <h2>
                No applications found
              </h2>


              <p>
                You have not submitted
                any applications yet.
              </p>


              <button
                type="button"
                onClick={() =>
                  navigate('/jobs')
                }
              >
                Browse Jobs
              </button>

            </div>

          ) : (

            filteredApplications.map(
              (application) => (

                <article
                  className="
                    bs-application-card
                  "
                  key={application.id}
                >


                  {/* =====================================
                      CARD TOP
                  ====================================== */}

                  <div
                    className="
                      bs-application-card-top
                    "
                  >

                    <div
                      className="
                        bs-application-card-main
                      "
                    >

                      <div
                        className="
                          bs-application-job-icon
                        "
                      >

                        <BriefcaseBusiness
                          size={22}
                          strokeWidth={1.7}
                        />

                      </div>


                      <div
                        className="
                          bs-application-job-info
                        "
                      >

                        <span
                          className="
                            bs-application-code
                          "
                        >
                          {application.jobCode}
                        </span>


                        <h2>
                          {application.jobTitle}
                        </h2>


                        <div
                          className="
                            bs-application-meta
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

                            <BriefcaseBusiness
                              size={13}
                              strokeWidth={1.8}
                            />

                            {application.employmentType}

                          </span>

                        </div>

                      </div>

                    </div>


                    <span
                      className={`
                        bs-application-status
                        ${getStatusClass(
                          application.status
                        )}
                      `}
                    >
                      {application.status}
                    </span>

                  </div>


                  {/* =====================================
                      CARD BOTTOM
                  ====================================== */}

                  <div
                    className="
                      bs-application-card-bottom
                    "
                  >

                    <div
                      className="
                        bs-application-date
                      "
                    >

                      <CalendarDays
                        size={14}
                        strokeWidth={1.8}
                      />

                      <span>
                        Applied on{' '}
                        {application.appliedDate}
                      </span>

                    </div>


                    <button
                      type="button"
                      className="
                        bs-application-view
                      "
                      onClick={() =>
                        handleViewApplication(
                          application.id
                        )
                      }
                    >

                      View Application

                      <ArrowRight
                        size={16}
                        strokeWidth={1.8}
                      />

                    </button>

                  </div>

                </article>

              )
            )

          )}

        </section>

      </section>

    </main>

  )
}