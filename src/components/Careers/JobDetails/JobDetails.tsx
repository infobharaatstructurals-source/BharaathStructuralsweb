import { useEffect, useState } from 'react'

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Send,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import CareerSidebar from '../CareerSidebar/CareerSidebar'

import './JobDetails.css'


/* =========================================================
   JOB TYPE
========================================================= */

interface Job {
  id: string
  title: string
  location: string
  employmentType: string
  experience: string
  department: string
  description: string
  postedDate: string
}


/* =========================================================
   JOB DETAILS
========================================================= */

export default function JobDetails() {

  const navigate = useNavigate()

  const { jobId } = useParams<{
    jobId: string
  }>()


  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  /* =======================================================
     LOAD JOB FROM BACKEND
  ======================================================= */

  useEffect(() => {
    let cancelled = false

    const loadJob = async () => {
      if (!jobId) {
        setJob(null)
        setErrorMessage('The job ID is missing.')
        setLoading(false)
        return
      }

      setLoading(true)
      setErrorMessage('')
      setJob(null)

      try {
        const response = await fetch(
          `http://localhost:5000/api/jobs/${encodeURIComponent(jobId)}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data?.message || 'Unable to load this job.'
          )
        }

        const fetchedJob = data?.job

        if (!fetchedJob) {
          throw new Error('Job not found.')
        }

        if (!cancelled) {
          setJob(fetchedJob)
        }
      } catch (error) {
        console.error('Load job details error:', error)

        if (!cancelled) {
          setJob(null)
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Unable to load this job.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadJob()

    return () => {
      cancelled = true
    }
  }, [jobId])


  /* =======================================================
     BACK TO JOBS
  ======================================================= */

  const handleBackToJobs = () => {
    navigate('/jobs')
  }


  /* =======================================================
     APPLY
  ======================================================= */

  const handleApply = () => {

    /*
     * The Apply page can be added next.
     *
     * We keep the job ID in the URL so the
     * application page knows exactly which job
     * the candidate selected.
     */

    if (!job) {
      return
    }

    navigate(
      `/jobs/${encodeURIComponent(job.id)}/apply`
    )
  }


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="bs-job-details-page">
        <CareerSidebar />

        <section className="bs-job-details-not-found">
          <div className="bs-job-details-not-found-icon bs-job-details-loading-icon">
            <BriefcaseBusiness
              size={28}
              strokeWidth={1.7}
            />
          </div>

          <h1>Loading Job</h1>

          <p>
            Please wait while we load the latest job details.
          </p>

          <div className="bs-job-details-loading-spinner" />
        </section>
      </main>
    )
  }


  /* =======================================================
     JOB NOT FOUND / API ERROR
  ======================================================= */

  if (!job) {

    return (
      <main
        className="
          bs-job-details-page
        "
      >

        <CareerSidebar />

        <section
          className="
            bs-job-details-not-found
          "
        >

          <div
            className="
              bs-job-details-not-found-icon
            "
          >

            <BriefcaseBusiness
              size={28}
              strokeWidth={1.7}
            />

          </div>

          <h1>
            Job Not Found
          </h1>

          <p>
            {errorMessage ||
              'The job you are looking for is no longer available or the job ID is invalid.'}
          </p>

          <button
            type="button"
            onClick={
              handleBackToJobs
            }
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.8}
            />

            Back to Jobs
          </button>

        </section>

      </main>
    )
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <main
      className="
        bs-job-details-page
      "
    >


      {/* ===================================================
          CAREER SIDEBAR
      =================================================== */}

      <CareerSidebar />


      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        className="
          bs-job-details-header
        "
      >

        <div
          className="
            bs-job-details-header-inner
          "
        >

          <button
            type="button"
            className="
              bs-job-details-back
            "
            onClick={
              handleBackToJobs
            }
          >

            <ArrowLeft
              size={16}
              strokeWidth={1.8}
            />

            <span>
              Back to Jobs
            </span>

          </button>


          <div
            className="
              bs-job-details-brand
            "
          >

            <img
              src="/Logo.webp"
              alt="Bharaat Structurals"
            />

          </div>

        </div>

      </header>


      {/* ===================================================
          CONTENT
      =================================================== */}

      <section
        className="
          bs-job-details-content
        "
      >


        {/* =================================================
            JOB HERO
        ================================================= */}

        <section
          className="
            bs-job-details-hero
          "
        >

          <div
            className="
              bs-job-details-hero-main
            "
          >

            <div
              className="
                bs-job-details-hero-icon
              "
            >

              <BriefcaseBusiness
                size={30}
                strokeWidth={1.6}
              />

            </div>


            <div
              className="
                bs-job-details-hero-info
              "
            >

              <span
                className="
                  bs-job-details-code
                "
              >
                {job.id}
              </span>


              <h1>
                {job.title}
              </h1>


              <p>
                {job.department}
              </p>

            </div>

          </div>


          <div
            className="
              bs-job-details-hero-action
            "
          >

            <span
              className="
                bs-job-details-hero-type
              "
            >
              {job.employmentType}
            </span>


            <button
              type="button"
              className="
                bs-job-details-apply-top
              "
              onClick={
                handleApply
              }
            >

              <Send
                size={15}
                strokeWidth={1.9}
              />

              Apply Now

            </button>

          </div>


          {/* ===============================================
              HERO DECORATION
          =============================================== */}

          <div
            className="
              bs-job-details-decoration
            "
          >

            <div
              className="
                bs-job-details-circle
                bs-job-details-circle-one
              "
            />

            <div
              className="
                bs-job-details-circle
                bs-job-details-circle-two
              "
            />

          </div>

        </section>


        {/* =================================================
            JOB META
        ================================================= */}

        <section
          className="
            bs-job-details-meta
          "
        >

          <div
            className="
              bs-job-details-meta-item
            "
          >

            <MapPin
              size={17}
              strokeWidth={1.8}
            />

            <div>

              <span>
                Location
              </span>

              <strong>
                {job.location}
              </strong>

            </div>

          </div>


          <div
            className="
              bs-job-details-meta-item
            "
          >

            <Clock3
              size={17}
              strokeWidth={1.8}
            />

            <div>

              <span>
                Experience
              </span>

              <strong>
                {job.experience}
              </strong>

            </div>

          </div>


          <div
            className="
              bs-job-details-meta-item
            "
          >

            <BriefcaseBusiness
              size={17}
              strokeWidth={1.8}
            />

            <div>

              <span>
                Employment
              </span>

              <strong>
                {job.employmentType}
              </strong>

            </div>

          </div>


          <div
            className="
              bs-job-details-meta-item
            "
          >

            <CalendarDays
              size={17}
              strokeWidth={1.8}
            />

            <div>

              <span>
                Posted
              </span>

              <strong>
                {job.postedDate}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div
          className="
            bs-job-details-layout
          "
        >


          {/* ===============================================
              LEFT COLUMN
          =============================================== */}

          <div
            className="
              bs-job-details-main
            "
          >


            {/* =============================================
                ABOUT THE ROLE
            ============================================= */}

            <section
              className="
                bs-job-details-section
              "
            >

              <div
                className="
                  bs-job-details-section-title
                "
              >

                <div
                  className="
                    bs-job-details-section-icon
                  "
                >

                  <FileText
                    size={18}
                    strokeWidth={1.8}
                  />

                </div>


                <div>

                  <span>
                    ROLE OVERVIEW
                  </span>

                  <h2>
                    About the Role
                  </h2>

                </div>

              </div>


              <p
                className="
                  bs-job-details-description
                "
              >
                {job.description}
              </p>


              <p
                className="
                  bs-job-details-description
                "
              >
                This position offers an
                opportunity to contribute
                to Bharaat Structurals
                projects while working
                closely with the relevant
                engineering and project
                teams.
              </p>

            </section>


            {/* =============================================
                RESPONSIBILITIES
            ============================================= */}

            <section
              className="
                bs-job-details-section
              "
            >

              <div
                className="
                  bs-job-details-section-title
                "
              >

                <div
                  className="
                    bs-job-details-section-icon
                  "
                >

                  <CheckCircle2
                    size={18}
                    strokeWidth={1.8}
                  />

                </div>


                <div>

                  <span>
                    WHAT YOU WILL DO
                  </span>

                  <h2>
                    Key Responsibilities
                  </h2>

                </div>

              </div>


              <ul
                className="
                  bs-job-details-list
                "
              >

                <li>
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.9}
                  />

                  <span>
                    Work closely with the
                    relevant team to support
                    project requirements and
                    deliverables.
                  </span>

                </li>


                <li>
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.9}
                  />

                  <span>
                    Maintain accuracy,
                    quality and consistency
                    across assigned work.
                  </span>

                </li>


                <li>
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.9}
                  />

                  <span>
                    Coordinate with internal
                    stakeholders to complete
                    work within project
                    timelines.
                  </span>

                </li>


                <li>
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.9}
                  />

                  <span>
                    Contribute to continuous
                    improvement of project
                    processes and workflows.
                  </span>

                </li>

              </ul>

            </section>


            {/* =============================================
                REQUIREMENTS
            ============================================= */}

            <section
              className="
                bs-job-details-section
              "
            >

              <div
                className="
                  bs-job-details-section-title
                "
              >

                <div
                  className="
                    bs-job-details-section-icon
                  "
                >

                  <BriefcaseBusiness
                    size={18}
                    strokeWidth={1.8}
                  />

                </div>


                <div>

                  <span>
                    WHAT WE ARE LOOKING FOR
                  </span>

                  <h2>
                    Requirements
                  </h2>

                </div>

              </div>


              <ul
                className="
                  bs-job-details-list
                "
              >

                <li>
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.9}
                  />

                  <span>
                    Relevant educational
                    background or practical
                    experience for the role.
                  </span>

                </li>


                <li>
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.9}
                  />

                  <span>
                    Strong attention to
                    detail and commitment
                    to quality.
                  </span>

                </li>


                <li>
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.9}
                  />

                  <span>
                    Ability to communicate
                    and collaborate
                    effectively with team
                    members.
                  </span>

                </li>


                <li>
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.9}
                  />

                  <span>
                    Willingness to learn and
                    adapt to Bharaat
                    Structurals workflows.
                  </span>

                </li>

              </ul>

            </section>


          </div>


          {/* ===============================================
              RIGHT COLUMN
          =============================================== */}

          <aside
            className="
              bs-job-details-sidebar
            "
          >


            {/* =============================================
                APPLY CARD
            ============================================= */}

            <div
              className="
                bs-job-details-apply-card
              "
            >

              <span
                className="
                  bs-job-details-apply-eyebrow
                "
              >
                INTERESTED IN THIS ROLE?
              </span>


              <h3>
                Ready to take the
                next step?
              </h3>


              <p>
                Submit your application
                for this position and
                become part of the
                Bharaat Structurals
                talent network.
              </p>


              <button
                type="button"
                className="
                  bs-job-details-apply-button
                "
                onClick={
                  handleApply
                }
              >

                <Send
                  size={16}
                  strokeWidth={1.9}
                />

                Apply Now

              </button>


              <div
                className="
                  bs-job-details-apply-note
                "
              >

                <CheckCircle2
                  size={14}
                  strokeWidth={1.8}
                />

                <span>
                  Applications are currently
                  handled through the Careers
                  portal.
                </span>

              </div>

            </div>


            {/* =============================================
                JOB SUMMARY
            ============================================= */}

            <div
              className="
                bs-job-details-summary
              "
            >

              <div
                className="
                  bs-job-details-summary-heading
                "
              >
                Job Summary
              </div>


              <div
                className="
                  bs-job-details-summary-row
                "
              >

                <span>
                  Job ID
                </span>

                <strong>
                  {job.id}
                </strong>

              </div>


              <div
                className="
                  bs-job-details-summary-row
                "
              >

                <span>
                  Department
                </span>

                <strong>
                  {job.department}
                </strong>

              </div>


              <div
                className="
                  bs-job-details-summary-row
                "
              >

                <span>
                  Location
                </span>

                <strong>
                  {job.location}
                </strong>

              </div>


              <div
                className="
                  bs-job-details-summary-row
                "
              >

                <span>
                  Experience
                </span>

                <strong>
                  {job.experience}
                </strong>

              </div>


              <div
                className="
                  bs-job-details-summary-row
                "
              >

                <span>
                  Employment
                </span>

                <strong>
                  {job.employmentType}
                </strong>

              </div>

            </div>


          </aside>

        </div>


        {/* =================================================
            BOTTOM APPLY
        ================================================= */}

        <section
          className="
            bs-job-details-bottom-apply
          "
        >

          <div>

            <span>
              READY TO APPLY?
            </span>

            <h2>
              Take the next step with
              Bharaat Structurals.
            </h2>

          </div>


          <button
            type="button"
            onClick={
              handleApply
            }
          >

            <Send
              size={16}
              strokeWidth={1.9}
            />

            Apply Now

          </button>

        </section>


      </section>

    </main>
  )
}