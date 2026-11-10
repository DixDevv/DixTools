/**
 * ============================================================================
 * Dix Tools — Zero-Key Live Egypt Rates Sync Engine (`/app/api/egypt-rates/route.js`)
 * Re-exports and delegates to the 60-Second Live Oracle Engine (`/app/api/egypt-live-oracle/route.js`)
 * ============================================================================
 */

import {
  TROY_OUNCE_GRAMS as ORACLE_TROY_OUNCE_GRAMS,
  EGYPT_ORACLE_BASELINE,
  formatCairoTimestamp as oracleFormatCairoTimestamp,
  calculateEgyptGoldPrices as oracleCalculateEgyptGoldPrices,
  calculateEgyptSilverPrices as oracleCalculateEgyptSilverPrices,
  fetchEgyptLiveOracleFromApis,
  GET as oracleGET,
} from '../egypt-live-oracle/route.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const TROY_OUNCE_GRAMS = ORACLE_TROY_OUNCE_GRAMS;
export const EGYPT_FALLBACK_BASELINE = EGYPT_ORACLE_BASELINE;
export const formatCairoTimestamp = oracleFormatCairoTimestamp;
export const calculateEgyptGoldPrices = oracleCalculateEgyptGoldPrices;
export const calculateEgyptSilverPrices = oracleCalculateEgyptSilverPrices;
export const fetchEgyptLiveRatesFromApis = fetchEgyptLiveOracleFromApis;
export const GET = oracleGET;
