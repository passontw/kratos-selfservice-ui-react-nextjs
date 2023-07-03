/**
 * Redux slice for managing verification-related info
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface verificationInitialStateI {
  isInputChanging: boolean
}

const initialState: verificationInitialStateI = {
  isInputChanging: false,
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
  },
})

// Selectors
export const selectIsInputChanging = (state: {
  verification: { isInputChanging: boolean }
}) => state?.verification?.isInputChanging

// Actions
export const { setIsInputChanging } = verificationSlice.actions

export default verificationSlice.reducer
