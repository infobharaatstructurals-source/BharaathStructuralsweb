import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


/* ============================================================
   PROFILE DATA
============================================================ */

export interface ProfileData {
  /* ----------------------------------------------------------
     PERSONAL INFORMATION
  ---------------------------------------------------------- */

  firstName: string
  lastName: string
  email: string
  phone: string
  location: string


  /* ----------------------------------------------------------
     PROFESSIONAL INFORMATION
  ---------------------------------------------------------- */

  experience: string
  currentCompany: string
  skills: string
  linkedin: string
  portfolio: string


  /* ----------------------------------------------------------
     10TH STANDARD
  ---------------------------------------------------------- */

  tenthSchoolName: string
  tenthState: string
  tenthPercentage: string


  /* ----------------------------------------------------------
     12TH / HIGHER SECONDARY
  ---------------------------------------------------------- */

  twelfthBoard: string
  twelfthPercentage: string


  /* ----------------------------------------------------------
     HIGHEST QUALIFICATION
  ---------------------------------------------------------- */

  highestQualification: string
  qualificationPercentage: string
  collegeName: string
  collegeState: string


  /* ----------------------------------------------------------
     RESUME
  ---------------------------------------------------------- */

  resume: string
}


/* ============================================================
   PROFILE STATE
============================================================ */

interface ProfileState {
  profile: ProfileData
}


/* ============================================================
   INITIAL PROFILE
============================================================ */

const initialState: ProfileState = {
  profile: {
    /* --------------------------------------------------------
       PERSONAL INFORMATION
    -------------------------------------------------------- */

    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',


    /* --------------------------------------------------------
       PROFESSIONAL INFORMATION
    -------------------------------------------------------- */

    experience: '',
    currentCompany: '',
    skills: '',
    linkedin: '',
    portfolio: '',


    /* --------------------------------------------------------
       10TH STANDARD
    -------------------------------------------------------- */

    tenthSchoolName: '',
    tenthState: '',
    tenthPercentage: '',


    /* --------------------------------------------------------
       12TH / HIGHER SECONDARY
    -------------------------------------------------------- */

    twelfthBoard: '',
    twelfthPercentage: '',


    /* --------------------------------------------------------
       HIGHEST QUALIFICATION
    -------------------------------------------------------- */

    highestQualification: '',
    qualificationPercentage: '',
    collegeName: '',
    collegeState: '',


    /* --------------------------------------------------------
       RESUME
    -------------------------------------------------------- */

    resume: '',
  },
}


/* ============================================================
   PROFILE SLICE
============================================================ */

const profileSlice = createSlice({
  name: 'profile',

  initialState,

  reducers: {

    /* ========================================================
       UPDATE ONE PROFILE FIELD
    ======================================================== */

    updateProfile: (
      state,
      action: PayloadAction<{
        field: keyof ProfileData
        value: string
      }>,
    ) => {
      state.profile[
        action.payload.field
      ] = action.payload.value
    },


    /* ========================================================
       SET COMPLETE PROFILE
       
       Used after login / when loading profile data.
    ======================================================== */

    setProfile: (
      state,
      action: PayloadAction<ProfileData>,
    ) => {
      state.profile = action.payload
    },


    /* ========================================================
       CLEAR PROFILE
       
       Used when the user signs out.
    ======================================================== */

    clearProfile: (
      state,
    ) => {
      state.profile = {
        ...initialState.profile,
      }
    },
  },
})


/* ============================================================
   ACTIONS
============================================================ */

export const {
  updateProfile,
  setProfile,
  clearProfile,
} = profileSlice.actions


/* ============================================================
   REDUCER
============================================================ */

export default profileSlice.reducer