/* eslint-disable no-lonely-if */
/**
 * Redux slice for managing layout-related info
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Navs, Stage } from '../../../types/enum';

import { DialogProps, LayoutSliceStateI } from '../../../types/model/stateModels';

// Init State
const initialState: LayoutSliceStateI = {
  activeNav: Navs.HOME,
  activeStage: Stage.NONE,
  dialog: null,
  dialog2: null,
  dialogLayer: 0,
  sixDigitCode: '',
  mfaModalOpen: false,
  mfaState: undefined,
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setActiveNav: (
      state: LayoutSliceStateI,
      { payload }: PayloadAction<Navs>
    ) => {
      state.activeNav = payload;
    },
    setActiveStage: (
      state: LayoutSliceStateI,
      { payload }: PayloadAction<Stage>
    ) => {
      state.activeStage = payload;
    },
    setSixDigitCode: (
      state: LayoutSliceStateI,
      { payload }: PayloadAction<string>
    ) => {
      state.sixDigitCode = payload;
    },
    setMfaModalOpen: (
      state: LayoutSliceStateI,
      { payload }: PayloadAction<boolean>
    ) => {
      state.mfaModalOpen = payload;
    },
    setMfaState: (
      state: LayoutSliceStateI,
      { payload }: PayloadAction<boolean>
    ) => {
      state.mfaState = payload;
    },
    setDialog: (state: any, { payload }: PayloadAction<DialogProps | null>) => {
      if (payload === null) {
        // meaning about to close dialog
        if (state.dialogLayer === 1) {
          // meaning dialog1 is open and about to close dialog1
          state.dialog = payload;
          state.dialogLayer = 0;
        } else if (state.dialogLayer === 2) {
          // meaning dialog2 is open and about to close dialog2
          state.dialog2 = payload;
          state.dialogLayer = 1;
        }
      } else {
        // meaning about to open dialog
        if (state.dialogLayer === 0) {
          // meaning no dialog is open and about to open dialog1
          state.dialog = payload;
          state.dialogLayer = 1;
        } else if (state.dialogLayer === 1) {
          // meaning dialog1 is open and about to open dialog2
          state.dialog2 = payload;
          state.dialogLayer = 2;
        }
      }
    },
  },
});

// Selectors
export const selectActiveNav = (state: {
  layout: {
    activeNav: Navs;
  };
}) => state.layout.activeNav;

export const selectActiveStage = (state: {
  layout: {
    activeStage: Stage;
  };
}) => state.layout.activeStage;

export const selectSixDigitCode = (state: {
  layout: {
    sixDigitCode: string;
  };
}) => state.layout.sixDigitCode;

export const selectMfaModalOpen = (state: {
  layout: {
    mfaModalOpen: boolean;
  };
}) => state.layout.mfaModalOpen;

export const selectMfaState = (state: {
  layout: {
    mfaState: boolean;
  };
}) => state.layout.mfaState;

export const selectDialog = (state: {
  layout: {
    dialog: DialogProps;
  };
}) => state.layout.dialog;

export const selectDialog2 = (state: {
  layout: {
    dialog2: DialogProps;
  };
}) => state.layout.dialog2;

// Actions
export const {
  setActiveNav,
  setActiveStage,
  setSixDigitCode,
  setMfaModalOpen,
  setMfaState,
  setDialog,
} = layoutSlice.actions;

// export entire reducer
export default layoutSlice.reducer;
