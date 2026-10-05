import { useRef, useState } from 'react'

import {
  LayoutDashboard,
  BriefcaseBusiness,
  ClipboardList,
  UserRound,
  UserPlus,
  LogOut,
  ChevronRight,
} from 'lucide-react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'

import type {
  AppDispatch,
  RootState,
} from '../../../app/store'

import {
  clearAuth,
} from '../../../features/auth/authSlice'

import './CareerSidebar.css'


/* =========================================================
   BACKEND API
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'


/* =========================================================
   SESSION STORAGE KEY

   This remembers whether the sidebar was expanded
   while navigating between Career pages.
========================================================= */

const SIDEBAR_STATE_KEY =
  'bs-career-sidebar-expanded'


/* =========================================================
   USER TYPE
========================================================= */

type UserRole =
  | 'candidate'
  | 'hr'
  | 'admin'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  emailVerified: boolean
  role: UserRole
}


/* =========================================================
   PROPS
========================================================= */

interface CareerSidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}


/* =========================================================
   GET SAVED STATE
========================================================= */

const getSavedExpandedState = (): boolean => {

  if (
    typeof window === 'undefined'
  ) {
    return false
  }

  return (
    window.sessionStorage.getItem(
      SIDEBAR_STATE_KEY
    ) === 'true'
  )
}


/* =========================================================
   ROLE HELPERS
========================================================= */

const normalizeRole = (
  role: unknown
): UserRole | null => {

  const value =
    String(role ?? '')
      .trim()
      .toLowerCase()

  if (value === 'admin') {
    return 'admin'
  }

  if (value === 'hr') {
    return 'hr'
  }

  if (value === 'candidate') {
    return 'candidate'
  }

  return null
}


const getRoleLabel = (
  role: UserRole
): string => {

  if (role === 'admin') {
    return 'Admin'
  }

  if (role === 'hr') {
    return 'HR'
  }

  return 'Candidate'
}


/* =========================================================
   COMPONENT
========================================================= */

export default function CareerSidebar({
  mobileOpen = false,
  onMobileClose,
}: CareerSidebarProps) {

  const navigate = useNavigate()
  const location = useLocation()
  /* =======================================================
     CURRENT AUTHENTICATED USER

     The sidebar reads the current logged-in user directly
     from Redux. It does NOT call /auth/me.

     ProtectedRoute restores the session after a full
     browser refresh.
  ======================================================= */

  const dispatch =
    useDispatch<AppDispatch>()

  const user =
    useSelector(
      (state: RootState) =>
        state.auth.user
    )
/* =======================================================
     EXPANDED STATE

     IMPORTANT:
     This is restored from sessionStorage.
  ======================================================= */

  const [isExpanded, setIsExpanded] =
    useState<boolean>(
      getSavedExpandedState
    )


  /* =======================================================
     NAVIGATION LOCK

     Prevents:
       expanded
       ↓
       click
       ↓
       old sidebar mouse event
       ↓
       collapse

     while route navigation is happening.
  ======================================================= */

  const navigationLock =
    useRef(false)


  /* =======================================================
     FINAL SIDEBAR STATE
  ======================================================= */

  const sidebarExpanded =
    isExpanded || mobileOpen


  /* =======================================================
     MOUSE ENTER

     Expand + remember.
  ======================================================= */

  const handleMouseEnter = () => {

    /*
     * Navigation lock is cleared as soon as
     * the new sidebar is entered.
     */

    navigationLock.current =
      false


    setIsExpanded(true)


    sessionStorage.setItem(
      SIDEBAR_STATE_KEY,
      'true'
    )

  }


  /* =======================================================
     MOUSE LEAVE

     Collapse + remember.

     BUT:

     If a click/navigation just happened,
     ignore the old component's mouseleave.
  ======================================================= */

  const handleMouseLeave = () => {

    if (
      navigationLock.current
    ) {

      return

    }


    setIsExpanded(false)


    sessionStorage.setItem(
      SIDEBAR_STATE_KEY,
      'false'
    )

  }


  /* =======================================================
     NAVIGATION

     IMPORTANT:

     We DO NOT collapse the sidebar here.

     We explicitly preserve the expanded state.
  ======================================================= */

  const handleNavigation = (
    path: string
  ) => {

    /*
     * If currently expanded, keep it expanded
     * throughout the route transition.
     */

    if (isExpanded) {

      navigationLock.current =
        true

      setIsExpanded(true)

      sessionStorage.setItem(
        SIDEBAR_STATE_KEY,
        'true'
      )

    }


    /*
     * Navigate.
     */

    navigate(path)


    /*
     * Mobile drawer can close.

     * Desktop expanded state remains untouched.
     */

    if (onMobileClose) {

      onMobileClose()

    }


    /*
     * Give the new route enough time to mount
     * before allowing a mouseleave to collapse
     * the old state.
     */

    window.setTimeout(() => {

      navigationLock.current =
        false

    }, 450)

  }


  /* =======================================================
     ACTIVE PAGE
  ======================================================= */

  const isActive = (
    path: string
  ) => {

    if (
      path === '/dashboard'
    ) {

      return (
        location.pathname ===
        '/dashboard'
      )

    }


    return location.pathname.startsWith(
      path
    )

  }


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {

    /*
     * Clear sidebar state before leaving
     * the Career Portal.
     */

    sessionStorage.removeItem(
      SIDEBAR_STATE_KEY
    )


    try {

      await fetch(
        `${API_URL}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )

    } catch (error) {

      console.error(
        'Logout error:',
        error
      )

    } finally {

      dispatch(
        clearAuth()
      )

      navigate('/login')

    }

  }


  /* =======================================================
     USER INITIAL
  ======================================================= */

  const userInitial =
    user?.firstName
      ?.charAt(0)
      .toUpperCase() || ''


  /* =======================================================
     CURRENT ROLE
  ======================================================= */

  const userRole =
    normalizeRole(
      user?.role
    )

  const roleLabel =
    userRole
      ? getRoleLabel(userRole)
      : ''

  const canAddUser =
    userRole === 'hr' ||
    userRole === 'admin'

  /*
   * Candidate:
   *   My Applications
   *
   * HR/Admin:
   *   Applications
   */
  const applicationsLabel =
    userRole === 'candidate'
      ? 'My Applications'
      : 'Applications'


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>

      {/* ===================================================
          MOBILE OVERLAY
      =================================================== */}

      {mobileOpen && (
        <div
          className="
            bs-career-sidebar-overlay
          "
          onClick={
            onMobileClose
          }
        />
      )}


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        className={`
          bs-career-sidebar

          ${
            sidebarExpanded
              ? 'bs-career-sidebar-expanded'
              : 'bs-career-sidebar-collapsed'
          }

          ${
            mobileOpen
              ? 'bs-career-sidebar-mobile-open'
              : ''
          }
        `}

        onMouseEnter={
          handleMouseEnter
        }

        onMouseLeave={
          handleMouseLeave
        }
      >


        {/* =================================================
            LOGO
        ================================================= */}

        <div
          className="
            bs-career-sidebar-logo
          "
        >

          {/* ===============================================
              COLLAPSED LOGO
          =============================================== */}

          <img
            className="
              bs-career-logo-black
            "
            src="/BlackLogo.png"
            alt="Bharaat Structurals"
          />


          {/* ===============================================
              EXPANDED LOGO
          =============================================== */}

          <img
            className="
              bs-career-logo-full
            "
            src="/Logo.png"
            alt="Bharaat Structurals"
          />

        </div>


        {/* =================================================
            PROFILE
        ================================================= */}

        <button
          type="button"
          className="
            bs-career-sidebar-profile
          "
          onClick={() => {
            if (user) {
              handleNavigation('/profile')
            }
          }}
        >

          <div
            className="
              bs-career-sidebar-avatar
            "
          >

            {userInitial}

          </div>


          <div
            className="
              bs-career-sidebar-profile-info
            "
          >

            <strong>

              {user
                ? `${user.firstName} ${user.lastName}`
                : ''}

            </strong>


            <span>
              {roleLabel}
            </span>

          </div>

        </button>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav
          className="
            bs-career-sidebar-navigation
          "
        >


          {/* ===============================================
              DASHBOARD
          =============================================== */}

          <button
            type="button"
            className={`
              bs-career-sidebar-item

              ${
                isActive('/dashboard')
                  ? 'active'
                  : ''
              }
            `}
            onClick={() =>
              handleNavigation(
                '/dashboard'
              )
            }
          >

            <span
              className="
                bs-career-sidebar-icon
              "
            >

              <LayoutDashboard
                size={18}
                strokeWidth={1.8}
              />

            </span>


            <span
              className="
                bs-career-sidebar-label
              "
            >
              Dashboard
            </span>


            <ChevronRight
              className="
                bs-career-sidebar-arrow
              "
              size={14}
              strokeWidth={1.8}
            />

          </button>


          {/* ===============================================
              JOBS
          =============================================== */}

          <button
            type="button"
            className={`
              bs-career-sidebar-item

              ${
                isActive('/jobs')
                  ? 'active'
                  : ''
              }
            `}
            onClick={() =>
              handleNavigation('/jobs')
            }
          >

            <span
              className="
                bs-career-sidebar-icon
              "
            >

              <BriefcaseBusiness
                size={18}
                strokeWidth={1.8}
              />

            </span>


            <span
              className="
                bs-career-sidebar-label
              "
            >
              Jobs
            </span>


            <ChevronRight
              className="
                bs-career-sidebar-arrow
              "
              size={14}
              strokeWidth={1.8}
            />

          </button>


          {/* ===============================================
              MY APPLICATIONS
          =============================================== */}

          <button
            type="button"
            className={`
              bs-career-sidebar-item

              ${
                isActive('/applications')
                  ? 'active'
                  : ''
              }
            `}
            onClick={() =>
              handleNavigation(
                '/applications'
              )
            }
          >

            <span
              className="
                bs-career-sidebar-icon
              "
            >

              <ClipboardList
                size={18}
                strokeWidth={1.8}
              />

            </span>


            <span
              className="
                bs-career-sidebar-label
              "
            >
              {applicationsLabel}
            </span>


            <ChevronRight
              className="
                bs-career-sidebar-arrow
              "
              size={14}
              strokeWidth={1.8}
            />

          </button>


          {/* ===============================================
              ADD USER

              ONLY HR AND ADMIN CAN SEE THIS.
              CANDIDATES WILL NOT SEE IT.
          =============================================== */}

          {canAddUser && (

            <button
              type="button"
              className={`
                bs-career-sidebar-item

                ${
                  isActive('/add-user')
                    ? 'active'
                    : ''
                }
              `}
              onClick={() =>
                handleNavigation(
                  '/add-user'
                )
              }
            >

              <span
                className="
                  bs-career-sidebar-icon
                "
              >

                <UserPlus
                  size={18}
                  strokeWidth={1.8}
                />

              </span>


              <span
                className="
                  bs-career-sidebar-label
                "
              >
                Add User
              </span>


              <ChevronRight
                className="
                  bs-career-sidebar-arrow
                "
                size={14}
                strokeWidth={1.8}
              />

            </button>

          )}


          {/* ===============================================
              PROFILE
          =============================================== */}

          <button
            type="button"
            className={`
              bs-career-sidebar-item

              ${
                isActive('/profile')
                  ? 'active'
                  : ''
              }
            `}
            onClick={() =>
              handleNavigation(
                '/profile'
              )
            }
          >

            <span
              className="
                bs-career-sidebar-icon
              "
            >

              <UserRound
                size={18}
                strokeWidth={1.8}
              />

            </span>


            <span
              className="
                bs-career-sidebar-label
              "
            >
              Profile
            </span>


            <ChevronRight
              className="
                bs-career-sidebar-arrow
              "
              size={14}
              strokeWidth={1.8}
            />

          </button>

        </nav>


        {/* =================================================
            SIGN OUT
        ================================================= */}

        <button
          type="button"
          className="
            bs-career-sidebar-logout
          "
          onClick={handleLogout}
        >

          <span
            className="
              bs-career-sidebar-icon
            "
          >

            <LogOut
              size={18}
              strokeWidth={1.8}
            />

          </span>


          <span
            className="
              bs-career-sidebar-label
            "
          >
            Sign Out
          </span>

        </button>

      </aside>

    </>
  )
}