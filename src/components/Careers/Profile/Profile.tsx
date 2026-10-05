import {
  useEffect,
  useState,
} from 'react'
import type { ChangeEvent } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import type {
  AppDispatch,
  RootState,
} from '../../../app/store'

import {
  setProfile,
  type ProfileData,
} from '../../../features/profile/profileSlice'

import {
  BriefcaseBusiness,
  Check,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  UserRound,
} from 'lucide-react'

import CareerSidebar from '../CareerSidebar/CareerSidebar'

import './Profile.css'


/* ============================================================
   INDIAN STATES / UNION TERRITORIES
============================================================ */

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const


/* ============================================================
   PROFILE ERROR TYPE
============================================================ */

type ProfileErrors = Partial<
  Record<
    keyof ProfileData,
    string
  >
>


/* ============================================================
   REQUIRED PERSONAL INFORMATION
============================================================ */

const REQUIRED_PERSONAL_FIELDS: Array<
  keyof ProfileData
> = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'location',
]


/* ============================================================
   REQUIRED PROFESSIONAL INFORMATION
   Portfolio is intentionally NOT included.
============================================================ */

const REQUIRED_PROFESSIONAL_FIELDS: Array<
  keyof ProfileData
> = [
  'experience',
  'currentCompany',
  'skills',
  'linkedin',
]


/* ============================================================
   REQUIRED EDUCATION INFORMATION
============================================================ */

const REQUIRED_EDUCATION_FIELDS: Array<
  keyof ProfileData
> = [
  'tenthSchoolName',
  'tenthState',
  'tenthPercentage',
  'twelfthBoard',
  'twelfthPercentage',
  'highestQualification',
  'collegeName',
  'collegeState',
  'qualificationPercentage',
]


/* ============================================================
   PERCENTAGE VALIDATION
============================================================ */

function isValidPercentage(
  value: string,
): boolean {
  const number = Number(value)

  return (
    value.trim() !== '' &&
    Number.isFinite(number) &&
    number >= 0 &&
    number <= 100
  )
}


/* ============================================================
   PROFILE COMPONENT
============================================================ */

export default function Profile() {
  const navigate = useNavigate()

  const dispatch =
    useDispatch<AppDispatch>()

  const profile = useSelector(
    (state: RootState) =>
      state.profile.profile,
  )

  const [
    isEditing,
    setIsEditing,
  ] = useState(false)

  const [
    saved,
    setSaved,
  ] = useState(false)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    errors,
    setErrors,
  ] = useState<ProfileErrors>({})

  const [
    originalProfile,
    setOriginalProfile,
  ] = useState<ProfileData>(profile)

  /* ==========================================================
     LOAD PROFILE FROM BACKEND
  ========================================================== */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)

        const response = await fetch(
          'http://localhost:5000/api/profile',
          {
            method: 'GET',
            credentials: 'include',
          },
        )

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login')
            return
          }

          throw new Error(
            data.message ||
              'Unable to load profile.',
          )
        }

        if (
          data.success &&
          data.profile
        ) {
          dispatch(
            setProfile(data.profile),
          )

          setOriginalProfile(
            data.profile,
          )
        }
      } catch (error) {
        console.error(
          'Profile loading error:',
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [dispatch, navigate])

  /* ==========================================================
     HANDLE PROFILE FIELD CHANGE
  ========================================================== */

  const handleChange = (
    field: keyof ProfileData,
    value: string,
  ) => {
    dispatch(
      setProfile({
        ...profile,
        [field]: value,
      }),
    )

    setSaved(false)

    setErrors((previous) => {
      if (!previous[field]) {
        return previous
      }

      const next = {
        ...previous,
      }

      delete next[field]

      return next
    })
  }


  /* ==========================================================
     VALIDATE PROFILE
  ========================================================== */

  const validateProfile =
    (): ProfileErrors => {
      const nextErrors: ProfileErrors = {}


      /* ------------------------------------------------------
         PERSONAL INFORMATION
      ------------------------------------------------------ */

      REQUIRED_PERSONAL_FIELDS.forEach(
        (field) => {
          if (!profile[field].trim()) {
            const labels: Record<
              string,
              string
            > = {
              firstName:
                'First Name',

              lastName:
                'Last Name',

              email:
                'Email Address',

              phone:
                'Phone Number',

              location:
                'Location',
            }

            nextErrors[field] =
              `${labels[field]} is required.`
          }
        },
      )


      /* ------------------------------------------------------
         PROFESSIONAL INFORMATION
      ------------------------------------------------------ */

      REQUIRED_PROFESSIONAL_FIELDS.forEach(
        (field) => {
          if (!profile[field].trim()) {
            const labels: Record<
              string,
              string
            > = {
              experience:
                'Experience',

              currentCompany:
                'Current Company',

              skills:
                'Skills',

              linkedin:
                'LinkedIn Profile',
            }


            if (
              field ===
                'currentCompany' &&
              profile.experience ===
                'Fresher'
            ) {
              nextErrors[field] =
                'If you are a Fresher, please enter "Fresher".'
            } else {
              nextErrors[field] =
                `${labels[field]} is required.`
            }
          }
        },
      )


      /* ------------------------------------------------------
         FRESHER CURRENT COMPANY CHECK
      ------------------------------------------------------ */

      if (
        profile.experience ===
          'Fresher' &&
        profile.currentCompany
          .trim()
          .toLowerCase() !==
          'fresher'
      ) {
        nextErrors.currentCompany =
          'For Fresher, please enter "Fresher" in Current Company.'
      }


      /* ------------------------------------------------------
         EDUCATION INFORMATION
      ------------------------------------------------------ */

      REQUIRED_EDUCATION_FIELDS.forEach(
        (field) => {
          if (!profile[field].trim()) {
            const labels: Record<
              string,
              string
            > = {
              tenthSchoolName:
                '10th School Name',

              tenthState:
                '10th State',

              tenthPercentage:
                '10th Percentage',

              twelfthBoard:
                '12th Board',

              twelfthPercentage:
                '12th Percentage',

              highestQualification:
                'Highest Qualification / Degree',

              collegeName:
                'College Name',

              collegeState:
                'College State',

              qualificationPercentage:
                'Qualification Percentage',
            }

            nextErrors[field] =
              `${labels[field]} is required.`
          }
        },
      )


      /* ------------------------------------------------------
         PERCENTAGE VALIDATION
      ------------------------------------------------------ */

      const percentageFields: Array<{
        field:
          | 'tenthPercentage'
          | 'twelfthPercentage'
          | 'qualificationPercentage'

        label: string
      }> = [
        {
          field:
            'tenthPercentage',

          label:
            '10th Percentage',
        },

        {
          field:
            'twelfthPercentage',

          label:
            '12th Percentage',
        },

        {
          field:
            'qualificationPercentage',

          label:
            'Qualification Percentage',
        },
      ]


      percentageFields.forEach(
        ({
          field,
          label,
        }) => {
          if (
            !profile[field].trim()
          ) {
            return
          }

          if (
            !isValidPercentage(
              profile[field],
            )
          ) {
            nextErrors[field] =
              `${label} must be between 0 and 100.`
          }
        },
      )


      /* ------------------------------------------------------
         LINKEDIN VALIDATION
      ------------------------------------------------------ */

      if (
        profile.linkedin.trim()
      ) {
        try {
          const linkedinUrl =
            new URL(
              profile.linkedin.trim(),
            )

          if (
            !linkedinUrl.protocol.startsWith(
              'http',
            )
          ) {
            nextErrors.linkedin =
              'Enter a valid LinkedIn URL.'
          }
        } catch {
          nextErrors.linkedin =
            'Enter a valid LinkedIn URL.'
        }
      }


      /* ------------------------------------------------------
         RESUME VALIDATION
         
         Resume is mandatory and PDF only.
      ------------------------------------------------------ */

      if (
        !profile.resume.trim()
      ) {
        nextErrors.resume =
          'Resume is required. Please upload a PDF resume.'
      } else if (
        !profile.resume
          .toLowerCase()
          .endsWith('.pdf')
      ) {
        nextErrors.resume =
          'Resume must be in PDF format.'
      }


      return nextErrors
    }


  /* ==========================================================
     SAVE PROFILE
  ========================================================== */

  const handleSave = async () => {
    const nextErrors =
      validateProfile()

    setErrors(nextErrors)

    if (
      Object.keys(nextErrors)
        .length > 0
    ) {
      setSaved(false)
      return
    }

    try {
      setSaving(true)
      setSaved(false)

      const response = await fetch(
        'http://localhost:5000/api/profile',
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(
            profile,
          ),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login')
          return
        }

        throw new Error(
          data.message ||
            'Unable to save profile.',
        )
      }

      if (
        data.success &&
        data.profile
      ) {
        dispatch(
          setProfile(data.profile),
        )

        setOriginalProfile(
          data.profile,
        )

        setIsEditing(false)
        setErrors({})
        setSaved(true)

        window.setTimeout(() => {
          setSaved(false)
        }, 3000)
      }
    } catch (error) {
      console.error(
        'Profile save error:',
        error,
      )

      setErrors({
        email:
          error instanceof Error
            ? error.message
            : 'Unable to save profile.',
      })
    } finally {
      setSaving(false)
    }
  }


  /* ==========================================================
     CANCEL EDIT MODE
  ========================================================== */

  const handleCancel = () => {
    dispatch(
      setProfile(originalProfile),
    )

    setIsEditing(false)
    setErrors({})
    setSaved(false)
  }


  /* ==========================================================
     RESUME UPLOAD
     
     Only PDF files are accepted.
  ========================================================== */

  const handleResumeChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    const isPdf =
      file.type ===
        'application/pdf' ||
      file.name
        .toLowerCase()
        .endsWith('.pdf')

    if (!isPdf) {
      setErrors(
        (previous) => ({
          ...previous,

          resume:
            'Only PDF files are allowed for the resume.',
        }),
      )

      event.currentTarget.value =
        ''

      return
    }

    handleChange(
      'resume',
      file.name,
    )
  }


  /* ==========================================================
     BACK TO DASHBOARD
  ========================================================== */

  const handleBackToDashboard =
    () => {
      navigate('/dashboard')
    }


  /* ==========================================================
     FIELD CLASS
  ========================================================== */

  const fieldClass = (
    field: keyof typeof profile,
  ) =>
    errors[field]
      ? 'bs-profile-field bs-profile-field-error'
      : 'bs-profile-field'


  /* ==========================================================
     UI
  ========================================================== */

  if (loading) {
    return (
      <main className="bs-profile-page">
        <CareerSidebar />

        <section className="bs-profile-content">
          <section className="bs-profile-intro">
            <div className="bs-profile-intro-content">
              <span className="bs-profile-eyebrow">
                CANDIDATE PROFILE
              </span>

              <h1>
                My Profile
              </h1>

              <p>
                Loading your profile...
              </p>
            </div>
          </section>
        </section>
      </main>
    )
  }

  return (
    <main className="bs-profile-page">

      {/* ==================================================
          CAREER SIDEBAR
      ================================================== */}

      <CareerSidebar />


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <section className="bs-profile-content">


        {/* ==================================================
            INTRO / HEADER
        ================================================== */}

        <section className="bs-profile-intro">

          <div className="bs-profile-intro-content">

            <span className="bs-profile-eyebrow">
              CANDIDATE PROFILE
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your personal,
              professional, educational
              and resume information
              from one place.
            </p>

          </div>


          <div className="bs-profile-intro-decoration">

            <div
              className="
                bs-profile-intro-circle
                bs-profile-intro-circle-one
              "
            />

            <div
              className="
                bs-profile-intro-circle
                bs-profile-intro-circle-two
              "
            />

            <UserRound
              size={46}
              strokeWidth={1.35}
            />

          </div>


          {/* ==================================================
              HEADER ACTIONS
          ================================================== */}

          <div className="bs-profile-actions">

            {!isEditing ? (

              <button
                type="button"
                className="bs-profile-edit-button"
                onClick={() =>
                  setIsEditing(true)
                }
              >

                <Pencil
                  size={15}
                  strokeWidth={1.8}
                />

                Edit Profile

              </button>

            ) : (

              <div className="bs-profile-edit-actions">

                <button
                  type="button"
                  className="bs-profile-cancel-button"
                  onClick={
                    handleCancel
                  }
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="bs-profile-save-button"
                  onClick={
                    handleSave
                  }
                  disabled={saving}
                >

                  <Save
                    size={15}
                    strokeWidth={1.8}
                  />

                  {saving
                    ? 'Saving...'
                    : 'Save Changes'}

                </button>

              </div>

            )}

          </div>

        </section>


        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {saved && (

          <div className="bs-profile-success">

            <Check
              size={16}
              strokeWidth={2}
            />

            <span>
              Profile updated successfully.
            </span>

          </div>

        )}


        {/* ==================================================
            VALIDATION SUMMARY
        ================================================== */}

        {isEditing &&
          Object.keys(errors).length >
            0 && (

          <div
            className="
              bs-profile-validation-summary
            "
            role="alert"
          >

            <strong>
              Please complete the required fields.
            </strong>

            <span>
              Personal Information,
              Professional Information,
              Education Information
              and a PDF Resume are
              required. Portfolio is
              optional.
            </span>

          </div>

        )}


        {/* ==================================================
            PROFILE OVERVIEW
        ================================================== */}

        <section className="bs-profile-overview">

          <div className="bs-profile-avatar">
            {profile.firstName
              .charAt(0)
              .toUpperCase()}
          </div>


          <div className="bs-profile-overview-info">

            <h2>
              {profile.firstName}{' '}
              {profile.lastName}
            </h2>

            <p>
              {profile.email}
            </p>


            <div className="bs-profile-overview-meta">

              <span>

                <MapPin
                  size={13}
                  strokeWidth={1.8}
                />

                {profile.location ||
                  'Location not added'}

              </span>


              <span>

                <BriefcaseBusiness
                  size={13}
                  strokeWidth={1.8}
                />

                Candidate

              </span>

            </div>

          </div>


          {/* EMAIL VERIFIED */}

          <div className="bs-profile-verification">

            <span className="bs-profile-check">

              <Check
                size={13}
                strokeWidth={2}
              />

            </span>


            <div>

              <strong>
                Email Verified
              </strong>

              <span>
                Your email is verified
              </span>

            </div>

          </div>

        </section>


        {/* ==================================================
            PERSONAL INFORMATION
        ================================================== */}

        <section className="bs-profile-section">

          <div className="bs-profile-section-heading">

            <div className="bs-profile-section-icon">

              <UserRound
                size={18}
                strokeWidth={1.8}
              />

            </div>


            <div>

              <h3>
                Personal Information
              </h3>

              <p>
                All personal information
                is required.
              </p>

            </div>

          </div>


          <div className="bs-profile-form-grid">


            {/* FIRST NAME */}

            <div
              className={fieldClass(
                'firstName',
              )}
            >

              <label htmlFor="firstName">

                First Name

                <span className="bs-required-mark">
                  *
                </span>

              </label>


              <input
                id="firstName"
                type="text"
                value={
                  profile.firstName
                }
                disabled={!isEditing}
                aria-invalid={Boolean(
                  errors.firstName,
                )}
                onChange={(event) =>
                  handleChange(
                    'firstName',
                    event.target.value,
                  )
                }
              />


              {errors.firstName && (

                <small className="bs-profile-error-text">
                  {errors.firstName}
                </small>

              )}

            </div>


            {/* LAST NAME */}

            <div
              className={fieldClass(
                'lastName',
              )}
            >

              <label htmlFor="lastName">

                Last Name

                <span className="bs-required-mark">
                  *
                </span>

              </label>


              <input
                id="lastName"
                type="text"
                value={
                  profile.lastName
                }
                disabled={!isEditing}
                aria-invalid={Boolean(
                  errors.lastName,
                )}
                onChange={(event) =>
                  handleChange(
                    'lastName',
                    event.target.value,
                  )
                }
              />


              {errors.lastName && (

                <small className="bs-profile-error-text">
                  {errors.lastName}
                </small>

              )}

            </div>


            {/* EMAIL */}

            <div
              className={fieldClass(
                'email',
              )}
            >

              <label htmlFor="email">

                Email Address

                <span className="bs-required-mark">
                  *
                </span>

              </label>


              <div className="bs-profile-input-with-icon">

                <Mail
                  size={15}
                  strokeWidth={1.8}
                />

                <input
                  id="email"
                  type="email"
                  value={
                    profile.email
                  }
                  disabled
                  aria-invalid={Boolean(
                    errors.email,
                  )}
                  onChange={() => {}}
                />

              </div>


              <small>
                Email address cannot be
                changed here.
              </small>


              {errors.email && (

                <small className="bs-profile-error-text">
                  {errors.email}
                </small>

              )}

            </div>


            {/* PHONE */}

            <div
              className={fieldClass(
                'phone',
              )}
            >

              <label htmlFor="phone">

                Phone Number

                <span className="bs-required-mark">
                  *
                </span>

              </label>


              <div className="bs-profile-input-with-icon">

                <Phone
                  size={15}
                  strokeWidth={1.8}
                />

                <input
                  id="phone"
                  type="tel"
                  value={
                    profile.phone
                  }
                  disabled={!isEditing}
                  aria-invalid={Boolean(
                    errors.phone,
                  )}
                  onChange={(event) =>
                    handleChange(
                      'phone',
                      event.target.value,
                    )
                  }
                />

              </div>


              {errors.phone && (

                <small className="bs-profile-error-text">
                  {errors.phone}
                </small>

              )}

            </div>


            {/* LOCATION */}

            <div
              className={fieldClass(
                'location',
              )}
            >

              <label htmlFor="location">

                Location

                <span className="bs-required-mark">
                  *
                </span>

              </label>


              <div className="bs-profile-input-with-icon">

                <MapPin
                  size={15}
                  strokeWidth={1.8}
                />

                <input
                  id="location"
                  type="text"
                  value={
                    profile.location
                  }
                  disabled={!isEditing}
                  aria-invalid={Boolean(
                    errors.location,
                  )}
                  onChange={(event) =>
                    handleChange(
                      'location',
                      event.target.value,
                    )
                  }
                />

              </div>


              {errors.location && (

                <small className="bs-profile-error-text">
                  {errors.location}
                </small>

              )}

            </div>

          </div>

        </section>


        {/* ==================================================
            PROFESSIONAL INFORMATION
        ================================================== */}

        <section className="bs-profile-section">

          <div className="bs-profile-section-heading">

            <div className="bs-profile-section-icon">

              <BriefcaseBusiness
                size={18}
                strokeWidth={1.8}
              />

            </div>


            <div>

              <h3>
                Professional Information
              </h3>

              <p>
                All fields are required
                except Portfolio.
              </p>

            </div>

          </div>


          <div className="bs-profile-form-grid">


            {/* EXPERIENCE */}

            <div
              className={fieldClass(
                'experience',
              )}
            >

              <label htmlFor="experience">

                Experience

                <span className="bs-required-mark">
                  *
                </span>

              </label>


              <select
                id="experience"
                value={
                  profile.experience
                }
                disabled={!isEditing}
                aria-invalid={Boolean(
                  errors.experience,
                )}
                onChange={(event) =>
                  handleChange(
                    'experience',
                    event.target.value,
                  )
                }
              >

                <option value="Fresher">
                  Fresher
                </option>

                <option value="0–2 Years">
                  0–2 Years
                </option>

                <option value="2–5 Years">
                  2–5 Years
                </option>

                <option value="5–10 Years">
                  5–10 Years
                </option>

                <option value="10+ Years">
                  10+ Years
                </option>

              </select>


              {errors.experience && (

                <small className="bs-profile-error-text">
                  {errors.experience}
                </small>

              )}

            </div>


            {/* CURRENT COMPANY */}

            <div
              className={fieldClass(
                'currentCompany',
              )}
            >

              <label htmlFor="currentCompany">

                Current Company

                <span className="bs-required-mark">
                  *
                </span>

              </label>


              <input
                id="currentCompany"
                type="text"
                placeholder={
                  profile.experience ===
                  'Fresher'
                    ? 'Enter Fresher'
                    : 'Enter current company name'
                }
                value={
                  profile.currentCompany
                }
                disabled={!isEditing}
                aria-invalid={Boolean(
                  errors.currentCompany,
                )}
                onChange={(event) =>
                  handleChange(
                    'currentCompany',
                    event.target.value,
                  )
                }
              />


              <small>
                {profile.experience ===
                'Fresher'
                  ? 'If you are a Fresher, enter "Fresher" in this field.'
                  : 'Enter the name of your current company.'}
              </small>


              {errors.currentCompany && (

                <small className="bs-profile-error-text">
                  {errors.currentCompany}
                </small>

              )}

            </div>


            {/* SKILLS */}

            <div
              className={
                'bs-profile-full ' +
                fieldClass('skills')
              }
            >

              <label htmlFor="skills">

                Skills

                <span className="bs-required-mark">
                  *
                </span>

              </label>


              <textarea
                id="skills"
                rows={3}
                placeholder="React.js, Node.js, PostgreSQL..."
                value={
                  profile.skills
                }
                disabled={!isEditing}
                aria-invalid={Boolean(
                  errors.skills,
                )}
                onChange={(event) =>
                  handleChange(
                    'skills',
                    event.target.value,
                  )
                }
              />


              <small>
                Separate skills with
                commas.
              </small>


              {errors.skills && (

                <small className="bs-profile-error-text">
                  {errors.skills}
                </small>

              )}

            </div>


            {/* LINKEDIN */}

            <div
              className={fieldClass(
                'linkedin',
              )}
            >

              <label htmlFor="linkedin">

                LinkedIn Profile

                <span className="bs-required-mark">
                  *
                </span>

              </label>


              <input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={
                  profile.linkedin
                }
                disabled={!isEditing}
                aria-invalid={Boolean(
                  errors.linkedin,
                )}
                onChange={(event) =>
                  handleChange(
                    'linkedin',
                    event.target.value,
                  )
                }
              />


              {errors.linkedin && (

                <small className="bs-profile-error-text">
                  {errors.linkedin}
                </small>

              )}

            </div>


            {/* PORTFOLIO */}

            <div
              className={fieldClass(
                'portfolio',
              )}
            >

              <label htmlFor="portfolio">
                Portfolio
              </label>


              <input
                id="portfolio"
                type="url"
                placeholder="https://..."
                value={
                  profile.portfolio
                }
                disabled={!isEditing}
                onChange={(event) =>
                  handleChange(
                    'portfolio',
                    event.target.value,
                  )
                }
              />


              <small>
                Optional.
              </small>

            </div>

          </div>

        </section>


        {/* ==================================================
            EDUCATION INFORMATION
        ================================================== */}

        <section className="bs-profile-section">

          <div className="bs-profile-section-heading">

            <div className="bs-profile-section-icon">

              <GraduationCap
                size={18}
                strokeWidth={1.8}
              />

            </div>


            <div>

              <h3>
                Education Information
                <span className="bs-required-mark">
                  {' '}*
                </span>
              </h3>

              <p>
                All education information
                is required.
              </p>

            </div>

          </div>


          {/* ==================================================
              10TH STANDARD
          ================================================== */}

          <div className="bs-profile-education-group">

            <div className="bs-profile-education-title">

              <span>
                10th Standard
              </span>

            </div>


            <div className="bs-profile-form-grid">


              {/* SCHOOL NAME */}

              <div
                className={fieldClass(
                  'tenthSchoolName',
                )}
              >

                <label htmlFor="tenthSchoolName">

                  School Name

                  <span className="bs-required-mark">
                    {' '}*
                  </span>

                </label>


                <input
                  id="tenthSchoolName"
                  type="text"
                  placeholder="Enter school name"
                  value={
                    profile.tenthSchoolName
                  }
                  disabled={!isEditing}
                  aria-invalid={Boolean(
                    errors.tenthSchoolName,
                  )}
                  onChange={(event) =>
                    handleChange(
                      'tenthSchoolName',
                      event.target.value,
                    )
                  }
                />


                {errors.tenthSchoolName && (

                  <small className="bs-profile-error-text">
                    {errors.tenthSchoolName}
                  </small>

                )}

              </div>


              {/* 10TH STATE */}

              <div
                className={fieldClass(
                  'tenthState',
                )}
              >

                <label htmlFor="tenthState">

                  State / UT

                  <span className="bs-required-mark">
                    {' '}*
                  </span>

                </label>


                <select
                  id="tenthState"
                  value={
                    profile.tenthState
                  }
                  disabled={!isEditing}
                  aria-invalid={Boolean(
                    errors.tenthState,
                  )}
                  onChange={(event) =>
                    handleChange(
                      'tenthState',
                      event.target.value,
                    )
                  }
                >

                  <option value="">
                    Select State / UT
                  </option>


                  {INDIAN_STATES.map(
                    (state) => (
                      <option
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>
                    ),
                  )}

                </select>


                {errors.tenthState && (

                  <small className="bs-profile-error-text">
                    {errors.tenthState}
                  </small>

                )}

              </div>


              {/* 10TH PERCENTAGE */}

              <div
                className={fieldClass(
                  'tenthPercentage',
                )}
              >

                <label htmlFor="tenthPercentage">

                  10th Percentage

                  <span className="bs-required-mark">
                    {' '}*
                  </span>

                </label>


                <input
                  id="tenthPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="e.g. 85.50"
                  value={
                    profile.tenthPercentage
                  }
                  disabled={!isEditing}
                  aria-invalid={Boolean(
                    errors.tenthPercentage,
                  )}
                  onChange={(event) =>
                    handleChange(
                      'tenthPercentage',
                      event.target.value,
                    )
                  }
                />


                {errors.tenthPercentage && (

                  <small className="bs-profile-error-text">
                    {errors.tenthPercentage}
                  </small>

                )}

              </div>

            </div>

          </div>


          {/* ==================================================
              12TH
          ================================================== */}

          <div className="bs-profile-education-group">

            <div className="bs-profile-education-title">

              <span>
                12th / Higher Secondary
              </span>

            </div>


            <div className="bs-profile-form-grid">


              {/* 12TH BOARD */}

              <div
                className={fieldClass(
                  'twelfthBoard',
                )}
              >

                <label htmlFor="twelfthBoard">

                  12th Board

                  <span className="bs-required-mark">
                    {' '}*
                  </span>

                </label>


                <input
                  id="twelfthBoard"
                  type="text"
                  placeholder="e.g. CBSE / ISC / State Board"
                  value={
                    profile.twelfthBoard
                  }
                  disabled={!isEditing}
                  aria-invalid={Boolean(
                    errors.twelfthBoard,
                  )}
                  onChange={(event) =>
                    handleChange(
                      'twelfthBoard',
                      event.target.value,
                    )
                  }
                />


                {errors.twelfthBoard && (

                  <small className="bs-profile-error-text">
                    {errors.twelfthBoard}
                  </small>

                )}

              </div>


              {/* 12TH PERCENTAGE */}

              <div
                className={fieldClass(
                  'twelfthPercentage',
                )}
              >

                <label htmlFor="twelfthPercentage">

                  12th Percentage

                  <span className="bs-required-mark">
                    {' '}*
                  </span>

                </label>


                <input
                  id="twelfthPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="e.g. 82.50"
                  value={
                    profile.twelfthPercentage
                  }
                  disabled={!isEditing}
                  aria-invalid={Boolean(
                    errors.twelfthPercentage,
                  )}
                  onChange={(event) =>
                    handleChange(
                      'twelfthPercentage',
                      event.target.value,
                    )
                  }
                />


                {errors.twelfthPercentage && (

                  <small className="bs-profile-error-text">
                    {errors.twelfthPercentage}
                  </small>

                )}

              </div>

            </div>

          </div>


          {/* ==================================================
              HIGHEST QUALIFICATION
          ================================================== */}

          <div className="bs-profile-education-group">

            <div className="bs-profile-education-title">

              <span>
                Highest Qualification
              </span>

            </div>


            <div className="bs-profile-form-grid">


              {/* DEGREE */}

              <div
                className={fieldClass(
                  'highestQualification',
                )}
              >

                <label htmlFor="highestQualification">

                  Highest Qualification / Degree

                  <span className="bs-required-mark">
                    {' '}*
                  </span>

                </label>


                <input
                  id="highestQualification"
                  type="text"
                  placeholder="e.g. B.E. Computer Science"
                  value={
                    profile.highestQualification
                  }
                  disabled={!isEditing}
                  aria-invalid={Boolean(
                    errors.highestQualification,
                  )}
                  onChange={(event) =>
                    handleChange(
                      'highestQualification',
                      event.target.value,
                    )
                  }
                />


                {errors.highestQualification && (

                  <small className="bs-profile-error-text">
                    {errors.highestQualification}
                  </small>

                )}

              </div>


              {/* QUALIFICATION PERCENTAGE */}

              <div
                className={fieldClass(
                  'qualificationPercentage',
                )}
              >

                <label htmlFor="qualificationPercentage">

                  Percentage

                  <span className="bs-required-mark">
                    {' '}*
                  </span>

                </label>


                <input
                  id="qualificationPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="e.g. 78.50"
                  value={
                    profile.qualificationPercentage
                  }
                  disabled={!isEditing}
                  aria-invalid={Boolean(
                    errors.qualificationPercentage,
                  )}
                  onChange={(event) =>
                    handleChange(
                      'qualificationPercentage',
                      event.target.value,
                    )
                  }
                />


                {errors.qualificationPercentage && (

                  <small className="bs-profile-error-text">
                    {errors.qualificationPercentage}
                  </small>

                )}

              </div>


              {/* COLLEGE NAME */}

              <div
                className={fieldClass(
                  'collegeName',
                )}
              >

                <label htmlFor="collegeName">

                  College Name

                  <span className="bs-required-mark">
                    {' '}*
                  </span>

                </label>


                <input
                  id="collegeName"
                  type="text"
                  placeholder="Enter college / university name"
                  value={
                    profile.collegeName
                  }
                  disabled={!isEditing}
                  aria-invalid={Boolean(
                    errors.collegeName,
                  )}
                  onChange={(event) =>
                    handleChange(
                      'collegeName',
                      event.target.value,
                    )
                  }
                />


                {errors.collegeName && (

                  <small className="bs-profile-error-text">
                    {errors.collegeName}
                  </small>

                )}

              </div>


              {/* COLLEGE STATE */}

              <div
                className={fieldClass(
                  'collegeState',
                )}
              >

                <label htmlFor="collegeState">

                  College State / UT

                  <span className="bs-required-mark">
                    {' '}*
                  </span>

                </label>


                <select
                  id="collegeState"
                  value={
                    profile.collegeState
                  }
                  disabled={!isEditing}
                  aria-invalid={Boolean(
                    errors.collegeState,
                  )}
                  onChange={(event) =>
                    handleChange(
                      'collegeState',
                      event.target.value,
                    )
                  }
                >

                  <option value="">
                    Select State / UT
                  </option>


                  {INDIAN_STATES.map(
                    (state) => (
                      <option
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>
                    ),
                  )}

                </select>


                {errors.collegeState && (

                  <small className="bs-profile-error-text">
                    {errors.collegeState}
                  </small>

                )}

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            RESUME
        ================================================== */}

        <section className="bs-profile-section">

          <div className="bs-profile-section-heading">

            <div className="bs-profile-section-icon">

              <FileText
                size={18}
                strokeWidth={1.8}
              />

            </div>


            <div>

              <h3>

                Resume

                <span className="bs-required-mark">
                  {' '}*
                </span>

              </h3>

              <p>
                PDF format only.
                Resume is required.
              </p>

            </div>

          </div>


          <div
            className={
              errors.resume
                ? 'bs-profile-resume bs-profile-resume-error'
                : 'bs-profile-resume'
            }
          >

            <div className="bs-profile-resume-icon">

              <FileText
                size={22}
                strokeWidth={1.8}
              />

            </div>


            <div className="bs-profile-resume-info">

              <strong>
                {profile.resume ||
                  'No resume uploaded'}
              </strong>

              <span>

                {profile.resume
                  ? 'Your current PDF resume'
                  : 'Upload your PDF resume before saving your profile'}

              </span>

            </div>


            {isEditing && (

              <label className="bs-profile-upload">

                {profile.resume
                  ? 'Replace Resume'
                  : 'Upload PDF Resume'}


                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={
                    handleResumeChange
                  }
                />

              </label>

            )}

          </div>


          <p className="bs-profile-resume-note">

            <strong>
              Required:
            </strong>{' '}
            PDF format only.

          </p>


          {errors.resume && (

            <p
              className="
                bs-profile-error-text
                bs-profile-resume-error-text
              "
            >
              {errors.resume}
            </p>

          )}

        </section>


        {/* ==================================================
            BOTTOM ACTIONS
        ================================================== */}

        {isEditing && (

          <div className="bs-profile-bottom-actions">

            <button
              type="button"
              className="bs-profile-cancel-button"
              onClick={
                handleCancel
              }
            >
              Cancel
            </button>


            <button
              type="button"
              className="bs-profile-save-button"
              onClick={
                handleSave
              }
              disabled={saving}
            >

              <Save
                size={15}
                strokeWidth={1.8}
              />

              {saving
                ? 'Saving...'
                : 'Save Changes'}

            </button>

          </div>

        )}


        {/* ==================================================
            DASHBOARD LINK
        ================================================== */}

        <button
          type="button"
          className="bs-profile-dashboard-link"
          onClick={
            handleBackToDashboard
          }
        >
          Back to Dashboard
        </button>

      </section>

    </main>
  )
}