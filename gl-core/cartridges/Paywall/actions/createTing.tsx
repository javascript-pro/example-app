// /Users/goldlabel/GitHub/example-app/gl-core/cartridges/Paywall/actions/createTing.tsx

import { TUbereduxDispatch } from '../../Uberedux';
import { setUbereduxKey } from '../../Uberedux';
import { setPaywallKey } from '../../Paywall';

// ─────────────────────────────────────────────────────────────
// 1️⃣ FingerprintJS: client-side unique ID
// ─────────────────────────────────────────────────────────────
const loadFingerprint = async () => {
  const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return `${window.location.hostname}_${result.visitorId}`;
};

// ─────────────────────────────────────────────────────────────
// 2️⃣ Enhanced device info (async) with combined model lookup + cache
// ─────────────────────────────────────────────────────────────
let cachedModelMap: Record<string, any> | null = null;

export async function getDeviceInfo() {
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const vendor = navigator.vendor || '';
  const isMobile = /Mobi|Android/i.test(ua);

  // Browser detection
  let browser = 'Unknown';
  if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua)) browser = 'Safari';

  // OS detection
  let os = 'Unknown';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac/i.test(ua)) os = 'MacOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';

  // Extract model code (Android and iOS)
  let modelCode: string | null = null;

  // Android UA example: (Linux; Android 13; SM-G998B)
  const androidMatch = ua.match(/\((?:Linux; Android [^;]+; )([^;]+)\)/);
  if (androidMatch && androidMatch[1]) {
    modelCode = androidMatch[1].trim();
  }
  // iOS UA sometimes includes iPhone14,3 style codes
  else if (/iPhone|iPad|iPod/i.test(ua)) {
    const iosMatch = ua.match(/iPhone\d+,\d+|iPad\d+,\d+/i);
    if (iosMatch && iosMatch[0]) modelCode = iosMatch[0];
    else if (/iPhone/i.test(ua)) modelCode = 'iPhone';
    else if (/iPad/i.test(ua)) modelCode = 'iPad';
    else if (/iPod/i.test(ua)) modelCode = 'iPod';
  }

  // Load and cache combined lookup JSON
  let friendlyModel = modelCode;
  try {
    if (!cachedModelMap) {
      const cache = sessionStorage.getItem('deviceModels');
      if (cache) {
        cachedModelMap = JSON.parse(cache);
      } else {
        const res = await fetch('/json/deviceModels.json');
        if (res.ok) {
          cachedModelMap = await res.json();
          sessionStorage.setItem(
            'deviceModels',
            JSON.stringify(cachedModelMap),
          );
        }
      }
    }

    if (cachedModelMap && os && modelCode) {
      const osMap = cachedModelMap[os];
      if (osMap && osMap[modelCode]) {
        friendlyModel = osMap[modelCode];
      }
    }
  } catch (err) {
    console.warn('Device model lookup failed:', err);
  }

  return {
    browser,
    os,
    model: friendlyModel || null,
    modelCode,
    isMobile,
    platform,
    vendor,
    hardwareConcurrency: navigator.hardwareConcurrency ?? null,
    deviceMemory: (navigator as any).deviceMemory ?? null,
    languages: navigator.languages ?? [],
  };
}

// ─────────────────────────────────────────────────────────────
// 3️⃣ Main createTing thunk
// ─────────────────────────────────────────────────────────────
export const createTing =
  () => async (dispatch: TUbereduxDispatch, getState: any) => {
    try {
      const state = getState();
      const current = state?.redux.paywall;

      // Avoid re-creating if already ready
      if (current?.pingReady) return;

      // 1. Generate fingerprint ID
      const id = await loadFingerprint();

      // 2. Geo data via ipgeolocation.io
      const apiKey = process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY;
      let geoData: any = {};
      if (apiKey) {
        try {
          const geoRes = await fetch(
            `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`,
          );
          if (geoRes.ok) {
            geoData = await geoRes.json();
          } else {
            dispatch(
              setUbereduxKey({
                key: 'error',
                value: `Geo API error: ${geoRes.status} ${geoRes.statusText}`,
              }),
            );
          }
        } catch (geoErr) {
          console.error('Geo API fetch failed', geoErr);
        }
      }

      // 3. Device info (now async)
      const device = await getDeviceInfo();

      // 4. Build ping object
      const pingObj = {
        id,
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        ip: geoData.ip,
        country_code: geoData.country_code2,
        country_name: geoData.country_name,
        state_prov: geoData.state_prov,
        city: geoData.city,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        isp: geoData.isp,
        organization: geoData.organization,
        timezone_name: geoData.time_zone?.name,
        timezone_offset: geoData.time_zone?.offset,
        current_time: geoData.time_zone?.current_time,
        currency_code: geoData.currency?.code,
        currency_symbol: geoData.currency?.symbol,
        browser: device.browser,
        os: device.os,
        model: device.model,
        modelCode: device.modelCode,
        isMobile: device.isMobile,
        platform: device.platform,
        vendor: device.vendor,
        hardwareConcurrency: device.hardwareConcurrency,
        deviceMemory: device.deviceMemory,
        languages: Array.isArray(device.languages)
          ? device.languages.join(',')
          : '',
        created: Date.now(),
      };

      // 5. Dispatch into bouncer slice
      dispatch(setPaywallKey('ting', pingObj));
      dispatch(setPaywallKey('tingReady', true));
      //   dispatch(ping());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      dispatch(setUbereduxKey({ key: 'error', value: msg }));
    }
  };
