import Uberedux from './Uberedux';
import UbereduxProvider from './UbereduxProvider';
import { useSlice } from './hooks/useSlice';
import { useDispatch } from './hooks/useDispatch';
import { useKey } from './hooks/useKey';
import { useVersionCheck } from './hooks/useVersionCheck';
import { useNewContent } from './hooks/useNewContent';
import { useBySlug } from './hooks/useBySlug';
import { setUbereduxKey, resetUberedux } from './store';
import { TRootState, TUbereduxDispatch } from './store';

import {fetchGlobalNav} from './actions/fetchGlobalNav';

export {
  UbereduxProvider,
  Uberedux,
  useKey,
  useSlice,
  useDispatch,
  useVersionCheck,
  useNewContent,
  useBySlug,
  setUbereduxKey,
  resetUberedux,
  fetchGlobalNav,
};

export type { TRootState, TUbereduxDispatch };
