import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Job {
  id: string
  title: string
  location: string
  employmentType: string
  experience: string
  department: string
  description: string
  postedDate: string
}

interface JobsState {
  jobs: Job[]
  selectedJob: Job | null
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,

  reducers: {
    // Store all available jobs
    setJobs: (
      state,
      action: PayloadAction<Job[]>
    ) => {
      state.jobs = action.payload
    },

    // Store the currently selected job
    selectJob: (
      state,
      action: PayloadAction<Job | null>
    ) => {
      state.selectedJob = action.payload
    },

    // Clear the currently selected job
    clearSelectedJob: (state) => {
      state.selectedJob = null
    },
  },
})

export const {
  setJobs,
  selectJob,
  clearSelectedJob,
} = jobsSlice.actions

export default jobsSlice.reducer