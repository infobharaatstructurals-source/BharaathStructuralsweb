import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type UserRole = 'admin' | 'hr' | 'candidate'

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<AuthUser>
    ) => {
      state.user = action.payload
      state.isAuthenticated = true
    },

    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },

    setAuthenticated: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isAuthenticated = action.payload
    },
  },
})

export const {
  loginSuccess,
  logout,
  setAuthenticated,
} = authSlice.actions

export default authSlice.reducer