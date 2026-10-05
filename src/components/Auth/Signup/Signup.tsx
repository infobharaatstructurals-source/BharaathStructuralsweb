import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  ArrowRight,
  Check,
  Mail,
  Phone,
  User,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
} from 'lucide-react'

import './Signup.css'

const API_URL =
  'http://localhost:5000/api/auth'

export default function Signup() {
  const navigate = useNavigate()

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [firstName, setFirstName] =
    useState('')

  const [lastName, setLastName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [phone, setPhone] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [confirmPassword, setConfirmPassword] =
    useState('')

  // ==========================================================
  // EMAIL OTP STATE
  // ==========================================================

  const [emailOtp, setEmailOtp] =
    useState('')

  const [emailOtpSent, setEmailOtpSent] =
    useState(false)

  const [emailVerified, setEmailVerified] =
    useState(false)

  const [
    verificationToken,
    setVerificationToken,
  ] = useState('')

  // ==========================================================
  // UI STATE
  // ==========================================================

  const [showPassword, setShowPassword] =
    useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [
    sendingOtp,
    setSendingOtp,
  ] = useState(false)

  const [
    verifyingOtp,
    setVerifyingOtp,
  ] = useState(false)

  // ==========================================================
  // PASSWORD VALIDATION
  // ==========================================================

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword

  // ==========================================================
  // FORM READY
  // ==========================================================

  const formReady =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    phone.trim() !== '' &&
    emailVerified &&
    verificationToken !== '' &&
    password.length >= 8 &&
    passwordsMatch

  // ==========================================================
  // SEND EMAIL OTP
  // ==========================================================

  const handleSendEmailOtp =
    async () => {
      if (
        !email.trim()
      ) {
        setError(
          'Please enter your email address.'
        )

        return
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (
        !emailPattern.test(
          email.trim()
        )
      ) {
        setError(
          'Please enter a valid email address.'
        )

        return
      }

      setError('')
      setSuccess('')
      setSendingOtp(true)

      try {
        const response =
          await fetch(
            `${API_URL}/request-email-otp`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                email:
                  email
                    .trim()
                    .toLowerCase(),
              }),
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          setError(
            data.message ||
              'Unable to send OTP.'
          )

          return
        }

        setEmailOtpSent(true)
        setEmailVerified(false)
        setVerificationToken('')
        setEmailOtp('')
        setSuccess(
          'Verification code sent to your email.'
        )
      } catch (error) {
        console.error(
          'Send OTP error:',
          error
        )

        setError(
          'Unable to connect to the server. Please try again.'
        )
      } finally {
        setSendingOtp(false)
      }
    }

  // ==========================================================
  // VERIFY EMAIL OTP
  // ==========================================================

  const handleVerifyEmailOtp =
    async () => {
      if (
        emailOtp.length !== 6
      ) {
        setError(
          'Please enter the 6-digit email OTP.'
        )

        return
      }

      setError('')
      setSuccess('')
      setVerifyingOtp(true)

      try {
        const response =
          await fetch(
            `${API_URL}/verify-email-otp`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                email:
                  email
                    .trim()
                    .toLowerCase(),

                otp:
                  emailOtp.trim(),
              }),
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          setError(
            data.message ||
              'Invalid OTP.'
          )

          return
        }

        // ------------------------------------------------------
        // Save temporary verification token
        // ------------------------------------------------------

        setVerificationToken(
          data.verificationToken
        )

        setEmailVerified(true)
        setSuccess(
          'Email verified successfully.'
        )
        setError('')
      } catch (error) {
        console.error(
          'Verify OTP error:',
          error
        )

        setError(
          'Unable to connect to the server. Please try again.'
        )
      } finally {
        setVerifyingOtp(false)
      }
    }

  // ==========================================================
  // EMAIL CHANGE
  // ==========================================================

  const handleEmailChange = (
    value: string
  ) => {
    setEmail(value)

    setEmailVerified(false)
    setEmailOtpSent(false)
    setEmailOtp('')
    setVerificationToken('')

    setError('')
    setSuccess('')
  }

  // ==========================================================
  // PHONE CHANGE
  // ==========================================================

  const handlePhoneChange = (
    value: string
  ) => {
    const numbersOnly =
      value.replace(
        /\D/g,
        ''
      )

    setPhone(
      numbersOnly.slice(
        0,
        10
      )
    )
  }

  // ==========================================================
  // CREATE ACCOUNT
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    // --------------------------------------------------------
    // Email verification
    // --------------------------------------------------------

    if (
      !emailVerified ||
      !verificationToken
    ) {
      setError(
        'Please verify your email address.'
      )

      return
    }

    // --------------------------------------------------------
    // Password
    // --------------------------------------------------------

    if (
      password.length < 8
    ) {
      setError(
        'Password must contain at least 8 characters.'
      )

      return
    }

    if (
      !passwordsMatch
    ) {
      setError(
        'Passwords do not match.'
      )

      return
    }

    // --------------------------------------------------------
    // Phone
    // --------------------------------------------------------

    if (
      !/^\d{10}$/.test(
        phone
      )
    ) {
      setError(
        'Please enter a valid 10-digit phone number.'
      )

      return
    }

    // --------------------------------------------------------
    // Submit
    // --------------------------------------------------------

    setLoading(true)

    try {
      const response =
        await fetch(
          `${API_URL}/register`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              firstName:
                firstName.trim(),

              lastName:
                lastName.trim(),

              email:
                email
                  .trim()
                  .toLowerCase(),

              phone:
                phone.trim(),

              password,

              verificationToken,
            }),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        setError(
          data.message ||
            'Unable to create account.'
        )

        return
      }

      // ------------------------------------------------------
      // Account created
      // ------------------------------------------------------

      setSuccess(
        'Account created successfully. Redirecting to login...'
      )

      // Clear sensitive values
      setPassword('')
      setConfirmPassword('')
      setVerificationToken('')

      // ------------------------------------------------------
      // Redirect to login
      // ------------------------------------------------------

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (error) {
      console.error(
        'Registration error:',
        error
      )

      setError(
        'Unable to connect to the server. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ==========================================================
  // JSX
  // ==========================================================

  return (
    <main className="bs-signup-page">

      <div className="bs-signup-container">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="bs-signup-header">

          <Link
            to="/"
            className="bs-signup-logo"
            aria-label="Bharaat Structurals Home"
          >
            <img
              src="/Logo.webp"
              alt="Bharaat Structurals"
            />
          </Link>

          <div className="bs-signup-login-link">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign In
            </Link>

          </div>

        </div>


        {/* =====================================================
            HEADING
        ===================================================== */}

        <div className="bs-signup-heading">

          <div className="bs-signup-title-row">

            <div className="bs-signup-title-icon">
              <ShieldCheck size={20} />
            </div>

            <div>

              <h1>
                Create Account
              </h1>

              <p>
                Create your Bharaat Structurals account
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          className="bs-signup-form"
          onSubmit={handleSubmit}
        >

          {/* ===================================================
              NAME
          =================================================== */}

          <div className="bs-signup-two-column">

            {/* FIRST NAME */}

            <div className="bs-signup-field">

              <label htmlFor="signup-first-name">
                First Name <span>*</span>
              </label>

              <div className="bs-signup-input">

                <User size={17} />

                <input
                  id="signup-first-name"
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(
                      event.target.value
                    )
                  }
                  autoComplete="given-name"
                  required
                />

              </div>

            </div>


            {/* LAST NAME */}

            <div className="bs-signup-field">

              <label htmlFor="signup-last-name">
                Last Name <span>*</span>
              </label>

              <div className="bs-signup-input">

                <User size={17} />

                <input
                  id="signup-last-name"
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(
                      event.target.value
                    )
                  }
                  autoComplete="family-name"
                  required
                />

              </div>

            </div>

          </div>


          {/* ===================================================
              EMAIL
          =================================================== */}

          <div className="bs-signup-field">

            <label htmlFor="signup-email">
              Email Address <span>*</span>
            </label>

            <div className="bs-signup-action-row">

              <div className="bs-signup-input">

                <Mail size={17} />

                <input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    handleEmailChange(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  required
                />

              </div>


              {/* SEND OTP */}

              {!emailVerified && (
                <button
                  type="button"
                  className="bs-otp-button"
                  onClick={
                    handleSendEmailOtp
                  }
                  disabled={
                    sendingOtp
                  }
                >
                  {sendingOtp
                    ? 'Sending...'
                    : emailOtpSent
                      ? 'Resend OTP'
                      : 'Send OTP'}
                </button>
              )}


              {/* VERIFIED */}

              {emailVerified && (
                <div className="bs-verified-badge">

                  <Check size={15} />

                  Verified

                </div>
              )}

            </div>


            {/* EMAIL OTP */}

            {emailOtpSent &&
              !emailVerified && (
                <div className="bs-otp-box">

                  <div className="bs-signup-input">

                    <ShieldCheck
                      size={17}
                    />

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={emailOtp}
                      onChange={(event) =>
                        setEmailOtp(
                          event.target.value.replace(
                            /\D/g,
                            ''
                          )
                        )
                      }
                    />

                  </div>


                  <button
                    type="button"
                    className="bs-otp-verify"
                    onClick={
                      handleVerifyEmailOtp
                    }
                    disabled={
                      verifyingOtp
                    }
                  >
                    {verifyingOtp
                      ? 'Checking...'
                      : 'Verify'}
                  </button>

                </div>
              )}

          </div>


          {/* ===================================================
              PHONE
          =================================================== */}

          <div className="bs-signup-field">

            <label htmlFor="signup-phone">
              Phone Number <span>*</span>
            </label>

            <div className="bs-signup-input">

              <Phone size={17} />

              <input
                id="signup-phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(event) =>
                  handlePhoneChange(
                    event.target.value
                  )
                }
                autoComplete="tel"
                maxLength={10}
                required
              />

            </div>

          </div>


          {/* ===================================================
              PASSWORD
          =================================================== */}

          <div className="bs-signup-two-column">

            {/* PASSWORD */}

            <div className="bs-signup-field">

              <label htmlFor="signup-password">
                Password <span>*</span>
              </label>

              <div className="bs-signup-input">

                <LockKeyhole
                  size={17}
                />

                <input
                  id="signup-password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Create password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="bs-signup-eye"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

              <span className="bs-password-hint">
                Minimum 8 characters
              </span>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="bs-signup-field">

              <label htmlFor="signup-confirm-password">
                Confirm Password <span>*</span>
              </label>

              <div
                className={`bs-signup-input ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'is-valid'
                      : 'is-invalid'
                    : ''
                }`}
              >

                <LockKeyhole
                  size={17}
                />

                <input
                  id="signup-confirm-password"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="bs-signup-eye"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>


              {confirmPassword.length >
                0 && (
                <span
                  className={
                    passwordsMatch
                      ? 'bs-password-success'
                      : 'bs-password-error'
                  }
                >
                  {passwordsMatch
                    ? 'Passwords match'
                    : 'Passwords do not match'}
                </span>
              )}

            </div>

          </div>


          {/* ===================================================
              ERROR
          =================================================== */}

          {error && (
            <div className="bs-signup-error">

              <span>!</span>

              {error}

            </div>
          )}


          {/* ===================================================
              SUCCESS
          =================================================== */}

          {success && (
            <div
              className="bs-signup-success"
            >
              <Check size={15} />

              {success}
            </div>
          )}


          {/* ===================================================
              CREATE ACCOUNT
          =================================================== */}

          <button
            type="submit"
            className={`bs-create-account-button ${
              formReady
                ? 'is-ready'
                : ''
            }`}
            disabled={
              !formReady ||
              loading
            }
          >

            <span>
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </span>

            {!loading && (
              <ArrowRight
                size={17}
                strokeWidth={1.8}
              />
            )}

          </button>


          {/* ===================================================
              FOOTER
          =================================================== */}

          <div className="bs-signup-footer">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign In
            </Link>

          </div>

        </form>

      </div>

    </main>
  )
}