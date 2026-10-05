import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type {
  ProfileData,
} from '../profile/profileSlice'


/* =========================================================
   APPLICATION TYPE
========================================================= */

export interface Application {

  id: string

  jobId: string

  jobTitle: string

  jobCode: string

  location: string

  employmentType: string

  appliedDate: string

  status:
    | 'Applied'
    | 'Under Review'
    | 'Shortlisted'
    | 'Selected'
    | 'Rejected'
    | 'Withdrawn'

  /*
   * Snapshot of the candidate's profile
   * at the time they submitted the application.
   */
  submittedProfile: ProfileData
}


/* =========================================================
   APPLICATION STATE
========================================================= */

interface ApplicationsState {

  applications: Application[]

  selectedApplication:
    Application | null
}


/* =========================================================
   INITIAL STATE
========================================================= */

const initialState: ApplicationsState = {

  applications: [],

  selectedApplication: null,

}


/* =========================================================
   SLICE
========================================================= */

const applicationsSlice = createSlice({

  name: 'applications',

  initialState,

  reducers: {


    /* =====================================================
       SET APPLICATIONS
    ===================================================== */

    setApplications: (

      state,

      action: PayloadAction<Application[]>

    ) => {

      state.applications =
        action.payload

    },


    /* =====================================================
       ADD APPLICATION
    ===================================================== */

    addApplication: (

      state,

      action: PayloadAction<Application>

    ) => {

      state.applications.unshift(
        action.payload
      )

    },


    /* =====================================================
       SELECT APPLICATION
    ===================================================== */

    selectApplication: (

      state,

      action: PayloadAction<Application | null>

    ) => {

      state.selectedApplication =
        action.payload

    },


    /* =====================================================
       CLEAR SELECTED APPLICATION
    ===================================================== */

    clearSelectedApplication: (
      state
    ) => {

      state.selectedApplication = null

    },


    /* =====================================================
       WITHDRAW APPLICATION
    ===================================================== */

    withdrawApplication: (

      state,

      action: PayloadAction<string>

    ) => {

      const application =
        state.applications.find(
          (item) =>
            item.id === action.payload
        )


      if (!application) {
        return
      }


      /*
       * Do not delete the application.
       *
       * Keep it in application history.
       */

      application.status =
        'Withdrawn'


      /*
       * Update selected application
       * if currently selected.
       */

      if (
        state.selectedApplication?.id ===
        action.payload
      ) {

        state.selectedApplication.status =
          'Withdrawn'

      }

    },

  },

})


/* =========================================================
   ACTIONS
========================================================= */

export const {

  setApplications,

  addApplication,

  selectApplication,

  clearSelectedApplication,

  withdrawApplication,

} = applicationsSlice.actions


/* =========================================================
   REDUCER
========================================================= */

export default applicationsSlice.reducer