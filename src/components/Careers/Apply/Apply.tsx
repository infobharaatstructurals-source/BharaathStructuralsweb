import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  GraduationCap,
  MapPin,
  Pencil,
  Save,
  Send,
  Upload,
  User,
  X,
} from 'lucide-react'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import type {
  ChangeEvent,
} from 'react'

import type {
  AppDispatch,
  RootState,
} from '../../../app/store'

import {
  addApplication,
} from '../../../features/applications/applicationsSlice'

import {
  updateProfile,
} from '../../../features/profile/profileSlice'

import CareerSidebar from '../CareerSidebar/CareerSidebar'

import './Apply.css'


/* =========================================================
   JOB TYPE
========================================================= */

// interface Job {
//   id: string
//   title: string
//   location: string
//   employmentType: string
//   experience: string
//   department: string
//   description: string
//   postedDate: string
// }


/* =========================================================
   JOB DATA
========================================================= */

interface JobResponse {
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
   APPLY PAGE
========================================================= */

export default function Apply() {

  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()

  const { jobId } = useParams<{
    jobId: string
  }>()


  /* =======================================================
     REDUX
  ======================================================= */

  const profile = useSelector(
    (state: RootState) =>
      state.profile.profile
  )

  const applications = useSelector(
    (state: RootState) =>
      state.applications.applications
  )


  /* =======================================================
     LOAD JOB FROM BACKEND
  ======================================================= */

  const [job, setJob] = useState<JobResponse | null>(null)
  const [loadingJob, setLoadingJob] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadJob = async () => {
      if (!jobId) {
        setJob(null)
        setLoadingJob(false)
        return
      }

      try {
        setLoadingJob(true)

        const response = await fetch(
          `http://localhost:5000/api/jobs/${encodeURIComponent(jobId)}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.message || 'Unable to load this job.')
        }

        const fetchedJob = data?.job as JobResponse | undefined

        if (!fetchedJob) {
          throw new Error('Job not found.')
        }

        if (!cancelled) {
          setJob(fetchedJob)
        }
      } catch (error) {
        console.error('Load apply job error:', error)

        if (!cancelled) {
          setJob(null)
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to load this job.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingJob(false)
        }
      }
    }

    loadJob()

    return () => {
      cancelled = true
    }
  }, [jobId])


  /* =======================================================
     LOCAL UI STATE
  ======================================================= */

  const [
    editingSkills,
    setEditingSkills,
  ] = useState(false)

  const [
    skillsValue,
    setSkillsValue,
  ] = useState(profile.skills)

  const [
    newResume,
    setNewResume,
  ] = useState('')

  const [
    submitted,
    setSubmitted,
  ] = useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('')


  /* =======================================================
     CHECK ALREADY APPLIED
  ======================================================= */

  const alreadyApplied = useMemo(() => {

  if (!job) {
    return false
  }

  return applications.some(
    (application) =>
      application.jobId === job.id &&
      application.status !== 'Withdrawn'
  )

}, [
  applications,
  job,
])


  /* =======================================================
     HANDLE SKILLS EDIT
  ======================================================= */

  const handleEditSkills = () => {

    setSkillsValue(profile.skills)

    setEditingSkills(true)
  }


  /* =======================================================
     SAVE SKILLS
  ======================================================= */

  const handleSaveSkills = () => {

    dispatch(
      updateProfile({
        field: 'skills',
        value: skillsValue,
      })
    )

    setEditingSkills(false)
  }


  /* =======================================================
     CANCEL SKILLS
  ======================================================= */

  const handleCancelSkills = () => {

    setSkillsValue(profile.skills)

    setEditingSkills(false)
  }


  /* =======================================================
     RESUME UPLOAD
  ======================================================= */

  const handleResumeChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    if (
      file.type !==
      'application/pdf'
    ) {

      setErrorMessage(
        'Please upload a PDF resume only.'
      )

      event.target.value = ''

      return
    }

    setErrorMessage('')

    setNewResume(file.name)
  }


  /* =======================================================
     SUBMIT APPLICATION
  ======================================================= */

  const handleSubmitApplication = () => {

    if (!job) {
      return
    }

    if (alreadyApplied) {
      return
    }

    setErrorMessage('')


    /* =====================================================
       CHECK REQUIRED PROFILE INFORMATION
    ===================================================== */

    const missingFields: string[] = []


    if (!profile.firstName.trim()) {
      missingFields.push('First Name')
    }

    if (!profile.lastName.trim()) {
      missingFields.push('Last Name')
    }

    if (!profile.email.trim()) {
      missingFields.push('Email')
    }

    if (!profile.phone.trim()) {
      missingFields.push('Phone')
    }

    if (!profile.location.trim()) {
      missingFields.push('Location')
    }

    if (!profile.experience.trim()) {
      missingFields.push('Experience')
    }

    if (!profile.currentCompany.trim()) {
      missingFields.push('Current Company')
    }

    if (!profile.skills.trim()) {
      missingFields.push('Skills')
    }

    if (!profile.linkedin.trim()) {
      missingFields.push('LinkedIn')
    }


    /* =====================================================
       EDUCATION
    ===================================================== */

    if (!profile.tenthSchoolName.trim()) {
      missingFields.push('10th School Name')
    }

    if (!profile.tenthState.trim()) {
      missingFields.push('10th State / UT')
    }

    if (!profile.tenthPercentage.trim()) {
      missingFields.push('10th Percentage')
    }

    if (!profile.twelfthBoard.trim()) {
      missingFields.push('12th Board')
    }

    if (!profile.twelfthPercentage.trim()) {
      missingFields.push('12th Percentage')
    }

    if (!profile.highestQualification.trim()) {
      missingFields.push('Highest Qualification')
    }

    if (!profile.qualificationPercentage.trim()) {
      missingFields.push('Qualification Percentage')
    }

    if (!profile.collegeName.trim()) {
      missingFields.push('College Name')
    }

    if (!profile.collegeState.trim()) {
      missingFields.push('College State / UT')
    }


    /* =====================================================
       RESUME
    ===================================================== */

    const finalResume =
      newResume ||
      profile.resume

    if (!finalResume.trim()) {
      missingFields.push('Resume')
    }


    /* =====================================================
       SHOW ERROR
    ===================================================== */

    if (missingFields.length > 0) {

      setErrorMessage(
        `Please complete your profile before applying. Missing: ${missingFields.join(', ')}`
      )

      return
    }


    /* =====================================================
       UPDATE RESUME IF NEW ONE WAS SELECTED
    ===================================================== */

    if (newResume) {

      dispatch(
        updateProfile({
          field: 'resume',
          value: newResume,
        })
      )
    }


    /* =====================================================
       CREATE APPLICATION
    ===================================================== */

    const application = {

  id: `APP-${Date.now()}`,

  jobId: job.id,

  jobCode: job.id,

  jobTitle: job.title,

  location: job.location,

  employmentType:
    job.employmentType,

  appliedDate:
    new Date().toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    ),

  status: 'Applied' as const,

  /*
   * Save exactly what the candidate
   * submitted with this application.
   */
  submittedProfile: {
    ...profile,

    /*
     * Use edited skills if the candidate
     * changed them on the Apply page.
     */
    skills: skillsValue,

    /*
     * Use newly uploaded resume if provided.
     */
    resume: finalResume,
  },

}


    /* =====================================================
       ADD APPLICATION TO REDUX
    ===================================================== */

    dispatch(
      addApplication(application)
    )


    /* =====================================================
       SUCCESS STATE
    ===================================================== */

    setSubmitted(true)
  }


  /* =======================================================
     LOADING JOB
  ======================================================= */

  if (loadingJob) {
    return (
      <main className="bs-apply-page">
        <CareerSidebar />
        <section className="bs-apply-not-found">
          <div className="bs-apply-not-found-icon">
            <BriefcaseBusiness size={28} strokeWidth={1.7} />
          </div>
          <h1>Loading Job</h1>
          <p>Please wait while we load the latest job details.</p>
        </section>
      </main>
    )
  }

  /* =======================================================
     JOB NOT FOUND
  ======================================================= */

  if (!job) {

    return (
      <main className="bs-apply-page">

        <CareerSidebar />

        <section className="bs-apply-not-found">

          <div className="bs-apply-not-found-icon">

            <BriefcaseBusiness
              size={28}
              strokeWidth={1.7}
            />

          </div>

          <h1>
            Job Not Found
          </h1>

          <p>
            The job you are trying to apply
            for could not be found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/jobs')
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
     SUCCESS SCREEN
  ======================================================= */

  if (submitted || alreadyApplied) {

    return (
      <main className="bs-apply-page">

        <CareerSidebar />

        <section className="bs-apply-content">

          <div className="bs-apply-success">

            <div className="bs-apply-success-icon">

              <CheckCircle2
                size={42}
                strokeWidth={1.6}
              />

            </div>

            <span className="bs-apply-success-label">
              {alreadyApplied && !submitted
                ? 'ALREADY APPLIED'
                : 'APPLICATION SUBMITTED'}
            </span>

            <h1>
              {alreadyApplied && !submitted
                ? 'Already Applied'
                : 'Application Submitted'}
            </h1>

            <p>
              {alreadyApplied && !submitted
                ? 'You have already applied for this position.'
                : 'Your application has been successfully submitted for this position.'}
            </p>

            <div className="bs-apply-success-job">

              <strong>
                {job.title}
              </strong>

              <span>
                {job.id}
              </span>

            </div>

            <div className="bs-apply-success-actions">

              <button
                type="button"
                className="bs-apply-primary-button"
                disabled
              >

                <CheckCircle2
                  size={16}
                  strokeWidth={1.9}
                />

                Already Applied

              </button>

              <button
                type="button"
                className="bs-apply-secondary-button"
                onClick={() =>
                  navigate('/applications')
                }
              >

                View My Applications

              </button>

            </div>

            <button
              type="button"
              className="bs-apply-back-link"
              onClick={() =>
                navigate('/jobs')
              }
            >

              <ArrowLeft
                size={15}
                strokeWidth={1.8}
              />

              Back to Jobs

            </button>

          </div>

        </section>

      </main>
    )
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <main className="bs-apply-page">

      <CareerSidebar />


      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="bs-apply-header">

        <div className="bs-apply-header-inner">

          <button
            type="button"
            className="bs-apply-back"
            onClick={() =>
              navigate(`/jobs/${encodeURIComponent(job.id)}`)
            }
          >

            <ArrowLeft
              size={16}
              strokeWidth={1.8}
            />

            <span>
              Back to Job
            </span>

          </button>

          <div className="bs-apply-brand">

            <img
              src="/Logo.webp"
              alt="Bharaat Structurals"
            />

          </div>

        </div>

      </header>


      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <section className="bs-apply-content">


        {/* =================================================
            PAGE HERO
        ================================================= */}

        <section className="bs-apply-hero">

          <div>

            <span>
              CAREER APPLICATION
            </span>

            <h1>
              Apply for this position
            </h1>

            <p>
              Review your profile information
              before submitting your application.
            </p>

          </div>

          <div className="bs-apply-hero-job">

            <BriefcaseBusiness
              size={25}
              strokeWidth={1.6}
            />

            <div>

              <strong>
                {job.title}
              </strong>

              <span>
                {job.id} · {job.department}
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            PROFILE VALIDATION / ERROR POPUP
        ================================================= */}

        {errorMessage && (

          <div
            className="bs-apply-popup-overlay"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setErrorMessage('')
              }
            }}
          >

            <div
              className="bs-apply-popup"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="bs-apply-popup-title"
              aria-describedby="bs-apply-popup-message"
              onMouseDown={(event) => {
                event.stopPropagation()
              }}
            >

              <div className="bs-apply-popup-header">

                <div className="bs-apply-popup-icon">

                  <AlertCircle
                    size={23}
                    strokeWidth={1.9}
                  />

                </div>

                <button
                  type="button"
                  className="bs-apply-popup-close"
                  aria-label="Close"
                  onClick={() => setErrorMessage('')}
                >

                  <X
                    size={18}
                    strokeWidth={1.9}
                  />

                </button>

              </div>


              <div className="bs-apply-popup-content">

                <h3 id="bs-apply-popup-title">
                  Please Complete Your Profile
                </h3>

                <p id="bs-apply-popup-message">
                  {errorMessage}
                </p>

              </div>


              <div className="bs-apply-popup-actions">

                <button
                  type="button"
                  className="bs-apply-popup-secondary-button"
                  onClick={() => setErrorMessage('')}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="bs-apply-popup-button"
                  onClick={() => {
                    setErrorMessage('')
                    navigate('/profile')
                  }}
                >
                  Go to Profile
                </button>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            JOB SUMMARY
        ================================================= */}

        <section className="bs-apply-section">

          <div className="bs-apply-section-heading">

            <div className="bs-apply-section-icon">

              <BriefcaseBusiness
                size={18}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <span>
                POSITION
              </span>

              <h2>
                Job Details
              </h2>

            </div>

          </div>


          <div className="bs-apply-job-grid">

            <div>

              <span>
                Job Title
              </span>

              <strong>
                {job.title}
              </strong>

            </div>

            <div>

              <span>
                Department
              </span>

              <strong>
                {job.department}
              </strong>

            </div>

            <div>

              <span>
                Location
              </span>

              <strong>

                <MapPin
                  size={13}
                  strokeWidth={1.8}
                />

                {job.location}

              </strong>

            </div>

            <div>

              <span>
                Experience
              </span>

              <strong>
                {job.experience}
              </strong>

            </div>

            <div>

              <span>
                Employment
              </span>

              <strong>
                {job.employmentType}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <section className="bs-apply-section">

          <div className="bs-apply-section-heading">

            <div className="bs-apply-section-icon">

              <User
                size={18}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <span>
                PROFILE
              </span>

              <h2>
                Personal Information
              </h2>

            </div>

          </div>


          <div className="bs-apply-profile-grid">

            <div className="bs-apply-field">

              <span>
                First Name
              </span>

              <strong>
                {profile.firstName || 'Not provided'}
              </strong>

            </div>

            <div className="bs-apply-field">

              <span>
                Last Name
              </span>

              <strong>
                {profile.lastName || 'Not provided'}
              </strong>

            </div>

            <div className="bs-apply-field">

              <span>
                Email
              </span>

              <strong>
                {profile.email || 'Not provided'}
              </strong>

            </div>

            <div className="bs-apply-field">

              <span>
                Phone
              </span>

              <strong>
                {profile.phone || 'Not provided'}
              </strong>

            </div>

            <div className="bs-apply-field">

              <span>
                Location
              </span>

              <strong>
                {profile.location || 'Not provided'}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            PROFESSIONAL INFORMATION
        ================================================= */}

        <section className="bs-apply-section">

          <div className="bs-apply-section-heading">

            <div className="bs-apply-section-icon">

              <BriefcaseBusiness
                size={18}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <span>
                EXPERIENCE
              </span>

              <h2>
                Professional Information
              </h2>

            </div>

          </div>


          <div className="bs-apply-profile-grid">

            <div className="bs-apply-field">

              <span>
                Experience
              </span>

              <strong>
                {profile.experience || 'Not provided'}
              </strong>

            </div>

            <div className="bs-apply-field">

              <span>
                Current Company
              </span>

              <strong>
                {profile.currentCompany || 'Not provided'}
              </strong>

            </div>


            <div className="bs-apply-field bs-apply-field-wide">

              <div className="bs-apply-field-title">

                <span>
                  Skills
                </span>

                {!editingSkills && (

                  <button
                    type="button"
                    className="bs-apply-edit-button"
                    onClick={handleEditSkills}
                  >

                    <Pencil
                      size={13}
                      strokeWidth={1.8}
                    />

                    Edit

                  </button>

                )}

              </div>


              {editingSkills ? (

                <div className="bs-apply-edit-box">

                  <textarea
                    value={skillsValue}
                    onChange={(event) =>
                      setSkillsValue(
                        event.target.value
                      )
                    }
                    placeholder="Enter your skills..."
                    rows={4}
                  />

                  <div className="bs-apply-edit-actions">

                    <button
                      type="button"
                      onClick={
                        handleSaveSkills
                      }
                    >

                      <Save
                        size={14}
                        strokeWidth={1.8}
                      />

                      Save

                    </button>

                    <button
                      type="button"
                      onClick={
                        handleCancelSkills
                      }
                    >

                      <X
                        size={14}
                        strokeWidth={1.8}
                      />

                      Cancel

                    </button>

                  </div>

                </div>

              ) : (

                <strong>
                  {profile.skills ||
                    'No skills added'}
                </strong>

              )}

            </div>


            <div className="bs-apply-field">

              <span>
                LinkedIn
              </span>

              <strong>
                {profile.linkedin ||
                  'Not provided'}
              </strong>

            </div>


            <div className="bs-apply-field">

              <span>
                Portfolio
              </span>

              <strong>
                {profile.portfolio ||
                  'Not provided'}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            EDUCATION
        ================================================= */}

        <section className="bs-apply-section">

          <div className="bs-apply-section-heading">

            <div className="bs-apply-section-icon">

              <GraduationCap
                size={19}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <span>
                EDUCATION
              </span>

              <h2>
                Education Information
              </h2>

            </div>

          </div>


          <div className="bs-apply-education-grid">


            {/* 10TH */}

            <div className="bs-apply-education-card">

              <div className="bs-apply-education-title">

                <span>
                  10TH STANDARD
                </span>

              </div>


              <div className="bs-apply-education-row">

                <span>
                  School
                </span>

                <strong>
                  {profile.tenthSchoolName ||
                    'Not provided'}
                </strong>

              </div>


              <div className="bs-apply-education-row">

                <span>
                  State / UT
                </span>

                <strong>
                  {profile.tenthState ||
                    'Not provided'}
                </strong>

              </div>


              <div className="bs-apply-education-row">

                <span>
                  Percentage
                </span>

                <strong>
                  {profile.tenthPercentage
                    ? `${profile.tenthPercentage}%`
                    : 'Not provided'}
                </strong>

              </div>

            </div>


            {/* 12TH */}

            <div className="bs-apply-education-card">

              <div className="bs-apply-education-title">

                <span>
                  12TH STANDARD
                </span>

              </div>


              <div className="bs-apply-education-row">

                <span>
                  Board
                </span>

                <strong>
                  {profile.twelfthBoard ||
                    'Not provided'}
                </strong>

              </div>


              <div className="bs-apply-education-row">

                <span>
                  Percentage
                </span>

                <strong>
                  {profile.twelfthPercentage
                    ? `${profile.twelfthPercentage}%`
                    : 'Not provided'}
                </strong>

              </div>

            </div>


            {/* HIGHER EDUCATION */}

            <div className="bs-apply-education-card">

              <div className="bs-apply-education-title">

                <span>
                  HIGHER EDUCATION
                </span>

              </div>


              <div className="bs-apply-education-row">

                <span>
                  Qualification
                </span>

                <strong>
                  {profile.highestQualification ||
                    'Not provided'}
                </strong>

              </div>


              <div className="bs-apply-education-row">

                <span>
                  College
                </span>

                <strong>
                  {profile.collegeName ||
                    'Not provided'}
                </strong>

              </div>


              <div className="bs-apply-education-row">

                <span>
                  State / UT
                </span>

                <strong>
                  {profile.collegeState ||
                    'Not provided'}
                </strong>

              </div>


              <div className="bs-apply-education-row">

                <span>
                  Percentage
                </span>

                <strong>
                  {profile.qualificationPercentage
                    ? `${profile.qualificationPercentage}%`
                    : 'Not provided'}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            RESUME
        ================================================= */}

        <section className="bs-apply-section">

          <div className="bs-apply-section-heading">

            <div className="bs-apply-section-icon">

              <FileText
                size={18}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <span>
                DOCUMENT
              </span>

              <h2>
                Resume
              </h2>

            </div>

          </div>


          <div className="bs-apply-resume-box">

            <div className="bs-apply-resume-current">

              <div className="bs-apply-resume-icon">

                <FileText
                  size={20}
                  strokeWidth={1.8}
                />

              </div>


              <div>

                <span>
                  Current Resume
                </span>

                <strong>
                  {newResume ||
                    profile.resume ||
                    'No resume uploaded'}
                </strong>

              </div>

            </div>


            <label
              className="bs-apply-upload-button"
            >

              <Upload
                size={15}
                strokeWidth={1.8}
              />

              Upload New Resume

              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={
                  handleResumeChange
                }
              />

            </label>

          </div>


          <p className="bs-apply-resume-note">
            Optional — you can upload a new
            PDF resume specifically for this
            application.
          </p>

        </section>


        {/* =================================================
            FINAL APPLICATION
        ================================================= */}

        <section className="bs-apply-submit-card">

          <div>

            <span>
              READY TO SUBMIT?
            </span>

            <h2>
              Review your information
              and submit your application.
            </h2>

            <p>
              Your profile information and
              resume will be used for this
              application.
            </p>

          </div>


          <button
            type="button"
            className="bs-apply-submit-button"
            onClick={
              handleSubmitApplication
            }
            disabled={alreadyApplied}
          >

            {alreadyApplied ? (

              <>
                <CheckCircle2
                  size={17}
                  strokeWidth={1.9}
                />

                Already Applied
              </>

            ) : (

              <>
                <Send
                  size={17}
                  strokeWidth={1.9}
                />

                Submit Application
              </>

            )}

          </button>

        </section>

      </section>

    </main>
  )
}