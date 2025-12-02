// /Users/goldlabel/GitHub/core/gl-core/cartridges/Paywall/types.d.ts
import type { User } from 'firebase/auth';

export type TPaywallState = {
  cartridge: string;
  userDialog?: boolean;
  user?: User | null;
  ting?: TTing | null;
  // [key: string]: any;
};

export type TTing = {
  fingerprint: string;
  // [key: string]: any;
};
