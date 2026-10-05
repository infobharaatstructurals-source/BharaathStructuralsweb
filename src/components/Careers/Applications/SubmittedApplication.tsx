import {
  useState,
} from 'react'

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  FileText,
  GraduationCap,
//   Linkedin,
  MapPin,
  XCircle,
} from 'lucide-react'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import type {
  AppDispatch,
  RootState,
} from '../../../app/store'

import {
  withdrawApplication,
} from '../../../features/applications/applicationsSlice'

import CareerSidebar from '../CareerSidebar/CareerSidebar'

import './SubmittedApplication.css'


/* =========================================================
   PAGE
========================================================= */

export default function SubmittedApplication() {

  const navigate = useNavigate()

  const dispatch =
    useDispatch<AppDispatch>()

  const { applicationId } =
    useParams<{
      applicationId: string
    }>()


  /* =======================================================
     APPLICATION
  ======================================================= */

  const applications =
    useSelector(
      (state: RootState) =>
        state.applications.applications
    )


  const application =
    applications.find(
      (item) =>
        item.id === applicationId
    )


  /* =======================================================
     WITHDRAW MODAL
  ======================================================= */

  const [
    showWithdrawModal,
    setShowWithdrawModal,
  ] = useState(false)


  /* =======================================================
     WITHDRAW
  ======================================================= */

  const handleWithdraw = () => {

    if (!application) {
      return
    }

    dispatch(
      withdrawApplication(
        application.id
      )
    )

    setShowWithdrawModal(false)

  }


  /* =======================================================
     STATUS CLASS
  ======================================================= */

  const getStatusClass = (
    status: string
  ) => {

    switch (status) {

      case 'Selected':
        return 'submitted-status-selected'

      case 'Shortlisted':
        return 'submitted-status-shortlisted'

      case 'Under Review':
        return 'submitted-status-review'

      case 'Rejected':
        return 'submitted-status-rejected'

      case 'Withdrawn':
        return 'submitted-status-withdrawn'

      default:
        return 'submitted-status-applied'

    }

  }


  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!application) {

    return (

      <main className="submitted-application-page">

        <CareerSidebar />

        <section className="submitted-application-content">

          <div className="submitted-application-not-found">

            <FileText size={38} />

            <h1>
              Application Not Found
            </h1>

            <p>
              This submitted application
              could not be found.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate('/applications')
              }
            >

              <ArrowLeft size={16} />

              Back to My Applications

            </button>

          </div>

        </section>

      </main>

    )
  }


  const profile =
    application.submittedProfile


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <main className="submitted-application-page">

      <CareerSidebar />


      <section className="submitted-application-content">


        {/* =================================================
            BACK
        ================================================= */}

        <button
          type="button"
          className="submitted-back-button"
          onClick={() =>
            navigate('/applications')
          }
        >

          <ArrowLeft size={17} />

          Back to My Applications

        </button>


        {/* =================================================
            HEADER
        ================================================= */}

        <section className="submitted-application-header">

          <div className="submitted-header-icon">

            <FileText
              size={28}
            />

          </div>


          <div className="submitted-header-text">

            <span>
              SUBMITTED APPLICATION
            </span>

            <h1>
              {application.jobTitle}
            </h1>

            <p>
              Application ID:
              {' '}
              {application.id}
            </p>

          </div>


          <div
            className={`submitted-status ${getStatusClass(
              application.status
            )}`}
          >
            {application.status}
          </div>

        </section>


        {/* =================================================
            JOB INFORMATION
        ================================================= */}

        <section className="submitted-card">

          <div className="submitted-section-heading">

            <span>
              JOB
            </span>

            <h2>
              Job Information
            </h2>

          </div>


          <div className="submitted-job-grid">

            <div className="submitted-info-box">

              <BriefcaseBusiness />

              <div>

                <span>
                  Job Code
                </span>

                <strong>
                  {application.jobCode}
                </strong>

              </div>

            </div>


            <div className="submitted-info-box">

              <MapPin />

              <div>

                <span>
                  Location
                </span>

                <strong>
                  {application.location}
                </strong>

              </div>

            </div>


            <div className="submitted-info-box">

              <BriefcaseBusiness />

              <div>

                <span>
                  Employment Type
                </span>

                <strong>
                  {application.employmentType}
                </strong>

              </div>

            </div>


            <div className="submitted-info-box">

              <CalendarDays />

              <div>

                <span>
                  Applied Date
                </span>

                <strong>
                  {application.appliedDate}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <section className="submitted-card">

          <div className="submitted-section-heading">

            <span>
              CANDIDATE
            </span>

            <h2>
              Personal Information
            </h2>

          </div>


          <div className="submitted-details-grid">

            <Detail
              label="First Name"
              value={profile.firstName}
            />

            <Detail
              label="Last Name"
              value={profile.lastName}
            />

            <Detail
              label="Email"
              value={profile.email}
            />

            <Detail
              label="Phone"
              value={profile.phone}
            />

            <Detail
              label="Location"
              value={profile.location}
            />

          </div>

        </section>


        {/* =================================================
            PROFESSIONAL INFORMATION
        ================================================= */}

        <section className="submitted-card">

          <div className="submitted-section-heading">

            <span>
              PROFESSIONAL
            </span>

            <h2>
              Professional Information
            </h2>

          </div>


          <div className="submitted-details-grid">

            <Detail
              label="Experience"
              value={profile.experience}
            />

            <Detail
              label="Current Company"
              value={profile.currentCompany}
            />

            <Detail
              label="LinkedIn"
              value={profile.linkedin}
            //   icon={<Linkedin size={15} />}
            />

            <Detail
              label="Portfolio"
              value={
                profile.portfolio ||
                'Not provided'
              }
            />

          </div>


          <div className="submitted-full-detail">

            <span>
              Skills
            </span>

            <p>
              {profile.skills}
            </p>

          </div>

        </section>


        {/* =================================================
            EDUCATION
        ================================================= */}

        <section className="submitted-card">

          <div className="submitted-section-heading">

            <span>
              EDUCATION
            </span>

            <h2>
              Education Information
            </h2>

          </div>


          <div className="submitted-education-section">

            <div className="submitted-education-title">

              <GraduationCap size={20} />

              <strong>
                10th Standard
              </strong>

            </div>


            <div className="submitted-details-grid">

              <Detail
                label="School Name"
                value={
                  profile.tenthSchoolName
                }
              />

              <Detail
                label="State / UT"
                value={
                  profile.tenthState
                }
              />

              <Detail
                label="Percentage"
                value={
                  `${profile.tenthPercentage}%`
                }
              />

            </div>

          </div>


          <div className="submitted-education-section">

            <div className="submitted-education-title">

              <GraduationCap size={20} />

              <strong>
                12th Standard
              </strong>

            </div>


            <div className="submitted-details-grid">

              <Detail
                label="Board"
                value={
                  profile.twelfthBoard
                }
              />

              <Detail
                label="Percentage"
                value={
                  `${profile.twelfthPercentage}%`
                }
              />

            </div>

          </div>


          <div className="submitted-education-section">

            <div className="submitted-education-title">

              <GraduationCap size={20} />

              <strong>
                Higher Education
              </strong>

            </div>


            <div className="submitted-details-grid">

              <Detail
                label="Highest Qualification"
                value={
                  profile.highestQualification
                }
              />

              <Detail
                label="Percentage"
                value={
                  `${profile.qualificationPercentage}%`
                }
              />

              <Detail
                label="College Name"
                value={
                  profile.collegeName
                }
              />

              <Detail
                label="College State / UT"
                value={
                  profile.collegeState
                }
              />

            </div>

          </div>

        </section>


        {/* =================================================
            RESUME
        ================================================= */}

        <section className="submitted-card">

          <div className="submitted-section-heading">

            <span>
              DOCUMENT
            </span>

            <h2>
              Submitted Resume
            </h2>

          </div>


          <div className="submitted-resume">

            <div className="submitted-resume-icon">

              <FileText
                size={22}
              />

            </div>


            <div>

              <span>
                Resume
              </span>

              <strong>
                {profile.resume}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            APPLICATION STATUS
        ================================================= */}

        <section className="submitted-card">

          <div className="submitted-section-heading">

            <span>
              APPLICATION
            </span>

            <h2>
              Application Status
            </h2>

          </div>


          <div className="submitted-current-status">

            <div>

              <span>
                CURRENT STATUS
              </span>

              <strong>
                {application.status}
              </strong>

            </div>


            <span
              className={`submitted-large-status ${getStatusClass(
                application.status
              )}`}
            >
              {application.status}
            </span>

          </div>


          {/* WITHDRAW */}

          {application.status !==
            'Withdrawn' && (

            <div className="submitted-withdraw-area">

              <div>

                <h3>
                  Withdraw Application
                </h3>

                <p>
                  If you no longer want to
                  continue with this
                  application, you can
                  withdraw it.
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setShowWithdrawModal(true)
                }
              >

                <XCircle size={17} />

                Withdraw Application

              </button>

            </div>

          )}


          {application.status ===
            'Withdrawn' && (

            <div className="submitted-withdrawn-message">

              <CheckCircle2 size={21} />

              <div>

                <strong>
                  Application Withdrawn
                </strong>

                <p>
                  This application has been
                  withdrawn and is kept in
                  your application history.
                </p>

              </div>

            </div>

          )}

        </section>


        {/* =================================================
            BOTTOM BUTTONS
        ================================================= */}

        <div className="submitted-bottom-actions">

          <button
            type="button"
            onClick={() =>
              navigate('/applications')
            }
          >

            <ArrowLeft size={16} />

            My Applications

          </button>


          <button
            type="button"
            onClick={() =>
              navigate(
                `/jobs/${encodeURIComponent(application.jobId)}`
              )
            }
          >

            View Job

          </button>

        </div>

      </section>


      {/* =================================================
          WITHDRAW CONFIRMATION
      ================================================= */}

      {showWithdrawModal && (

        <div
          className="submitted-modal-overlay"
          onClick={() =>
            setShowWithdrawModal(false)
          }
        >

          <div
            className="submitted-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="submitted-modal-icon">

              <XCircle
                size={28}
              />

            </div>


            <h2>
              Withdraw Application?
            </h2>


            <p>
              Are you sure you want to
              withdraw your application
              for{' '}
              <strong>
                {application.jobTitle}
              </strong>
              ?
            </p>


            <div className="submitted-modal-actions">

              <button
                type="button"
                onClick={() =>
                  setShowWithdrawModal(false)
                }
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleWithdraw
                }
              >

                <XCircle size={16} />

                Yes, Withdraw

              </button>

            </div>

          </div>

        </div>

      )}

    </main>

  )
}


/* =========================================================
   DETAIL COMPONENT
========================================================= */

function Detail({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {

  return (

    <div className="submitted-detail">

      <span>
        {icon}
        {label}
      </span>

      <strong>
        {value || 'Not provided'}
      </strong>

    </div>

  )

}