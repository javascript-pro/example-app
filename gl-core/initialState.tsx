// /Users/goldlabel/GitHub/core/gl-core/initialState.tsx
import pJSON from '../package.json';
import config from './config.json';
import { initialStateLingua } from './cartridges/Lingua';
import { initialStatePaywall } from './cartridges/Paywall';
import { initialStateDesignSystem } from './cartridges/DesignSystem';

export const initialState: any = {
  config,
  version: pJSON.version,
  persisted: Date.now(),
  globalNav: null,
  lingua: initialStateLingua,
  paywall: initialStatePaywall,
  designSystem: initialStateDesignSystem,
};
