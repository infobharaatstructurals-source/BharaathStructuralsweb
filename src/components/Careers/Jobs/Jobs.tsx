import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'

import CareerSidebar from '../CareerSidebar/CareerSidebar'

import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '../../../app/store'
import { setJobs, type Job } from '../../../features/jobs/jobsSlice'
import { loginSuccess } from '../../../features/auth/authSlice'

import './Jobs.css'


/* =========================================================
   JOBS PAGE
========================================================= */


export default function Jobs() {

  const navigate = useNavigate()

  const dispatch =
    useDispatch<AppDispatch>()

  const jobs = useSelector(
    (state: RootState) =>
      state.jobs.jobs
  )

  const user = useSelector(
    (state: RootState) =>
      state.auth.user
  )

  const userRole = user?.role ?? 'candidate'
  const canManageJobs =
    userRole === 'hr' || userRole === 'admin'

  const [loading, setLoading] =
    useState(true)

  const [loadError, setLoadError] =
    useState('')

  /* =======================================================
     LOAD JOBS FROM BACKEND
  ======================================================= */

  useEffect(() => {
    let isMounted = true

    const loadJobs = async () => {
      try {
        setLoading(true)
        setLoadError('')

        const response = await fetch(
          'http://localhost:5000/api/jobs',
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data?.message ||
              'Unable to load jobs.'
          )
        }

        if (!Array.isArray(data?.jobs)) {
          throw new Error(
            'Invalid jobs response from server.'
          )
        }

        if (isMounted) {
          dispatch(setJobs(data.jobs))
        }
      } catch (error) {
        console.error(
          'Load jobs error:',
          error
        )

        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Unable to load jobs.'
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadJobs()

    return () => {
      isMounted = false
    }
  }, [dispatch])



  /* =======================================================
     JOB MANAGEMENT STATE
  ======================================================= */

  type JobModalMode = 'create' | 'edit' | null

  interface JobFormState {
    id: string
    title: string
    location: string
    employmentType: string
    experience: string
    department: string
    description: string
    postedDate: string
  }

  const getToday = () =>
    new Date().toISOString().split('T')[0]

  const emptyJobForm = (): JobFormState => ({
    id: '',
    title: '',
    location: 'Bengaluru',
    employmentType: 'Full Time',
    experience: '0–2 Years',
    department: 'Engineering',
    description: '',
    postedDate: getToday(),
  })

  const [jobModal, setJobModal] =
    useState<JobModalMode>(null)

  const [jobForm, setJobForm] =
    useState<JobFormState>(emptyJobForm())

  const [savingJob, setSavingJob] =
    useState(false)

  const [deletingJob, setDeletingJob] =
    useState<Job | null>(null)

  const [deleting, setDeleting] =
    useState(false)

  const [notice, setNotice] =
    useState<{
      type: 'success' | 'error'
      message: string
    } | null>(null)

  /* Restore the authenticated user after a page refresh. */
  useEffect(() => {
    if (user) return

    let cancelled = false

    const restoreUser = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/auth/me',
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (!response.ok) return

        const data = await response.json()
        const currentUser =
          data?.user || data?.data?.user

        if (!currentUser || cancelled) return

        dispatch(
          loginSuccess({
            id: String(
              currentUser.id ||
              currentUser.userId ||
              ''
            ),
            firstName:
              currentUser.firstName ||
              currentUser.first_name ||
              '',
            lastName:
              currentUser.lastName ||
              currentUser.last_name ||
              '',
            email:
              currentUser.email ||
              '',
            phone:
              currentUser.phone ||
              '',
            role:
              currentUser.role ||
              'candidate',
          })
        )
      } catch (error) {
        console.error(
          'Restore current user error:',
          error
        )
      }
    }

    restoreUser()

    return () => {
      cancelled = true
    }
  }, [dispatch, user])

  const showNotice = (
    type: 'success' | 'error',
    message: string
  ) => {
    setNotice({ type, message })

    window.setTimeout(() => {
      setNotice(null)
    }, 3200)
  }

  const openCreateJob = () => {
    if (!canManageJobs) return
    setNotice(null)
    setJobForm(emptyJobForm())
    setJobModal('create')
  }

  const openEditJob = (job: Job) => {
    if (!canManageJobs) return

    setNotice(null)

    setJobForm({
      id: job.id,
      title: job.title,
      location: job.location,
      employmentType: job.employmentType,
      experience: job.experience,
      department: job.department,
      description: job.description,
      postedDate: job.postedDate,
    })

    setJobModal('edit')
  }

  const closeJobModal = () => {
    if (savingJob) return
    setJobModal(null)
    setJobForm(emptyJobForm())
  }

  const handleJobFormChange = (
    field: keyof JobFormState,
    value: string
  ) => {
    setJobForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmitJob = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!canManageJobs || savingJob) return

    const title = jobForm.title.trim()
    const location = jobForm.location.trim()
    const experience = jobForm.experience.trim()
    const department = jobForm.department.trim()
    const description = jobForm.description.trim()

    if (
      !title ||
      !location ||
      !jobForm.employmentType ||
      !experience ||
      !department ||
      !description ||
      !jobForm.postedDate
    ) {
      showNotice(
        'error',
        'Please fill in all required job fields.'
      )
      return
    }

    setSavingJob(true)

    try {
      const editing = jobModal === 'edit'

      const response = await fetch(
        editing
          ? `http://localhost:5000/api/jobs/${jobForm.id}`
          : 'http://localhost:5000/api/jobs',
        {
          method: editing ? 'PUT' : 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...(editing
              ? {}
              : {
                  id:
                    jobForm.id.trim() ||
                    undefined,
                }),
            title,
            location,
            employmentType:
              jobForm.employmentType,
            experience,
            department,
            description,
            postedDate:
              jobForm.postedDate,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
            (editing
              ? 'Unable to update job.'
              : 'Unable to create job.')
        )
      }

      const savedJob =
        data?.job as Job | undefined

      if (savedJob) {
        if (editing) {
          dispatch(
            setJobs(
              jobs.map((job) =>
                job.id === savedJob.id
                  ? savedJob
                  : job
              )
            )
          )
        } else {
          dispatch(
            setJobs(
              [savedJob, ...jobs].sort(
                (a, b) =>
                  new Date(
                    `${b.postedDate}T00:00:00`
                  ).getTime() -
                  new Date(
                    `${a.postedDate}T00:00:00`
                  ).getTime()
              )
            )
          )
        }
      }

      setJobModal(null)
      setJobForm(emptyJobForm())

      showNotice(
        'success',
        editing
          ? 'Job updated successfully.'
          : 'Job created successfully.'
      )
    } catch (error) {
      console.error(
        'Save job error:',
        error
      )

      showNotice(
        'error',
        error instanceof Error
          ? error.message
          : 'Unable to save the job.'
      )
    } finally {
      setSavingJob(false)
    }
  }

  const openDeleteJob = (job: Job) => {
    if (userRole !== 'admin') return
    setNotice(null)
    setDeletingJob(job)
  }

  const closeDeleteJob = () => {
    if (deleting) return
    setDeletingJob(null)
  }

  const handleDeleteJob = async () => {
    if (
      userRole !== 'admin' ||
      !deletingJob ||
      deleting
    ) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/${deletingJob.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Unable to delete job.'
        )
      }

      dispatch(
        setJobs(
          jobs.filter(
            (job) =>
              job.id !== deletingJob.id
          )
        )
      )

      setDeletingJob(null)

      showNotice(
        'success',
        'Job posting closed successfully.'
      )
    } catch (error) {
      console.error(
        'Delete job error:',
        error
      )

      showNotice(
        'error',
        error instanceof Error
          ? error.message
          : 'Unable to delete the job.'
      )
    } finally {
      setDeleting(false)
    }
  }

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [search, setSearch] =
    useState('')

  const [department, setDepartment] =
    useState('All')

  const [employmentType, setEmploymentType] =
    useState('All')


  /* =======================================================
     FILTER JOBS
  ======================================================= */

  const filteredJobs = useMemo(() => {

    const searchValue =
      search
        .trim()
        .toLowerCase()


    return jobs.filter((job) => {

      const matchesSearch =
        !searchValue ||
        job.title
          .toLowerCase()
          .includes(searchValue) ||
        job.department
          .toLowerCase()
          .includes(searchValue) ||
        job.location
          .toLowerCase()
          .includes(searchValue)


      const matchesDepartment =
        department === 'All' ||
        job.department === department


      const matchesEmploymentType =
        employmentType === 'All' ||
        job.employmentType ===
          employmentType


      return (
        matchesSearch &&
        matchesDepartment &&
        matchesEmploymentType
      )

    })

  }, [
    jobs,
    search,
    department,
    employmentType,
  ])


  /* =======================================================
     VIEW JOB
  ======================================================= */

  const handleViewJob = (
  jobId: string
) => {

  navigate(
    `/jobs/${encodeURIComponent(jobId)}`
  )

}


  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {

    setSearch('')
    setDepartment('All')
    setEmploymentType('All')

  }



  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="bs-jobs-page">


      {/* ===================================================
          CAREER SIDEBAR
      =================================================== */}

      <CareerSidebar />



      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <section className="bs-jobs-content">


        {/* =================================================
            HERO / INTRO
        ================================================= */}

        <section className="bs-jobs-intro">

          <div className="bs-jobs-intro-content">

            <span className="bs-jobs-eyebrow">
              CAREERS
            </span>

            <h1>
              Explore Opportunities
            </h1>

            <p>
              Find the right opportunity
              and take the next step in
              your career with Bharaat
              Structurals.
            </p>

          </div>


          {canManageJobs && (
            <button
              type="button"
              className="bs-jobs-manage-add"
              onClick={openCreateJob}
            >
              <Plus size={15} strokeWidth={2} />
              Add Job
            </button>
          )}


          {/* ===============================================
              HERO DECORATION
          =============================================== */}

          <div
            className="
              bs-jobs-intro-decoration
            "
          >

            <div
              className="
                bs-jobs-intro-circle
                bs-jobs-intro-circle-one
              "
            />

            <div
              className="
                bs-jobs-intro-circle
                bs-jobs-intro-circle-two
              "
            />

            <BriefcaseBusiness
              size={47}
              strokeWidth={1.35}
            />

          </div>


          {/* ===============================================
              JOB COUNT
          =============================================== */}

          <div
            className="
              bs-jobs-intro-count
            "
          >

            <strong>
              {filteredJobs.length}
            </strong>

            <span>
              {filteredJobs.length === 1
                ? 'Position'
                : 'Positions'}
            </span>

          </div>

        </section>


        {/* =================================================
            FILTERS
        ================================================= */}

        <section className="bs-jobs-filters">


          {/* Search */}

          <div className="bs-jobs-search">

            <Search
              size={17}
              strokeWidth={1.8}
            />

            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          {/* Department */}

          <select
            value={department}
            onChange={(event) =>
              setDepartment(
                event.target.value
              )
            }
            aria-label="Filter by department"
          >

            <option value="All">
              All Departments
            </option>

            <option value="Technology">
              Technology
            </option>

            <option value="Engineering">
              Engineering
            </option>

            <option value="Detailing">
              Detailing
            </option>

            <option value="Projects">
              Projects
            </option>

            <option value="BIM">
              BIM
            </option>

          </select>


          {/* Employment type */}

          <select
            value={employmentType}
            onChange={(event) =>
              setEmploymentType(
                event.target.value
              )
            }
            aria-label="Filter by employment type"
          >

            <option value="All">
              All Types
            </option>

            <option value="Full Time">
              Full Time
            </option>

            <option value="Part Time">
              Part Time
            </option>

            <option value="Internship">
              Internship
            </option>

          </select>

        </section>


        {/* =================================================
            JOB LIST
        ================================================= */}

        <section className="bs-jobs-list">


          {loading ? (

            <div className="bs-jobs-empty">

              <div
                className="
                  bs-jobs-empty-icon
                "
              >
                <BriefcaseBusiness
                  size={25}
                  strokeWidth={1.7}
                />
              </div>

              <h2>
                Loading jobs
              </h2>

              <p>
                Please wait while we load the
                latest opportunities.
              </p>

            </div>

          ) : loadError ? (

            <div className="bs-jobs-empty">

              <div
                className="
                  bs-jobs-empty-icon
                "
              >
                <BriefcaseBusiness
                  size={25}
                  strokeWidth={1.7}
                />
              </div>

              <h2>
                Unable to load jobs
              </h2>

              <p>
                {loadError}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>

            </div>

          ) : filteredJobs.length === 0 ? (

            /* =============================================
               EMPTY STATE
            ============================================= */

            <div className="bs-jobs-empty">

              <div
                className="
                  bs-jobs-empty-icon
                "
              >

                <BriefcaseBusiness
                  size={25}
                  strokeWidth={1.7}
                />

              </div>


              <h2>
                No jobs found
              </h2>


              <p>
                Try changing your search
                or filter options.
              </p>


              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          ) : (

            /* =============================================
               JOB CARDS
            ============================================= */

            filteredJobs.map((job) => (

              <article
                className="bs-job-card"
                key={job.id}
              >


                {/* =========================================
                    CARD MAIN
                ========================================= */}

                <div className="bs-job-card-main">


                  {/* Icon */}

                  <div className="bs-job-icon">

                    <BriefcaseBusiness
                      size={22}
                      strokeWidth={1.7}
                    />

                  </div>


                  {/* Information */}

                  <div className="bs-job-information">


                    {/* Title row */}

                    <div
                      className="
                        bs-job-title-row
                      "
                    >

                      <div>

                        <span
                          className="
                            bs-job-code
                          "
                        >
                          {job.id}
                        </span>

                        <h2>
                          {job.title}
                        </h2>

                      </div>


                      <span
                        className="
                          bs-job-type
                        "
                      >
                        {job.employmentType}
                      </span>

                    </div>


                    {/* Description */}

                    <p
                      className="
                        bs-job-description
                      "
                    >
                      {job.description}
                    </p>


                    {/* Metadata */}

                    <div
                      className="
                        bs-job-meta
                      "
                    >

                      <span>

                        <MapPin
                          size={14}
                          strokeWidth={1.8}
                        />

                        {job.location}

                      </span>


                      <span>

                        <Clock3
                          size={14}
                          strokeWidth={1.8}
                        />

                        {job.experience}

                      </span>


                      <span>

                        <BriefcaseBusiness
                          size={14}
                          strokeWidth={1.8}
                        />

                        {job.department}

                      </span>

                    </div>

                  </div>

                </div>


                {/* =========================================
                    CARD BOTTOM
                ========================================= */}

                <div
                  className="
                    bs-job-card-bottom
                  "
                >

                  <span
                    className="
                      bs-job-posted
                    "
                  >
                    Posted{' '}
                    {new Date(
                      `${job.postedDate}T00:00:00`
                    ).toLocaleDateString(
                      'en-GB',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}
                  </span>


                  <div className="bs-job-actions">
                    {canManageJobs && (
                      <button
                        type="button"
                        className="bs-job-action-button bs-job-action-edit"
                        onClick={() => openEditJob(job)}
                        title="Edit job"
                      >
                        <Pencil size={14} strokeWidth={1.8} />
                        Edit
                      </button>
                    )}

                    {userRole === 'admin' && (
                      <button
                        type="button"
                        className="bs-job-action-button bs-job-action-delete"
                        onClick={() => openDeleteJob(job)}
                        title="Delete job"
                      >
                        <Trash2 size={14} strokeWidth={1.8} />
                        Delete
                      </button>
                    )}

                    <button
                      type="button"
                      className="bs-job-view-button"
                      onClick={() =>
                        handleViewJob(
                          job.id
                        )
                      }
                    >
                      View Job

                      <ArrowRight
                        size={16}
                        strokeWidth={1.8}
                      />
                    </button>
                  </div>

                </div>

              </article>

            ))

          )}

        </section>

      </section>


      {/* =================================================
          SUCCESS / ERROR NOTICE
      ================================================= */}

      {notice && (
        <div
          className={`bs-jobs-notice bs-jobs-notice-${notice.type}`}
          role="status"
        >
          <span className="bs-jobs-notice-dot" />
          <span>{notice.message}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* =================================================
          ADD / EDIT JOB MODAL
      ================================================= */}

      {jobModal && (
        <div
          className="bs-jobs-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeJobModal()
            }
          }}
        >
          <section
            className="bs-jobs-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bs-job-modal-title"
          >
            <div className="bs-jobs-modal-header">
              <div>
                <span className="bs-jobs-modal-eyebrow">
                  {jobModal === 'edit'
                    ? 'JOB MANAGEMENT'
                    : 'NEW OPPORTUNITY'}
                </span>

                <h2 id="bs-job-modal-title">
                  {jobModal === 'edit'
                    ? 'Edit Job'
                    : 'Add New Job'}
                </h2>

                <p>
                  {jobModal === 'edit'
                    ? 'Update the job details and save your changes.'
                    : 'Create a new opportunity for candidates.'}
                </p>
              </div>

              <button
                type="button"
                className="bs-jobs-modal-close"
                onClick={closeJobModal}
                disabled={savingJob}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              className="bs-jobs-modal-form"
              onSubmit={handleSubmitJob}
            >
              <div className="bs-jobs-form-grid">
                <label>
                  <span>
                    Job Title <b>*</b>
                  </span>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(event) =>
                      handleJobFormChange(
                        'title',
                        event.target.value
                      )
                    }
                    placeholder="e.g. Software Engineer"
                    autoFocus
                    required
                  />
                </label>

                <label>
                  <span>
                    Location <b>*</b>
                  </span>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(event) =>
                      handleJobFormChange(
                        'location',
                        event.target.value
                      )
                    }
                    placeholder="e.g. Bengaluru"
                    required
                  />
                </label>

                <label>
                  <span>
                    Employment Type <b>*</b>
                  </span>
                  <select
                    value={jobForm.employmentType}
                    onChange={(event) =>
                      handleJobFormChange(
                        'employmentType',
                        event.target.value
                      )
                    }
                    required
                  >
                    <option value="Full Time">
                      Full Time
                    </option>
                    <option value="Part Time">
                      Part Time
                    </option>
                    <option value="Internship">
                      Internship
                    </option>
                    <option value="Contract">
                      Contract
                    </option>
                  </select>
                </label>

                <label>
                  <span>
                    Experience <b>*</b>
                  </span>
                  <input
                    type="text"
                    value={jobForm.experience}
                    onChange={(event) =>
                      handleJobFormChange(
                        'experience',
                        event.target.value
                      )
                    }
                    placeholder="e.g. 1–3 Years"
                    required
                  />
                </label>

                <label>
                  <span>
                    Department <b>*</b>
                  </span>
                  <select
                    value={jobForm.department}
                    onChange={(event) =>
                      handleJobFormChange(
                        'department',
                        event.target.value
                      )
                    }
                    required
                  >
                    <option value="Engineering">
                      Engineering
                    </option>
                    <option value="Technology">
                      Technology
                    </option>
                    <option value="Detailing">
                      Detailing
                    </option>
                    <option value="Projects">
                      Projects
                    </option>
                    <option value="BIM">
                      BIM
                    </option>
                    <option value="HR">
                      HR
                    </option>
                    <option value="Finance">
                      Finance
                    </option>
                    <option value="Operations">
                      Operations
                    </option>
                  </select>
                </label>

                <label>
                  <span>
                    Posted Date <b>*</b>
                  </span>
                  <input
                    type="date"
                    value={jobForm.postedDate}
                    onChange={(event) =>
                      handleJobFormChange(
                        'postedDate',
                        event.target.value
                      )
                    }
                    required
                  />
                </label>

                {jobModal === 'create' && (
                  <label>
                    <span>
                      Job Code
                      <small> Optional</small>
                    </span>
                    <input
                      type="text"
                      value={jobForm.id}
                      onChange={(event) =>
                        handleJobFormChange(
                          'id',
                          event.target.value
                        )
                      }
                      placeholder="e.g. BS-007"
                    />
                  </label>
                )}
              </div>

              <label className="bs-jobs-form-full">
                <span>
                  Job Description <b>*</b>
                </span>
                <textarea
                  value={jobForm.description}
                  onChange={(event) =>
                    handleJobFormChange(
                      'description',
                      event.target.value
                    )
                  }
                  placeholder="Describe the role, responsibilities and expectations..."
                  rows={6}
                  required
                />
              </label>

              <div className="bs-jobs-modal-footer">
                <button
                  type="button"
                  className="bs-jobs-modal-cancel"
                  onClick={closeJobModal}
                  disabled={savingJob}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bs-jobs-modal-submit"
                  disabled={savingJob}
                >
                  {savingJob ? (
                    <>
                      <span className="bs-jobs-spinner" />
                      Saving...
                    </>
                  ) : (
                    jobModal === 'edit'
                      ? 'Save Changes'
                      : 'Create Job'
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* =================================================
          DELETE CONFIRMATION
      ================================================= */}

      {deletingJob && (
        <div
          className="bs-jobs-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeDeleteJob()
            }
          }}
        >
          <section
            className="bs-jobs-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bs-delete-job-title"
          >
            <div className="bs-jobs-confirm-icon">
              <Trash2
                size={22}
                strokeWidth={1.8}
              />
            </div>

            <span className="bs-jobs-modal-eyebrow">
              ADMIN ACTION
            </span>

            <h2 id="bs-delete-job-title">
              Close this job posting?
            </h2>

            <p>
              <strong>
                {deletingJob.title}
              </strong>
              {' '}will be removed from the active
              job list. Existing application records
              are preserved.
            </p>

            <div className="bs-jobs-confirm-actions">
              <button
                type="button"
                className="bs-jobs-modal-cancel"
                onClick={closeDeleteJob}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="bs-jobs-delete-confirm"
                onClick={handleDeleteJob}
                disabled={deleting}
              >
                {deleting
                  ? 'Closing...'
                  : 'Close Job'}
              </button>
            </div>
          </section>
        </div>
      )}

    </main>
  )
}