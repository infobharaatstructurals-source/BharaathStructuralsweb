import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import profileReducer from '../features/profile/profileSlice'
import jobsReducer from '../features/jobs/jobsSlice'
import applicationsReducer from '../features/applications/applicationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch