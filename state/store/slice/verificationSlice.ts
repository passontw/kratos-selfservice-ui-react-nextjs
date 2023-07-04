/**
 * Redux slice for managing verification-related info
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface verificationInitialStateI {
  isInputChanging: boolean
  isSubmitting: boolean
}

const initialState: verificationInitialStateI = {
  isInputChanging: false,
  isSubmitting: false,
}

const verificationSlice = createSlice({
  name: "verification",
  initialState,
  reducers: {
    setIsInputChanging: (
      state: verificationInitialStateI,
      { payload }: { payload: boolean },
    ) => {
      console.log("@validationDebug2 verificationSlice reducer")
      state.isInputChanging = payload
    },
    setIsSubmitting: (
      state: verificationInitialStateI,
      { payload }: { payload: boolean },
    ) => {
      state.isSubmitting = payload
    },
  },
})

// Selectors
export const selectIsInputChanging = (state: {
  verification: { isInputChanging: boolean }
}) => state?.verification?.isInputChanging

export const selectIsSubmitting = (state: {
  verification: { isSubmitting: boolean }
}) => state?.verification?.isSubmitting

// Actions
export const { setIsInputChanging, setIsSubmitting } = verificationSlice.actions

export default verificationSlice.reducer
