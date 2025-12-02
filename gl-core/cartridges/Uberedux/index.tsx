import Uberedux from './Uberedux';
import UbereduxProvider from './UbereduxProvider';
import { useSlice } from './hooks/useSlice';
import { useDispatch } from './hooks/useDispatch';
import { useKey } from './hooks/useKey';
import { useVersionCheck } from './hooks/useVersionCheck';
import { useNewContent } from './hooks/useNewContent';
import { usePaywallContent } from './hooks/usePaywallContent';
import { useBySlug } from './hooks/useBySlug';
import { useSearch } from './hooks/useSearch';
import { setUbereduxKey, resetUberedux } from './store';
import { TRootState, TUbereduxDispatch } from './store';
import { fetchGlobalNav } from './actions/fetchGlobalNav';

export {
  UbereduxProvider,
  Uberedux,
  useKey,
  useSlice,
  useDispatch,
  useVersionCheck,
  useNewContent,
  usePaywallContent,
  useBySlug,
  setUbereduxKey,
  resetUberedux,
  fetchGlobalNav,
  useSearch,
};

export type { TRootState, TUbereduxDispatch };
