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
import type { AppDispatch } from '../../../app/store'


import {
  loginSuccess,
} from '../../../features/auth/authSlice'
import {
  setProfile,
} from '../../../features/profile/profileSlice'

import './Login.css'

const API_URL =
  'http://localhost:5000/api/auth'

export default function Login() {
  const navigate = useNavigate()

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

            credentials:
              'include',

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

      if (!response.ok) {
        setError(
          data.message ||
            'Unable to sign in.'
        )

        return
      }

      /*
       * ========================================================
       * LOGIN SUCCESS
       *
       * Backend has authenticated the user and created the
       * HttpOnly JWT cookie.
       *
       * Now store the authenticated user in Redux.
       * ========================================================
       */

      const user =
        data.user || data.data?.user

      if (user) {
        dispatch(
  loginSuccess({
    id: String(
      user.id ||
      user.userId ||
      ''
    ),

    firstName:
      user.firstName ||
      user.first_name ||
      '',

    lastName:
      user.lastName ||
      user.last_name ||
      '',

    email:
      user.email ||
      email
        .trim()
        .toLowerCase(),

    phone:
      user.phone ||
      '',

    role:
      user.role ||
      'candidate',
  })
          )

        /*
         * ------------------------------------------------------
         * Keep the profile Redux state synchronized with the
         * authenticated user's basic information.
         * ------------------------------------------------------
         */

        dispatch(
          setProfile({
            firstName:
              user.firstName ||
              user.first_name ||
              '',

            lastName:
              user.lastName ||
              user.last_name ||
              '',

            email:
              user.email ||
              email
                .trim()
                .toLowerCase(),

            phone:
              user.phone ||
              '',

            location:
              '',

            experience:
              '',

            currentCompany:
              '',

            skills:
              '',

            linkedin:
              '',

            portfolio:
              '',

            tenthSchoolName:
              '',

            tenthState:
              '',

            tenthPercentage:
              '',

            twelfthBoard:
              '',

            twelfthPercentage:
              '',

            highestQualification:
              '',

            qualificationPercentage:
              '',

            collegeName:
              '',

            collegeState:
              '',

            resume:
              '',
          })
        )
      }

      /*
       * ========================================================
       * GO TO DASHBOARD
       * ========================================================
       */

      navigate('/dashboard')

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

        {/* ==================================================
            RIGHT LOGIN PANEL
        ================================================== */}

        <section className="bs-login-form-panel">

          <div className="bs-login-form-content">

            <div className="bs-brand-content">

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


            {/* HEADING */}

            <div className="bs-login-heading">

              <h1>
                Welcome Back
              </h1>

              <p>
                Sign in to continue to your account
              </p>

            </div>


            {/* FORM */}

            <form
              className="bs-login-form"
              onSubmit={
                handleSubmit
              }
            >

              {/* EMAIL */}

              <div className="bs-login-field">

                <label htmlFor="login-email">
                  Email Address
                  <span>*</span>
                </label>

                <div className="bs-login-input">

                  <Mail
                    size={16}
                    strokeWidth={1.7}
                  />

                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(
                      event
                    ) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    autoComplete="email"
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="bs-login-field">

                <label htmlFor="login-password">
                  Password
                  <span>*</span>
                </label>

                <div className="bs-login-input">

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
                    onChange={(
                      event
                    ) =>
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


              {/* FORGOT */}

              <div className="bs-login-forgot">

                <Link to="/forgot-password">
                  Forgot Password?
                </Link>

              </div>


              {/* ERROR */}

              {error && (
                <div className="bs-login-error">

                  <span>!</span>

                  {error}

                </div>
              )}


              {/* SIGN IN */}

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


            {/* DIVIDER */}

            <div className="bs-login-divider" />


            {/* CREATE */}

            <div className="bs-login-create">

              <span>
                Don't have an account?
              </span>

              <Link to="/signup">
                Create Account
              </Link>

            </div>


            {/* HELP */}

            <div className="bs-login-help">

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


        {/* ==================================================
            LEFT BRAND PANEL
        ================================================== */}

        <section className="bs-login-brand-panel">

          <div className="bs-brand-content" />

        </section>

      </div>

    </main>
  )
}