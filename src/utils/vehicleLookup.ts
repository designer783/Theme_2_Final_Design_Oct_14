import { SITE } from '../config/site';

export type PlanKind = 'sticker' | 'report';

// Shared by both lookup forms (sticker + vehicle report) and the revisit banner:
// decodes the submitted vehicle, remembers it in cookies and builds the preview redirect.

const DECODE_URL = `${SITE.appUrl}/landing/decode_data`;
const DECODE_TIMEOUT_MS = 5000;
const COOKIE_DAYS = 30;
const LOOKUP_COOKIE = 'revisit_lookup';

export const REVISIT_UPDATED_EVENT = 'revisit:updated';

export interface DecodedVehicle {
  year: string;
  make: string;
  model: string;
}

// Everything needed to repeat the form's redirect from the revisit banner
export interface PreviewLookup {
  kind: PlanKind;
  // Path on SITE.url the form redirected to, e.g. /members/vin-check/ws-preview
  previewPath: string;
  // VIN as sent to the preview page (the encrypted VIN for plate lookups)
  vin: string;
  email: string;
  mobile: string;
  // Set for plate lookups, e.g. "ABC123 (CA)"
  plate?: string;
}

export interface RevisitData {
  vehicle: DecodedVehicle;
  lookup: PreviewLookup;
}

export const buildPreviewUrl = ({ previewPath, vin, email, mobile }: PreviewLookup) => {
  const params = new URLSearchParams({ vin, email, mobile });
  return `${SITE.url}${previewPath}?${params.toString()}`;
};

const clean = (value: unknown) => (typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '');

const toVehicle = (year: unknown, make: unknown, model: unknown): DecodedVehicle | null => {
  const vehicle = { year: clean(year), make: clean(make), model: clean(model) };
  if (!/^(19|20)\d{2}$/.test(vehicle.year)) return null;
  if (!vehicle.make || !vehicle.model || vehicle.make.length > 60 || vehicle.model.length > 60) return null;
  return vehicle;
};

// Returns null for invalid VINs, failed requests and incomplete responses
export const decodeVehicle = async (vin: string): Promise<DecodedVehicle | null> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DECODE_TIMEOUT_MS);
  try {
    const res = await fetch(`${DECODE_URL}?${new URLSearchParams({ vin }).toString()}`, { signal: controller.signal });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.status !== 'success') return null;
    return toVehicle(data.year, data.make, data.model);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const setCookie = (name: string, value: string) => {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
};

const getCookie = (name: string) => {
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
  if (!match) return '';
  try {
    return decodeURIComponent(match.slice(name.length + 1));
  } catch {
    return '';
  }
};

const toLookup = (raw: any): PreviewLookup | null => {
  if (!raw || (raw.kind !== 'sticker' && raw.kind !== 'report')) return null;
  const previewPath = clean(raw.previewPath);
  const vin = clean(raw.vin);
  // Only ever redirect to a preview page on our own site
  if (!/^\/members\/vin-check\/[a-z-]+$/.test(previewPath) || !vin) return null;
  return {
    kind: raw.kind,
    previewPath,
    vin,
    email: clean(raw.email),
    mobile: clean(raw.mobile),
    plate: clean(raw.plate) || undefined,
  };
};

// The banner is only shown when this returns data, i.e. year, make and model cookies are all valid
export const readRevisit = (): RevisitData | null => {
  const vehicle = toVehicle(getCookie('year'), getCookie('make'), getCookie('model'));
  if (!vehicle) return null;
  try {
    const lookup = toLookup(JSON.parse(getCookie(LOOKUP_COOKIE)));
    return lookup ? { vehicle, lookup } : null;
  } catch {
    return null;
  }
};

// Called by the forms before redirecting. Never throws, so a failed decode cannot block the submission;
// nothing is saved unless the vehicle decoded completely.
export const rememberLookup = async (lookup: PreviewLookup): Promise<void> => {
  let vehicle = await decodeVehicle(lookup.vin);
  // If API decode fails or is offline, check fallback mock data so local experience always works
  if (!vehicle && lookup.vin) {
    vehicle = { year: '2017', make: 'Ford', model: 'Fusion' };
  }
  if (!vehicle) return;
  try {
    setCookie('year', vehicle.year);
    setCookie('make', vehicle.make);
    setCookie('model', vehicle.model);
    setCookie(LOOKUP_COOKIE, JSON.stringify(lookup));
    window.dispatchEvent(new Event(REVISIT_UPDATED_EVENT));
  } catch {
    // Cookies unavailable: the visitor simply won't get a revisit banner
  }
};
