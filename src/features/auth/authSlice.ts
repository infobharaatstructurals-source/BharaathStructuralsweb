import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'


/* =========================================================
   USER ROLES
========================================================= */

export type UserRole =
  | 'candidate'
  | 'hr'
  | 'admin'


/* =========================================================
   AUTHENTICATED USER
========================================================= */

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  emailVerified?: boolean
  phoneVerified?: boolean
}


/* =========================================================
   AUTH STATE
========================================================= */

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
}


/* =========================================================
   INITIAL STATE
========================================================= */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}


/* =========================================================
   SLICE
========================================================= */

const authSlice = createSlice({

  name: 'auth',

  initialState,

  reducers: {

    /* =====================================================
       LOGIN SUCCESS

       Used after a successful login and when
       ProtectedRoute restores the current user.
    ===================================================== */

    loginSuccess(
      state,
      action: PayloadAction<AuthUser>
    ) {

      state.user =
        action.payload

      state.isAuthenticated =
        true

    },


    /* =====================================================
       SET AUTHENTICATED USER
    ===================================================== */

    setAuthenticatedUser(
      state,
      action: PayloadAction<AuthUser>
    ) {

      state.user =
        action.payload

      state.isAuthenticated =
        true

    },


    /* =====================================================
       LOGOUT
    ===================================================== */

    logout(state) {

      state.user = null

      state.isAuthenticated =
        false

    },


    /* =====================================================
       CLEAR AUTH
    ===================================================== */

    clearAuth(state) {

      state.user = null

      state.isAuthenticated =
        false

    },

  },

})


/* =========================================================
   ACTIONS
========================================================= */

export const {
  loginSuccess,
  setAuthenticatedUser,
  logout,
  clearAuth,
} =
  authSlice.actions


/* =========================================================
   REDUCER
========================================================= */

export default authSlice.reducer