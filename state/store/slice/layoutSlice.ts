/* eslint-disable no-lonely-if */
/**
 * Redux slice for managing layout-related info
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Navs } from '../../../types/enum';

import { DialogProps, LayoutSliceStateI } from '../../../types/model/stateModels';

// Init State
const initialState: LayoutSliceStateI = {
  activeNav: Navs.HOME,
  // this state should be moved to a separate slice, just for convenience
  // it's not related to layout
  dialog: null,
  dialog2: null,
  dialogLayer: 0,
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
  setDialog,
} = layoutSlice.actions;

// export entire reducer
export default layoutSlice.reducer;
