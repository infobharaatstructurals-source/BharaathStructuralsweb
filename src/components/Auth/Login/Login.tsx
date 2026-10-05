import { useState } from 'react'
import type { FormEvent } from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from 'lucide-react'

import { useDispatch } from 'react-redux'

import type {
  AppDispatch,
} from '../../../app/store'

import {
  loginSuccess,
  type UserRole,
} from '../../../features/auth/authSlice'

import {
  setProfile,
} from '../../../features/profile/profileSlice'

import './Login.css'

const API_URL =
  'http://localhost:5000/api/auth'

function normalizeRole(
  role: unknown
): UserRole | null {

  const value =
    String(
      role || ''
    )
      .trim()
      .toLowerCase()

  if (
    value === 'candidate' ||
    value === 'hr' ||
    value === 'admin'
  ) {
    return value
  }

  return null
}

export default function Login() {

  const navigate =
    useNavigate()

  const dispatch =
    useDispatch<AppDispatch>()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    setError('')

    if (
      !email.trim() ||
      !password
    ) {

      setError(
        'Please enter your email and password.'
      )

      return

    }

    setLoading(true)

    try {

      const response =
        await fetch(
          `${API_URL}/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              email:
                email
                  .trim()
                  .toLowerCase(),
              password,
            }),
          }
        )

      const data =
        await response.json()

      if (
        !response.ok
      ) {

        setError(
          data?.message ||
          'Unable to sign in.'
        )

        return

      }

      const backendUser =
        data?.user ||
        data?.data?.user

      if (
        !backendUser
      ) {

        setError(
          'Login succeeded but the server did not return a user.'
        )

        return

      }

      const role =
        normalizeRole(
          backendUser.role
        )

      /*
       * NEVER silently convert a missing/invalid
       * role into candidate.
       *
       * That was the source of incorrect RBAC.
       */

      if (
        !role
      ) {

        setError(
          'Your account has an invalid role. Please contact the administrator.'
        )

        return

      }

      const user = {
        id: String(
          backendUser.id ||
          backendUser.userId ||
          ''
        ),

        firstName:
          backendUser.firstName ||
          backendUser.first_name ||
          '',

        lastName:
          backendUser.lastName ||
          backendUser.last_name ||
          '',

        email:
          backendUser.email ||
          email
            .trim()
            .toLowerCase(),

        phone:
          backendUser.phone ||
          '',

        role,

        emailVerified:
          Boolean(
            backendUser.emailVerified ??
            backendUser.email_verified ??
            false
          ),

        phoneVerified:
          Boolean(
            backendUser.phoneVerified ??
            backendUser.phone_verified ??
            false
          ),
      }

      dispatch(
        loginSuccess(
          user
        )
      )

      dispatch(
        setProfile({
          firstName:
            user.firstName,

          lastName:
            user.lastName,

          email:
            user.email,

          phone:
            user.phone,

          location: '',
          experience: '',
          currentCompany: '',
          skills: '',
          linkedin: '',
          portfolio: '',
          tenthSchoolName: '',
          tenthState: '',
          tenthPercentage: '',
          twelfthBoard: '',
          twelfthPercentage: '',
          highestQualification: '',
          qualificationPercentage: '',
          collegeName: '',
          collegeState: '',
          resume: '',
        })
      )

      navigate(
        '/dashboard',
        {
          replace: true,
        }
      )

    } catch (error) {

      console.error(
        'Login error:',
        error
      )

      setError(
        'Unable to connect to the server. Please try again.'
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <main className="bs-login-page">

      <div className="bs-login-container">

        <section
          className="bs-login-form-panel"
        >

          <div
            className="bs-login-form-content"
          >

            <div
              className="bs-brand-content"
            >

              <Link
                to="/"
                className="bs-login-logo"
              >

                <img
                  src="/Logo.webp"
                  alt="Bharaat Structurals"
                />

              </Link>

            </div>

            <div
              className="bs-login-heading"
            >

              <h1>
                Welcome Back
              </h1>

              <p>
                Sign in to continue to your account
              </p>

            </div>

            <form
              className="bs-login-form"
              onSubmit={handleSubmit}
            >

              <div
                className="bs-login-field"
              >

                <label
                  htmlFor="login-email"
                >
                  Email Address
                  <span>*</span>
                </label>

                <div
                  className="bs-login-input"
                >

                  <Mail
                    size={16}
                    strokeWidth={1.7}
                  />

                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={event =>
                      setEmail(
                        event.target.value
                      )
                    }
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              <div
                className="bs-login-field"
              >

                <label
                  htmlFor="login-password"
                >
                  Password
                  <span>*</span>
                </label>

                <div
                  className="bs-login-input"
                >

                  <LockKeyhole
                    size={16}
                    strokeWidth={1.7}
                  />

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={event =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="bs-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        previous =>
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
                      <EyeOff
                        size={16}
                        strokeWidth={1.7}
                      />
                    ) : (
                      <Eye
                        size={16}
                        strokeWidth={1.7}
                      />
                    )}

                  </button>

                </div>

              </div>

              <div
                className="bs-login-forgot"
              >

                <Link
                  to="/forgot-password"
                >
                  Forgot Password?
                </Link>

              </div>

              {error && (

                <div
                  className="bs-login-error"
                >

                  <span>!</span>

                  {error}

                </div>

              )}

              <button
                type="submit"
                className="bs-login-button"
                disabled={loading}
              >

                <span>
                  {loading
                    ? 'Signing In...'
                    : 'Sign In'}
                </span>

                {!loading && (
                  <ArrowRight
                    size={16}
                    strokeWidth={1.8}
                  />
                )}

              </button>

            </form>

            <div
              className="bs-login-divider"
            />

            <div
              className="bs-login-create"
            >

              <span>
                Don't have an account?
              </span>

              <Link
                to="/signup"
              >
                Create Account
              </Link>

            </div>

            <div
              className="bs-login-help"
            >

              <span>
                Need Help?
              </span>

              <a
                href="mailto:info.bharaatstructurals@gmail.com"
              >
                Contact Us
              </a>

            </div>

          </div>

        </section>

        <section
          className="bs-login-brand-panel"
        >

          <div
            className="bs-brand-content"
          />

        </section>

      </div>

    </main>
  )
}
