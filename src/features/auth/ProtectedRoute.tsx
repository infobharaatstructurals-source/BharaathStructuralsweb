import {
  useEffect,
  useState,
} from 'react'

import {
  Navigate,
  Outlet,
} from 'react-router-dom'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import type {
  AppDispatch,
  RootState,
} from '../../app/store'

import {
  clearAuth,
  loginSuccess,
  type AuthUser,
  type UserRole,
} from '../../features/auth/authSlice'


/* =========================================================
   API
========================================================= */

const API_URL =
  'http://localhost:5000/api'


/* =========================================================
   PROPS
========================================================= */

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}


/* =========================================================
   BACKEND USER
========================================================= */

interface BackendUser {
  id?: string
  userId?: string

  firstName?: string
  first_name?: string

  lastName?: string
  last_name?: string

  email?: string

  phone?: string

  role?: string

  emailVerified?: boolean
  email_verified?: boolean

  phoneVerified?: boolean
  phone_verified?: boolean
}


/* =========================================================
   NORMALIZE ROLE
========================================================= */

const normalizeRole = (
  role: unknown
): UserRole | null => {

  const value =
    String(role ?? '')
      .trim()
      .toLowerCase()


  if (value === 'candidate') {
    return 'candidate'
  }


  if (value === 'hr') {
    return 'hr'
  }


  if (value === 'admin') {
    return 'admin'
  }


  /*
   * IMPORTANT:
   * Never default to candidate.
   */
  return null
}


/* =========================================================
   NORMALIZE BACKEND USER
========================================================= */

const normalizeUser = (
  backendUser: BackendUser
): AuthUser | null => {

  const role =
    normalizeRole(
      backendUser.role
    )


  /*
   * Invalid role means invalid
   * authenticated user.
   */
  if (!role) {

    console.error(
      'Invalid user role received from backend:',
      backendUser.role
    )

    return null
  }


  const userId =
    String(
      backendUser.id ??
      backendUser.userId ??
      ''
    ).trim()


  const email =
    String(
      backendUser.email ??
      ''
    ).trim()


  /*
   * Never accept a user without
   * a valid ID or email.
   */
  if (
    !userId ||
    !email
  ) {

    console.error(
      'Invalid authenticated user received from backend.'
    )

    return null
  }


  return {

    id:
      userId,

    firstName:
      backendUser.firstName ??
      backendUser.first_name ??
      '',

    lastName:
      backendUser.lastName ??
      backendUser.last_name ??
      '',

    email,

    phone:
      backendUser.phone ??
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
}


/* =========================================================
   SHARED AUTH REQUEST

   IMPORTANT:

   If React StrictMode or multiple protected components
   request /auth/me at exactly the same time, this prevents
   duplicate requests.

   Only one request is sent.
========================================================= */

let authMePromise:
  Promise<AuthUser | null> | null =
    null


const fetchCurrentUser =
  async (): Promise<AuthUser | null> => {

    if (authMePromise) {

      return authMePromise
    }


    authMePromise =
      (async () => {

        try {

          const response =
            await fetch(
              `${API_URL}/auth/me`,
              {
                method: 'GET',
                credentials: 'include',
              }
            )


          if (!response.ok) {

            return null
          }


          const data =
            await response.json()


          const backendUser:
            BackendUser | null =
              data?.user ??
              data?.data?.user ??
              null


          if (!backendUser) {

            return null
          }


          return normalizeUser(
            backendUser
          )

        } catch (error) {

          console.error(
            'Authentication request failed:',
            error
          )

          return null

        } finally {

          /*
           * Allow a future authentication
           * check if necessary.
           */
          authMePromise = null

        }

      })()


    return authMePromise
  }


/* =========================================================
   PROTECTED ROUTE
========================================================= */

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {

  const dispatch =
    useDispatch<AppDispatch>()


  /* =======================================================
     CURRENT REDUX USER
  ======================================================= */

  const user =
    useSelector(
      (state: RootState) =>
        state.auth.user
    )


  const isAuthenticated =
    useSelector(
      (state: RootState) =>
        state.auth.isAuthenticated
    )


  /* =======================================================
     LOADING
  ======================================================= */

  const [
    loading,
    setLoading,
  ] = useState(
    !isAuthenticated ||
    !user
  )


  /* =======================================================
     AUTHENTICATION CHECK
  ======================================================= */

  useEffect(() => {

    let cancelled = false


    const verifyAuthentication =
      async () => {

        /*
         * =================================================
         * IMPORTANT
         *
         * If Redux already contains the authenticated user,
         * DO NOT call /auth/me again.
         *
         * This is what prevents:
         *
         * Dashboard
         *     ↓
         * Jobs
         *     ↓
         * Applications
         *
         * from repeatedly fetching the current user.
         * =================================================
         */

        if (
          user &&
          isAuthenticated
        ) {

          if (!cancelled) {

            setLoading(false)

          }

          return
        }


        /*
         * Redux does not have the user.
         *
         * This normally happens when:
         *
         * - browser was refreshed
         * - application was opened directly
         * - Redux store was newly created
         */

        setLoading(true)


        const currentUser =
          await fetchCurrentUser()


        if (cancelled) {
          return
        }


        /*
         * No valid authenticated user.
         */

        if (!currentUser) {

          dispatch(
            clearAuth()
          )

          setLoading(false)

          return
        }


        /*
         * =================================================
         * IMPORTANT
         *
         * Store ONLY the user returned by the backend.
         *
         * There is NO default user.
         *
         * There is NO default candidate role.
         * =================================================
         */

        dispatch(
          loginSuccess(
            currentUser
          )
        )


        setLoading(false)

      }


    verifyAuthentication()


    return () => {

      cancelled = true

    }

  }, [
    dispatch,
    user,
    isAuthenticated,
  ])


  /* =========================================================
     LOADING
========================================================= */

  if (loading) {

    return (

      <div
        style={{
          minHeight: '100vh',

          display: 'flex',

          alignItems: 'center',

          justifyContent: 'center',

          background: '#f5f7f9',

          color: '#06243a',

          fontFamily: 'inherit',

          fontSize: '15px',

        }}
      >

        Checking authentication...

      </div>

    )
  }


  /* =========================================================
     NOT AUTHENTICATED
========================================================= */

  if (
    !user ||
    !isAuthenticated
  ) {

    return (

      <Navigate
        to="/login"
        replace
      />

    )
  }


  /* =========================================================
     ROLE AUTHORIZATION
========================================================= */

  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.role
    )
  ) {

    /*
     * User is logged in,
     * but does not have permission.
     *
     * Send them to their normal dashboard.
     */

    return (

      <Navigate
        to="/dashboard"
        replace
      />

    )
  }


  /* =========================================================
     AUTHENTICATED + AUTHORIZED
========================================================= */

  return (
    <Outlet />
  )
}