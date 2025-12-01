// core/gl-core/actions/fetchGlobalNav.tsx
import { TUbereduxDispatch } from '../../../../gl-core/types';
import { setUbereduxKey } from '../../../../gl-core';

const FIVE_MINUTES = 5 * 60 * 1000;

export const fetchGlobalNav =
  () => async (dispatch: TUbereduxDispatch, getState: any) => {
    try {
      const state = getState()?.redux ?? {};
      const lastFetch = state.lastGlobalNavFetch as number | undefined;

      // Only refetch if >5 min have passed
      if (lastFetch && Date.now() - lastFetch < FIVE_MINUTES) {
        // console.log('fetchGlobalNav skipped: using cached globalNav');
        return;
      }

      // Bust caching (CDN + browser)
      const res = await fetch('/globalNav.json?t=' + Date.now(), {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch globalNav.json: ${res.status}`);
      }

      const value = await res.json();

      // Store new nav + timestamp
      dispatch(setUbereduxKey({ key: 'globalNav', value }));
      dispatch(
        setUbereduxKey({ key: 'lastGlobalNavFetch', value: Date.now() }),
      );

      // console.log(
      //   'fetchGlobalNav loaded fresh globalNav at',
      //   new Date().toISOString(),
      // );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      dispatch(setUbereduxKey({ key: 'error', value: msg }));
    }
  };
