/* eslint-disable no-lonely-if */

/**
 * Redux slice for managing layout-related info
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { Navs, Stage } from "../../../types/enum"
import {
  DialogProps,
  LayoutSliceStateI,
} from "../../../types/model/stateModels"

// Init State
const initialState: LayoutSliceStateI = {
  activeNav: Navs.HOME,
  activeStage: Stage.NONE,
  dialog: null,
  dialog2: null,
  dialogLayer: 0,
  sixDigitCode: "",
  mfaModalOpen: false,
  mfaState: undefined,
  lockCodeResend: false,
}

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setActiveNav: (
      state: LayoutSliceStateI,
      { payload }: PayloadAction<Navs>,
    ) => {
      state.activeNav = payload
    },
    setActiveStage: (
      state: LayoutSliceStateI,
      { payload }: PayloadAction<Stage>,
    ) => {
      state.activeStage = payload
    },
    setSixDigitCode: (
      state: LayoutSliceStateI,
      { payload }: PayloadAction<string>,
    ) => {
      state.sixDigitCode = payload
    },
    setLockCodeResend: (
      state: LayoutSliceStateI,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.lockCodeResend = payload
    },
    setMfaModalOpen: (
      state: LayoutSliceStateI,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.mfaModalOpen = payload
    },
    setMfaState: (
      state: LayoutSliceStateI,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.mfaState = payload
    },
    setDialog: (state: any, { payload }: PayloadAction<DialogProps | null>) => {
      if (payload === null) {
        state.dialog = payload
        state.dialogLayer = 0
      } else {
        // meaning about to open dialog
        state.dialog = payload
        state.dialogLayer = 1
      }
    },
  },
})

// Selectors
export const selectActiveNav = (state: {
  layout: {
    activeNav: Navs
  }
}) => state.layout.activeNav

export const selectActiveStage = (state: {
  layout: {
    activeStage: Stage
  }
}) => state.layout.activeStage

export const selectSixDigitCode = (state: {
  layout: {
    sixDigitCode: string
  }
}) => state.layout.sixDigitCode

export const selectLockCodeResend = (state: {
  layout: {
    lockCodeResend: boolean
  }
}) => state.layout.lockCodeResend

export const selectMfaModalOpen = (state: {
  layout: {
    mfaModalOpen: boolean
  }
}) => state.layout.mfaModalOpen

export const selectMfaState = (state: {
  layout: {
    mfaState: boolean
  }
}) => state.layout.mfaState

export const selectDialog = (state: {
  layout: {
    dialog: DialogProps
  }
}) => state.layout.dialog

export const selectDialog2 = (state: {
  layout: {
    dialog2: DialogProps
  }
}) => state.layout.dialog2

// Actions
export const {
  setActiveNav,
  setActiveStage,
  setSixDigitCode,
  setLockCodeResend,
  setMfaModalOpen,
  setMfaState,
  setDialog,
} = layoutSlice.actions

// export entire reducer
export default layoutSlice.reducer
