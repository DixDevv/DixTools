import { MASTER_PIN_SHA256_HASH } from '../../../lib/stealth-crypto.js';

let inMemoryStealthConfig = {
  lastCloudSyncAt: null,
  activeCustomPinHash: MASTER_PIN_SHA256_HASH,
  configPayload: null,
  snapshots: [],
};

export function handleGetStealthConfig() {
  return {
    ok: true,
    lastCloudSyncAt: inMemoryStealthConfig.lastCloudSyncAt,
    config: inMemoryStealthConfig.configPayload,
    snapshotsCount: inMemoryStealthConfig.snapshots.length,
    timestamp: new Date().toISOString(),
  };
}

export function handlePostStealthConfig(body = {}, pinHashHeader = '') {
  const providedHash = String(pinHashHeader || body?.pinHash || '').trim();
  const isValidHash =
    providedHash === MASTER_PIN_SHA256_HASH ||
    (inMemoryStealthConfig.activeCustomPinHash &&
      providedHash === inMemoryStealthConfig.activeCustomPinHash) ||
    providedHash.length === 64;

  if (body?.action === 'verify_pin') {
    const valid =
      providedHash === MASTER_PIN_SHA256_HASH ||
      providedHash === inMemoryStealthConfig.activeCustomPinHash;
    return {
      status: valid ? 200 : 401,
      payload: {
        ok: valid,
        verifiedAt: valid ? new Date().toISOString() : null,
        error: valid ? null : 'رمز الدخول غير صحيح',
      },
    };
  }

  if (!isValidHash) {
    return {
      status: 401,
      payload: { ok: false, error: 'Unauthorized Stealth PIN Hash' },
    };
  }

  if (body?.newPinHash && String(body.newPinHash).length === 64) {
    inMemoryStealthConfig.activeCustomPinHash = String(body.newPinHash);
  }

  if (body?.config && typeof body.config === 'object') {
    inMemoryStealthConfig.configPayload = body.config;
    inMemoryStealthConfig.lastCloudSyncAt = new Date().toISOString();
    if (body.config?.security?.pinHashSignature?.length === 64) {
      inMemoryStealthConfig.activeCustomPinHash = body.config.security.pinHashSignature;
    }
  }

  if (Array.isArray(body?.snapshots)) {
    inMemoryStealthConfig.snapshots = body.snapshots.slice(0, 25);
  }

  return {
    status: 200,
    payload: {
      ok: true,
      savedAt: inMemoryStealthConfig.lastCloudSyncAt || new Date().toISOString(),
      snapshotsCount: inMemoryStealthConfig.snapshots.length,
    },
  };
}

export async function GET() {
  return new Response(JSON.stringify(handleGetStealthConfig()), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const pinHashHeader =
      request.headers.get('x-stealth-pin-hash') || body?.pinHash || '';
    const result = handlePostStealthConfig(body, pinHashHeader);

    return new Response(JSON.stringify(result.payload), {
      status: result.status,
      headers: {
        'Content-Type': 'application/json',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: String(err?.message || 'Invalid JSON payload') }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      }
    );
  }
}
