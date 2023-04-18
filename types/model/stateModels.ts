import { ReactElement, JSXElementConstructor, ReactNode } from 'react';
import { Navs, Stage } from '../../types/enum';

export interface LayoutSliceStateI {
  activeNav: Navs;
  activeStage: Stage;
  dialog?: DialogProps | null;
  dialog2?: DialogProps | null;
  dialogLayer: number;
  sixDigitCode: string;
  mfaModalOpen: boolean;
  mfaState: boolean;
}

export interface DialogProps {
  title?: string;
  titleHeight?: number | string;
  children: ReactElement<any, string | JSXElementConstructor<any>> & ReactNode;
  center?: boolean;
  width: number | string;
  height: number | string;
  /**
   *  if confirmType is set then another dialog will
   *  be opened to show the confirmation when the
   *  original dialog is closed, the value will determine
   *  which type of confirmation dialog to open
   * */
  confirmType?: number;
}
