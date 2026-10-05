import { useState } from 'react'
import type { FormEvent } from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react'

import './ForgotPassword.css'

const API_URL =
  'http://localhost:5000/api/auth'

type ForgotStep =
  | 'email'
  | 'otp'
  | 'password'
  | 'success'

export default function ForgotPassword() {
  const navigate =
    useNavigate()

  const [step, setStep] =
    useState<ForgotStep>(
      'email'
    )

  const [email, setEmail] =
    useState('')

  const [otp, setOtp] =
    useState('')

  const [
    resetToken,
    setResetToken,
  ] = useState('')

  const [password, setPassword] =
    useState('')

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('')

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

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

  // ==========================================================
  // SEND RESET OTP
  // ==========================================================

  const handleSendOtp =
    async () => {
      if (
        !email.trim()
      ) {
        setError(
          'Please enter your email address.'
        )

        return
      }

      setError('')
      setSuccess('')
      setLoading(true)

      try {
        const response =
          await fetch(
            `${API_URL}/request-password-reset`,
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
              'Unable to send reset code.'
          )

          return
        }

        setSuccess(
          'Password reset code sent to your email.'
        )

        setStep('otp')
      } catch (error) {
        console.error(
          'Forgot password OTP error:',
          error
        )

        setError(
          'Unable to connect to the server.'
        )
      } finally {
        setLoading(false)
      }
    }

  // ==========================================================
  // VERIFY OTP
  // ==========================================================

  const handleVerifyOtp =
    async () => {
      if (
        otp.length !== 6
      ) {
        setError(
          'Please enter the 6-digit OTP.'
        )

        return
      }

      setError('')
      setSuccess('')
      setLoading(true)

      try {
        const response =
          await fetch(
            `${API_URL}/verify-password-reset`,
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
                  otp.trim(),
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

        setResetToken(
          data.resetToken
        )

        setSuccess(
          'OTP verified successfully.'
        )

        setStep('password')
      } catch (error) {
        console.error(
          'Verify reset OTP error:',
          error
        )

        setError(
          'Unable to connect to the server.'
        )
      } finally {
        setLoading(false)
      }
    }

  // ==========================================================
  // RESET PASSWORD
  // ==========================================================

  const handleResetPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (
      password.length < 8
    ) {
      setError(
        'Password must contain at least 8 characters.'
      )

      return
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        'Passwords do not match.'
      )

      return
    }

    if (!resetToken) {
      setError(
        'Reset session is invalid. Please start again.'
      )

      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response =
        await fetch(
          `${API_URL}/reset-password`,
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

              resetToken,

              password,
            }),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        setError(
          data.message ||
            'Unable to reset password.'
        )

        return
      }

      setPassword('')
      setConfirmPassword('')
      setResetToken('')

      setSuccess(
        'Password reset successfully.'
      )

      setStep('success')
    } catch (error) {
      console.error(
        'Reset password error:',
        error
      )

      setError(
        'Unable to connect to the server.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ==========================================================
  // PASSWORD MATCH
  // ==========================================================

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword

  // ==========================================================
  // SUCCESS
  // ==========================================================

  if (
    step === 'success'
  ) {
    return (
      <main className="bs-forgot-page">

        <div className="bs-forgot-card">

          <div className="bs-forgot-logo">
            <Link to="/">
              <img
                src="/Logo.webp"
                alt="Bharaat Structurals"
              />
            </Link>
          </div>

          <div className="bs-forgot-success-icon">
            <Check size={30} />
          </div>

          <div className="bs-forgot-heading">

            <h1>
              Password Reset
            </h1>

            <p>
              Your password has been
              changed successfully.
            </p>

          </div>

          <button
            type="button"
            className="bs-forgot-primary-button"
            onClick={() =>
              navigate('/login')
            }
          >
            <span>
              Continue to Sign In
            </span>

            <ArrowRight size={17} />
          </button>

        </div>

      </main>
    )
  }

  return (
    <main className="bs-forgot-page">

      <div className="bs-forgot-card">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="bs-forgot-header">

          <Link
            to="/"
            className="bs-forgot-logo"
          >
            <img
              src="/Logo.webp"
              alt="Bharaat Structurals"
            />
          </Link>

          <Link
            to="/login"
            className="bs-forgot-back"
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>

        </div>


        {/* ==================================================
            EMAIL STEP
        ================================================== */}

        {step === 'email' && (
          <>
            <div className="bs-forgot-icon">
              <Mail size={23} />
            </div>

            <div className="bs-forgot-heading">

              <h1>
                Forgot Password?
              </h1>

              <p>
                Enter your registered email
                address and we will send you
                a password reset code.
              </p>

            </div>

            <div className="bs-forgot-field">

              <label htmlFor="forgot-email">
                Email Address
                <span>*</span>
              </label>

              <div className="bs-forgot-input">

                <Mail size={17} />

                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                />

              </div>

            </div>

            {error && (
              <div className="bs-forgot-error">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              type="button"
              className="bs-forgot-primary-button"
              onClick={
                handleSendOtp
              }
              disabled={loading}
            >
              <span>
                {loading
                  ? 'Sending...'
                  : 'Send Reset Code'}
              </span>

              {!loading && (
                <ArrowRight
                  size={17}
                />
              )}
            </button>
          </>
        )}


        {/* ==================================================
            OTP STEP
        ================================================== */}

        {step === 'otp' && (
          <>
            <div className="bs-forgot-icon">
              <ShieldCheck size={23} />
            </div>

            <div className="bs-forgot-heading">

              <h1>
                Verify Code
              </h1>

              <p>
                Enter the 6-digit code
                sent to your email.
              </p>

            </div>

            <div className="bs-forgot-field">

              <label htmlFor="forgot-otp">
                Verification Code
                <span>*</span>
              </label>

              <div className="bs-forgot-input">

                <ShieldCheck
                  size={17}
                />

                <input
                  id="forgot-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(event) =>
                    setOtp(
                      event.target.value.replace(
                        /\D/g,
                        ''
                      )
                    )
                  }
                />

              </div>

            </div>

            {error && (
              <div className="bs-forgot-error">
                <span>!</span>
                {error}
              </div>
            )}

            {success && (
              <div className="bs-forgot-success-message">
                <Check size={14} />
                {success}
              </div>
            )}

            <button
              type="button"
              className="bs-forgot-primary-button"
              onClick={
                handleVerifyOtp
              }
              disabled={loading}
            >
              <span>
                {loading
                  ? 'Checking...'
                  : 'Verify Code'}
              </span>

              {!loading && (
                <ArrowRight
                  size={17}
                />
              )}
            </button>

            <button
              type="button"
              className="bs-forgot-secondary-button"
              onClick={() =>
                setStep('email')
              }
            >
              Change Email
            </button>
          </>
        )}


        {/* ==================================================
            PASSWORD STEP
        ================================================== */}

        {step === 'password' && (
          <form
            onSubmit={
              handleResetPassword
            }
          >

            <div className="bs-forgot-icon">
              <LockKeyhole
                size={23}
              />
            </div>

            <div className="bs-forgot-heading">

              <h1>
                Create New Password
              </h1>

              <p>
                Choose a new password for
                your account.
              </p>

            </div>


            {/* PASSWORD */}

            <div className="bs-forgot-field">

              <label htmlFor="new-password">
                New Password
                <span>*</span>
              </label>

              <div className="bs-forgot-input">

                <LockKeyhole
                  size={17}
                />

                <input
                  id="new-password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Enter new password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="bs-forgot-eye"
                  onClick={() =>
                    setShowPassword(
                      previous =>
                        !previous
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={17}
                    />
                  ) : (
                    <Eye
                      size={17}
                    />
                  )}
                </button>

              </div>

              <span className="bs-forgot-hint">
                Minimum 8 characters
              </span>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="bs-forgot-field">

              <label htmlFor="confirm-password">
                Confirm Password
                <span>*</span>
              </label>

              <div
                className={`bs-forgot-input ${
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
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Confirm new password"
                  value={
                    confirmPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setConfirmPassword(
                      event.target
                        .value
                    )
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="bs-forgot-eye"
                  onClick={() =>
                    setShowConfirmPassword(
                      previous =>
                        !previous
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      size={17}
                    />
                  ) : (
                    <Eye
                      size={17}
                    />
                  )}
                </button>

              </div>

              {confirmPassword.length >
                0 && (
                <span
                  className={
                    passwordsMatch
                      ? 'bs-forgot-match'
                      : 'bs-forgot-no-match'
                  }
                >
                  {passwordsMatch
                    ? 'Passwords match'
                    : 'Passwords do not match'}
                </span>
              )}

            </div>


            {error && (
              <div className="bs-forgot-error">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="bs-forgot-primary-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? 'Resetting...'
                  : 'Reset Password'}
              </span>

              {!loading && (
                <ArrowRight
                  size={17}
                />
              )}
            </button>

          </form>
        )}

      </div>

    </main>
  )
}