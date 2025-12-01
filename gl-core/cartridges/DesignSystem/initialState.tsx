// core/gl-core/cartridges/DesignSystem/initialState.tsx
import { TDesignSystemState } from './types';

export const initialState: TDesignSystemState = {
  cartridge: 'designSystem',
  themeMode: 'dark',
  dialog: null,
  tagsOpen: false,
  feedback: null,
  feedbackTested: false,
  fullScreen: false,
  loading: false,
};
