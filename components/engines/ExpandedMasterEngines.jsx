'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Calculator,
  Printer,
  Copy,
  Check,
  Download,
  Sparkles,
  ShieldCheck,
  BatteryCharging,
  Car,
  PackageCheck,
  IdCard,
  BookOpen,
  Code2,
  Palette,
  FileSignature,
  Share2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { ExcelExportBtn } from '../../lib/export-to-csv';
import { numberToArabicWordsTafqeet } from '../../src/utils/calculations';
import { generateQrMatrix } from '../../src/utils/qrMatrix';
import AdSlot from '../AdSlot';

const fmt = (val, decimals = 2) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/* ============================================================================
 * PURE CALCULATION & ANALYTICAL ENGINES (Exported for Unit Testing & UI)
 * ========================================================================== */

export const EGYPT_ID_GOVERNORATES = {
  '01': 'القاهرة',
  '02': 'الإسكندرية',
  '03': 'بورسعيد',
  '04': 'السويس',
  '11': 'دمياط',
  '12': 'الدقهلية',
  '13': 'الشرقية',
  '14': 'القليوبية',
  '15': 'كفر الشيخ',
  '16': 'الغربية',
  '17': 'المنوفية',
  '18': 'البحيرة',
  '19': 'الإسماعيلية',
  '21': 'الجيزة',
  '22': 'بني سويف',
  '23': 'الفيوم',
  '24': 'المنيا',
  '25': 'أسيوط',
  '26': 'سوهاج',
  '27': 'قنا',
  '28': 'أسوان',
  '29': 'الأقصر',
  '31': 'البحر الأحمر',
  '32': 'الوادي الجديد',
  '33': 'مطروح',
  '34': 'شمال سيناء',
  '35': 'جنوب سيناء',
  '88': 'مولود خارج الجمهورية',
};

function getZodiacSignAr(day, month) {
  const d = Number(day);
  const m = Number(month);
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'برج الحمل ♈';
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'برج الثور ♉';
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'برج الجوزاء ♊';
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'برج السرطان ♋';
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'برج الأسد ♌';
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'برج العذراء ♍';
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'برج الميزان ♎';
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'برج العقرب ♏';
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 'برج القوس ♐';
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'برج الجدي ♑';
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'برج الدلو ♒';
  return 'برج الحوت ♓';
}

/**
 * 1. Egyptian 14-Digit National ID Smart Analyzer (`egypt-national-id-analyzer`)
 */
export function analyzeEgyptNationalId(rawId = '', referenceDate = new Date('2026-11-08T12:00:00Z')) {
  const digits = String(rawId || '').replace(/\D/g, '');
  if (digits.length !== 14) {
    return {
      isValid: false,
      error: 'يجب أن يتكون الرقم القومي المصري من 14 رقماً صحيحاً.',
      digitsCount: digits.length,
    };
  }

  const centuryCode = digits[0];
  if (centuryCode !== '2' && centuryCode !== '3') {
    return {
      isValid: false,
      error: 'الرقم الأول يجب أن يكون 2 (مواليد 1900-1999) أو 3 (مواليد 2000-2099).',
    };
  }

  const centuryBase = centuryCode === '2' ? 1900 : 2000;
  const yy = Number(digits.slice(1, 3));
  const mm = Number(digits.slice(3, 5));
  const dd = Number(digits.slice(5, 7));
  const govCode = digits.slice(7, 9);
  const serialCode = digits.slice(9, 13);
  const genderDigit = Number(digits[12]);
  const checkDigit = Number(digits[13]);

  const birthYear = centuryBase + yy;
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) {
    return {
      isValid: false,
      error: 'تاريخ الميلاد المشفر داخل الرقم القومي غير صحيح.',
    };
  }

  const governorateName = EGYPT_ID_GOVERNORATES[govCode] || 'كود محافظة غير معروف';
  if (!EGYPT_ID_GOVERNORATES[govCode]) {
    return {
      isValid: false,
      error: `كود المحافظة (${govCode}) غير مدرج في السجل المدني المصري.`,
    };
  }

  const birthDate = new Date(Date.UTC(birthYear, mm - 1, dd));
  const refYear = referenceDate.getUTCFullYear();
  const refMonth = referenceDate.getUTCMonth() + 1;
  const refDay = referenceDate.getUTCDate();

  let ageYears = refYear - birthYear;
  let ageMonths = refMonth - mm;
  let ageDays = refDay - dd;

  if (ageDays < 0) {
    ageMonths -= 1;
    ageDays += 30;
  }
  if (ageMonths < 0) {
    ageYears -= 1;
    ageMonths += 12;
  }

  const retirementYear = birthYear + 60;
  const yearsToRetirement = Math.max(0, 60 - ageYears);
  const gender = genderDigit % 2 === 1 ? 'ذكر' : 'أنثى';
  const zodiacSign = getZodiacSignAr(dd, mm);
  const birthDateFormatted = `${birthYear}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  const retirementDateFormatted = `${retirementYear}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;

  return {
    isValid: true,
    nationalId: digits,
    birthYear,
    birthMonth: mm,
    birthDay: dd,
    birthDateFormatted,
    centuryLabel: centuryCode === '2' ? 'القرن العشرون (1900 - 1999)' : 'القرن الحادي والعشرون (2000 - 2099)',
    governorateCode: govCode,
    governorateName,
    gender,
    serialNumber: serialCode,
    checkDigit,
    zodiacSign,
    ageYears: Math.max(0, ageYears),
    ageMonths: Math.max(0, ageMonths),
    ageDays: Math.max(0, ageDays),
    retirementYear,
    retirementDateFormatted,
    yearsToRetirement,
    isLegalAdult: ageYears >= 18,
    birthDayOfWeekAr: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][
      birthDate.getUTCDay()
    ],
  };
}

/**
 * 2. Lithium Battery Pack & BMS Calculator (`battery-pack-bms-calc`)
 */
export function calculateBatteryPackAndBms({
  cellChemistry = 'li-ion-3.7',
  seriesCountS = 3,
  parallelCountP = 4,
  singleCellCapacityMah = 2600,
  singleCellMaxDischargeAmp = 10,
  connectedLoadWatts = 60,
}) {
  const S = Math.max(1, Number(seriesCountS) || 3);
  const P = Math.max(1, Number(parallelCountP) || 4);
  const cellMah = Math.max(100, Number(singleCellCapacityMah) || 2600);
  const cellAmp = Math.max(1, Number(singleCellMaxDischargeAmp) || 10);
  const loadW = Math.max(1, Number(connectedLoadWatts) || 60);

  const isLiFePO4 = cellChemistry === 'lifepo4-3.2';
  const nomCellV = isLiFePO4 ? 3.2 : 3.7;
  const maxCellV = isLiFePO4 ? 3.65 : 4.2;
  const minCellV = isLiFePO4 ? 2.5 : 3.0;

  const totalCellsCount = S * P;
  const nominalVoltage = Number((S * nomCellV).toFixed(2));
  const maxChargeVoltage = Number((S * maxCellV).toFixed(2));
  const cutoffVoltage = Number((S * minCellV).toFixed(2));

  const totalCapacityMah = cellMah * P;
  const totalCapacityAh = Number((totalCapacityMah / 1000).toFixed(2));
  const totalEnergyWh = Number((nominalVoltage * totalCapacityAh).toFixed(2));
  const usableEnergyWh = Number((totalEnergyWh * 0.85).toFixed(2));

  const maxContinuousDischargeAmp = Number((P * cellAmp).toFixed(1));
  const maxPowerOutputWatts = Math.round(nominalVoltage * maxContinuousDischargeAmp);
  const loadCurrentAmp = Number((loadW / nominalVoltage).toFixed(2));
  const estimatedRuntimeHours = Number((usableEnergyWh / loadW).toFixed(2));

  const standardBmsAmps = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200];
  const targetBmsAmp = Math.max(Math.ceil(loadCurrentAmp * 1.35), Math.min(maxContinuousDischargeAmp, 20));
  const recommendedBmsAmp =
    standardBmsAmps.find((a) => a >= targetBmsAmp) || Math.ceil(targetBmsAmp);

  return {
    configCode: `${S}S${P}P`,
    chemistryName: isLiFePO4 ? 'LiFePO4 (فوسفات الحديد 3.2V)' : 'Li-ion 18650 / 21700 (3.7V)',
    seriesCountS: S,
    parallelCountP: P,
    totalCellsCount,
    nominalVoltage,
    maxChargeVoltage,
    cutoffVoltage,
    totalCapacityMah,
    totalCapacityAh,
    totalEnergyWh,
    usableEnergyWh,
    maxContinuousDischargeAmp,
    maxPowerOutputWatts,
    loadCurrentAmp,
    estimatedRuntimeHours,
    recommendedBmsSpec: `${S}S ${recommendedBmsAmp}A (${isLiFePO4 ? 'LiFePO4' : 'Li-ion'} BMS)`,
    recommendedChargerSpec: `${maxChargeVoltage}V / ${Math.max(2, Math.round(totalCapacityAh * 0.3))}A CC-CV`,
  };
}

/**
 * 3. Ride-Share & Delivery Captain Net Profit Calculator (`ride-driver-net-profit`)
 */
export function calculateRideDriverProfit({
  vehicleType = 'car',
  dailyGrossRevenueEgp = 1650,
  dailyDistanceKm = 240,
  appCommissionPercent = 18,
  fuelPricePerLiter = 22.25,
  consumptionPer100Km = 8.5,
  workingDaysPerMonth = 26,
  dailyWorkHours = 10,
  oilAndMaintenancePerKmEgp = 0.85,
}) {
  const grossDaily = Math.max(0, Number(dailyGrossRevenueEgp) || 0);
  const kmDaily = Math.max(1, Number(dailyDistanceKm) || 1);
  const commPct = Math.max(0, Number(appCommissionPercent) || 0);
  const fuelPrice = Math.max(1, Number(fuelPricePerLiter) || 22.25);
  const cons100 = Math.max(0.5, Number(consumptionPer100Km) || (vehicleType === 'motorcycle' ? 3.2 : 8.5));
  const daysMonth = Math.max(1, Number(workingDaysPerMonth) || 26);
  const hoursDay = Math.max(1, Number(dailyWorkHours) || 10);
  const maintPerKm =
    oilAndMaintenancePerKmEgp !== undefined
      ? Number(oilAndMaintenancePerKmEgp)
      : vehicleType === 'motorcycle'
      ? 0.35
      : 0.85;

  const dailyFuelLiters = Number(((kmDaily * cons100) / 100).toFixed(2));
  const dailyFuelCostEgp = Number((dailyFuelLiters * fuelPrice).toFixed(2));
  const dailyAppCommissionEgp = Number(((grossDaily * commPct) / 100).toFixed(2));
  const dailyMaintenanceDepreciationEgp = Number((kmDaily * maintPerKm).toFixed(2));

  const totalDailyExpensesEgp = Number(
    (dailyFuelCostEgp + dailyAppCommissionEgp + dailyMaintenanceDepreciationEgp).toFixed(2)
  );
  const netDailyProfitEgp = Number((grossDaily - totalDailyExpensesEgp).toFixed(2));
  const netMonthlyProfitEgp = Math.round(netDailyProfitEgp * daysMonth);
  const netHourlyWageEgp = Number((netDailyProfitEgp / hoursDay).toFixed(2));
  const netProfitPerKmEgp = Number((netDailyProfitEgp / kmDaily).toFixed(2));
  const expenseRatioPercent =
    grossDaily > 0 ? Number(((totalDailyExpensesEgp / grossDaily) * 100).toFixed(1)) : 0;

  return {
    dailyFuelLiters,
    dailyFuelCostEgp,
    dailyAppCommissionEgp,
    dailyMaintenanceDepreciationEgp,
    totalDailyExpensesEgp,
    netDailyProfitEgp,
    netMonthlyProfitEgp,
    netHourlyWageEgp,
    netProfitPerKmEgp,
    expenseRatioPercent,
  };
}

/**
 * 4. COD Shipping Reconciliation Auditor (`cod-shipping-reconciliation`)
 */
export function calculateCodShippingReconciliation({
  deliveredOrdersCount = 96,
  returnedOrdersCount = 18,
  pendingOrdersCount = 6,
  avgOrderCodValueEgp = 580,
  shippingFeePerOrderEgp = 65,
  returnFeePerOrderEgp = 35,
  codCollectionFeePercent = 1,
  actualCompanyPayoutEgp = 48500,
}) {
  const delivered = Math.max(0, Number(deliveredOrdersCount) || 0);
  const returned = Math.max(0, Number(returnedOrdersCount) || 0);
  const pending = Math.max(0, Number(pendingOrdersCount) || 0);
  const totalOrders = delivered + returned + pending;

  const avgCod = Math.max(0, Number(avgOrderCodValueEgp) || 0);
  const shipFee = Math.max(0, Number(shippingFeePerOrderEgp) || 0);
  const retFee = Math.max(0, Number(returnFeePerOrderEgp) || 0);
  const codPct = Math.max(0, Number(codCollectionFeePercent) || 0);
  const actualPayout = Number(actualCompanyPayoutEgp) || 0;

  const grossCollectedCodEgp = Math.round(delivered * avgCod);
  const deliveredShippingTotalEgp = Math.round(delivered * shipFee);
  const returnedPenaltyTotalEgp = Math.round(returned * retFee);
  const codCollectionFeeTotalEgp = Math.round((grossCollectedCodEgp * codPct) / 100);

  const totalShippingCompanyDeductionsEgp =
    deliveredShippingTotalEgp + returnedPenaltyTotalEgp + codCollectionFeeTotalEgp;

  const expectedNetPayoutEgp = grossCollectedCodEgp - totalShippingCompanyDeductionsEgp;
  const payoutVarianceEgp = actualPayout - expectedNetPayoutEgp;
  const deliveryRatePercent =
    totalOrders > 0 ? Number(((delivered / totalOrders) * 100).toFixed(1)) : 0;

  return {
    totalOrders,
    deliveredOrdersCount: delivered,
    returnedOrdersCount: returned,
    pendingOrdersCount: pending,
    deliveryRatePercent,
    grossCollectedCodEgp,
    deliveredShippingTotalEgp,
    returnedPenaltyTotalEgp,
    codCollectionFeeTotalEgp,
    totalShippingCompanyDeductionsEgp,
    expectedNetPayoutEgp,
    actualCompanyPayoutEgp: actualPayout,
    payoutVarianceEgp,
    hasShortage: payoutVarianceEgp < 0,
  };
}

/**
 * 5. Monthly ROSCA (Gameya) Organizer (`rosca-gameya-calculator`)
 */
export function calculateRoscaGameyaSchedule({
  monthlyShareEgp = 3000,
  membersCount = 10,
  startMonth = '2026-12',
  adminReserveFeeEgp = 0,
  memberNames = [],
}) {
  const share = Math.max(100, Number(monthlyShareEgp) || 3000);
  const count = Math.min(36, Math.max(2, Number(membersCount) || 10));
  const reserve = Math.max(0, Number(adminReserveFeeEgp) || 0);

  const grossMonthlyPotEgp = share * count;
  const netMonthlyPotEgp = Math.max(0, grossMonthlyPotEgp - reserve);

  const [startY, startM] = String(startMonth || '2026-12')
    .split('-')
    .map(Number);
  const baseYear = startY || 2026;
  const baseMonth = (startM || 12) - 1;

  const arabicMonths = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];

  const schedule = Array.from({ length: count }, (_, idx) => {
    const d = new Date(Date.UTC(baseYear, baseMonth + idx, 1));
    const mName = `${arabicMonths[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    const defaultMemberName =
      memberNames[idx] ||
      (idx === 0
        ? 'العضو الأول (أول قبض)'
        : idx === count - 1
        ? `العضو رقم ${idx + 1} (آخر قبض)`
        : `العضو المشترك رقم ${idx + 1}`);
    return {
      turnOrder: idx + 1,
      monthLabel: mName,
      memberName: defaultMemberName,
      monthlyPaidEgp: share,
      netPayoutEgp: netMonthlyPotEgp,
      statusLabel: idx === 0 ? 'قبض الشهر الأول' : `الدور #${idx + 1}`,
    };
  });

  return {
    monthlyShareEgp: share,
    membersCount: count,
    grossMonthlyPotEgp,
    netMonthlyPotEgp,
    totalTurnoverEgp: grossMonthlyPotEgp * count,
    schedule,
  };
}

/**
 * 6. Egypt Net/Gross Salary & Tax Calculator (`egypt-net-salary-tax`)
 */
export function calculateEgyptSalaryTax({
  calcDirection = 'gross-to-net',
  monthlySalaryEgp = 18000,
  insuranceSalaryEgp = 12600,
  monthlyBonusesEgp = 0,
}) {
  const inputSal = Math.max(1000, Number(monthlySalaryEgp) || 18000);
  const bonus = Math.max(0, Number(monthlyBonusesEgp) || 0);
  const insWage = Math.min(14500, Math.max(2300, Number(insuranceSalaryEgp) || 12600));

  const computeFromGross = (grossMonthly) => {
    const totalGrossMonthly = grossMonthly + bonus;
    const employeeInsuranceMonthly = Math.round(insWage * 0.11);
    const employerInsuranceMonthly = Math.round(insWage * 0.1875);
    const annualGross = totalGrossMonthly * 12;
    const annualInsurance = employeeInsuranceMonthly * 12;
    const personalExemptionAnnual = 20000;
    const taxableAnnual = Math.max(0, annualGross - annualInsurance - personalExemptionAnnual);

    // Egyptian progressive tax brackets
    let annualTax = 0;
    if (taxableAnnual > 40000) {
      const b1 = Math.min(taxableAnnual - 40000, 15000);
      annualTax += b1 * 0.1;
    }
    if (taxableAnnual > 55000) {
      const b2 = Math.min(taxableAnnual - 55000, 15000);
      annualTax += b2 * 0.15;
    }
    if (taxableAnnual > 70000) {
      const b3 = Math.min(taxableAnnual - 70000, 130000);
      annualTax += b3 * 0.2;
    }
    if (taxableAnnual > 200000) {
      const b4 = Math.min(taxableAnnual - 200000, 200000);
      annualTax += b4 * 0.225;
    }
    if (taxableAnnual > 400000) {
      annualTax += (taxableAnnual - 400000) * 0.25;
    }

    const monthlyIncomeTax = Math.round(annualTax / 12);
    const martyrsFundMonthly = Number((totalGrossMonthly * 0.0005).toFixed(2));
    const totalMonthlyDeductions = Math.round(
      employeeInsuranceMonthly + monthlyIncomeTax + martyrsFundMonthly
    );
    const netMonthlySalary = Math.round(totalGrossMonthly - totalMonthlyDeductions);

    return {
      grossMonthlySalary: Math.round(totalGrossMonthly),
      netMonthlySalary,
      employeeInsuranceMonthly,
      employerInsuranceMonthly,
      monthlyIncomeTax,
      martyrsFundMonthly,
      totalMonthlyDeductions,
      effectiveTaxRatePercent:
        totalGrossMonthly > 0
          ? Number(((totalMonthlyDeductions / totalGrossMonthly) * 100).toFixed(1))
          : 0,
      totalCompanyCostMonthly: Math.round(totalGrossMonthly + employerInsuranceMonthly),
    };
  };

  if (calcDirection === 'net-to-gross') {
    let low = inputSal;
    let high = inputSal * 1.65;
    for (let i = 0; i < 25; i++) {
      const mid = (low + high) / 2;
      const test = computeFromGross(mid);
      if (test.netMonthlySalary < inputSal) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return computeFromGross((low + high) / 2);
  }

  return computeFromGross(inputSal);
}

/**
 * 7. AC BTU & Horsepower Calculator (`ac-btu-horsepower-calc`)
 */
export function calculateAcBtuAndHorsepower({
  roomLengthM = 5,
  roomWidthM = 4,
  ceilingHeightM = 3,
  isTopFloor = false,
  sunExposure = 'medium',
  occupantsCount = 3,
  isInverter = true,
  electricityRateKwh = 1.95,
}) {
  const areaSqm = Number((Math.max(2, Number(roomLengthM) || 5) * Math.max(2, Number(roomWidthM) || 4)).toFixed(1));
  const heightM = Math.max(2.4, Number(ceilingHeightM) || 3);
  const volumeCubicM = Number((areaSqm * heightM).toFixed(1));

  let baseBtuPerCubicM = 280;
  if (sunExposure === 'high') baseBtuPerCubicM = 330;
  if (sunExposure === 'low') baseBtuPerCubicM = 250;
  if (isTopFloor) baseBtuPerCubicM += 45;

  const peopleExtraBtu = Math.max(0, (Number(occupantsCount) || 2) - 2) * 600;
  const requiredBtu = Math.round(volumeCubicM * baseBtuPerCubicM + peopleExtraBtu);

  const acSizes = [
    { hp: 1.5, btu: 12000, wireMm2: 2.5, breakerAmp: 16, avgKw: 1.15 },
    { hp: 2.25, btu: 18000, wireMm2: 4.0, breakerAmp: 25, avgKw: 1.65 },
    { hp: 3.0, btu: 24000, wireMm2: 4.0, breakerAmp: 32, avgKw: 2.25 },
    { hp: 4.0, btu: 30000, wireMm2: 6.0, breakerAmp: 40, avgKw: 2.95 },
    { hp: 5.0, btu: 36000, wireMm2: 6.0, breakerAmp: 40, avgKw: 3.6 },
  ];

  const matchedAc = acSizes.find((s) => s.btu >= requiredBtu) || acSizes[acSizes.length - 1];
  const inverterSavingFactor = isInverter ? 0.68 : 1.0;
  const dailyKwhAt8Hours = Number((matchedAc.avgKw * 8 * inverterSavingFactor).toFixed(1));
  const monthlyElectricityCostEgp = Math.round(dailyKwhAt8Hours * 30 * (Number(electricityRateKwh) || 1.95));

  return {
    areaSqm,
    volumeCubicM,
    requiredBtu,
    recommendedHorsepower: matchedAc.hp,
    nominalUnitBtu: matchedAc.btu,
    recommendedWireMm2: matchedAc.wireMm2,
    recommendedBreakerAmp: matchedAc.breakerAmp,
    dailyKwhAt8Hours,
    monthlyElectricityCostEgp,
  };
}

/* ============================================================================
 * SPECIALIZED INTERACTIVE UI 1: EGYPT NATIONAL ID ANALYZER (`egypt-national-id-analyzer`)
 * ========================================================================== */
function EgyptNationalIdAnalyzerEngine({ defaultParams = {} }) {
  const [nationalIdInput, setNationalIdInput] = useState(
    defaultParams.nationalIdInput || '29507150101234'
  );
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(
    () => analyzeEgyptNationalId(nationalIdInput),
    [nationalIdInput]
  );

  const sampleIds = [
    { label: 'مواليد القاهرة (1995)', id: '29507150101234' },
    { label: 'مواليد الإسكندرية (2001)', id: '30103220202468' },
    { label: 'مواليد الجيزة (1988)', id: '28811042101539' },
    { label: 'مولود بالخارج (2004)', id: '30409108801357' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <IdCard className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base font-black text-white">
              أدخل الرقم القومي المصري المكون من 14 رقماً (من اليسار لليمين)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-emerald-400">
            🔒 يعمل 100% داخل متصفحك بدون إرسال أو تخزين أي بيانات
          </span>
        </div>

        <input
          type="text"
          dir="ltr"
          maxLength={14}
          data-testid="national-id-input"
          value={nationalIdInput}
          onChange={(e) => setNationalIdInput(e.target.value.replace(/\D/g, '').slice(0, 14))}
          placeholder="29507150101234"
          className="font-num w-full rounded-2xl bg-[#0A0A0A] border-2 border-[#D4AF37] px-5 py-4 text-xl sm:text-2xl font-black tracking-[0.22em] text-center text-[#D4AF37] focus:outline-none"
        />

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-bold">أمثلة تجريبية سريعة:</span>
          {sampleIds.map((smp) => (
            <button
              key={smp.id}
              type="button"
              onClick={() => setNationalIdInput(smp.id)}
              className="px-3 py-1.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 hover:border-[#D4AF37] text-xs font-bold text-[#F3E5AB] cursor-pointer"
            >
              {smp.label}
            </button>
          ))}
        </div>
      </div>

      {!analysis.isValid ? (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-5 text-amber-200 text-sm font-bold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{analysis.error}</span>
        </div>
      ) : (
        <div
          id="tool-result-card"
          data-testid="national-id-result-card"
          className="rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-b from-[#1B1506] via-[#111111] to-[#0A0A0A] p-6 space-y-6 shadow-2xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#D4AF37] block">
                بطاقة التحليل الفوري للرقم القومي المصري
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                محافظة الميلاد: <span className="text-[#D4AF37]">{analysis.governorateName}</span> (كود{' '}
                {analysis.governorateCode})
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `الرقم القومي: ${analysis.nationalId}\nتاريخ الميلاد: ${analysis.birthDateFormatted}\nالمحافظة: ${analysis.governorateName}\nالنوع: ${analysis.gender}\nالعمر: ${analysis.ageYears} سنة و ${analysis.ageMonths} شهر\nتاريخ التقاعد: ${analysis.retirementDateFormatted}`
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم نسخ البيانات' : 'نسخ التقرير'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141414] border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-bold cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
              <span className="text-[11px] text-slate-400 block">تاريخ الميلاد ويوم الأسبوع</span>
              <div className="font-num text-lg font-black text-[#D4AF37]">
                {analysis.birthDateFormatted}
              </div>
              <span className="text-[11px] text-emerald-400 font-bold block">
                يوم {analysis.birthDayOfWeekAr} · {analysis.centuryLabel}
              </span>
            </div>

            <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
              <span className="text-[11px] text-slate-400 block">العمر الدقيق الآن</span>
              <div className="text-lg font-black text-white">
                {analysis.ageYears} سنة و {analysis.ageMonths} شهر
              </div>
              <span className="text-[11px] text-[#F3E5AB] font-bold block">
                و {analysis.ageDays} يوماً ({analysis.isLegalAdult ? 'بالغ قانونياً' : 'قاصر'})
              </span>
            </div>

            <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
              <span className="text-[11px] text-slate-400 block">النوع والبرج الفلكي</span>
              <div className="text-lg font-black text-white">{analysis.gender}</div>
              <span className="text-[11px] text-[#D4AF37] font-bold block">
                {analysis.zodiacSign}
              </span>
            </div>

            <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
              <span className="text-[11px] text-slate-400 block">تاريخ بلوغ سن المعاش (60 سنة)</span>
              <div className="font-num text-lg font-black text-emerald-400">
                {analysis.retirementDateFormatted}
              </div>
              <span className="text-[11px] text-slate-300 font-bold block">
                يتبقى {analysis.yearsToRetirement} سنة على التقاعد
              </span>
            </div>
          </div>

          {/* Visual Breakdown of the 14 Digits */}
          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-3">
            <h5 className="text-xs font-black text-[#F3E5AB]">
              تشريح خانات الرقم القومي الـ 14 بالتفصيل:
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
              <div className="rounded-xl bg-[#141414] p-2.5 border border-neutral-800">
                <div className="font-num text-base font-black text-[#D4AF37]">
                  {analysis.nationalId[0]}
                </div>
                <div className="text-[11px] text-slate-300 font-bold">كود القرن</div>
              </div>
              <div className="rounded-xl bg-[#141414] p-2.5 border border-neutral-800">
                <div className="font-num text-base font-black text-[#D4AF37]">
                  {analysis.nationalId.slice(1, 7)}
                </div>
                <div className="text-[11px] text-slate-300 font-bold">سنة/شهر/يوم الميلاد</div>
              </div>
              <div className="rounded-xl bg-[#141414] p-2.5 border border-neutral-800">
                <div className="font-num text-base font-black text-emerald-400">
                  {analysis.governorateCode}
                </div>
                <div className="text-[11px] text-slate-300 font-bold">
                  كود {analysis.governorateName}
                </div>
              </div>
              <div className="rounded-xl bg-[#141414] p-2.5 border border-neutral-800">
                <div className="font-num text-base font-black text-sky-400">
                  {analysis.serialNumber}
                </div>
                <div className="text-[11px] text-slate-300 font-bold">مسلسل السجل والنوع</div>
              </div>
              <div className="rounded-xl bg-[#141414] p-2.5 border border-neutral-800">
                <div className="font-num text-base font-black text-amber-300">
                  {analysis.checkDigit}
                </div>
                <div className="text-[11px] text-slate-300 font-bold">رقم التحقق الرقابي</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * SPECIALIZED INTERACTIVE UI 2: KIDS WORKSHEET GENERATOR (`kids-worksheet-generator`)
 * ========================================================================== */
function KidsWorksheetGeneratorEngine({ defaultParams = {} }) {
  const [childName, setChildName] = useState(defaultParams.childName || 'أحمد');
  const [gradeLevel, setGradeLevel] = useState(defaultParams.gradeLevel || 'kg2');
  const [worksheetType, setWorksheetType] = useState(
    defaultParams.worksheetType || 'addition-subtraction'
  );
  const [maxNumberLimit, setMaxNumberLimit] = useState(defaultParams.maxNumberLimit || 20);
  const [showAnswers, setShowAnswers] = useState(false);
  const [seed, setSeed] = useState(1);

  const exercises = useMemo(() => {
    const maxN = Math.max(5, Number(maxNumberLimit) || 20);
    const items = [];
    for (let i = 0; i < 12; i++) {
      const a = ((i * 7 + seed * 3) % (maxN - 2)) + 2;
      const b = ((i * 5 + seed * 2) % Math.max(2, a - 1)) + 1;

      if (worksheetType === 'multiplication') {
        const m1 = (i % 9) + 2;
        const m2 = ((i + seed) % 9) + 2;
        items.push({
          id: i + 1,
          prompt: `${m1} × ${m2} =`,
          answer: `${m1 * m2}`,
          hint: 'جدول الضرب الذكي',
        });
      } else if (worksheetType === 'compare') {
        const right = i % 3 === 0 ? a : b;
        const sign = a > right ? '>' : a < right ? '<' : '=';
        items.push({
          id: i + 1,
          prompt: `${a}   [ ___ ]   ${right}`,
          answer: sign,
          hint: 'ضع علامة ( > أو < أو = )',
        });
      } else if (worksheetType === 'arabic-letters') {
        const letters = [
          { l: 'أ — أرنب 🐇', trace: 'أ   أ   أ   أ' },
          { l: 'ب — بطة 🦆', trace: 'ب   ب   ب   ب' },
          { l: 'ت — تفاحة 🍎', trace: 'ت   ت   ت   ت' },
          { l: 'ث — ثعلب 🦊', trace: 'ث   ث   ث   ث' },
          { l: 'ج — جمل 🐪', trace: 'ج   ج   ج   ج' },
          { l: 'ح — حصان 🐎', trace: 'ح   ح   ح   ح' },
          { l: 'خ — خروف 🐑', trace: 'خ   خ   خ   خ' },
          { l: 'د — ديك 🐓', trace: 'د   د   د   د' },
          { l: 'ذ — ذرة 🌽', trace: 'ذ   ذ   ذ   ذ' },
          { l: 'ر — رمان  pomegranate', trace: 'ر   ر   ر   ر' },
          { l: 'ز — زرافة 🦒', trace: 'ز   ز   ز   ز' },
          { l: 'س — سمكة 🐟', trace: 'س   س   س   س' },
        ];
        const chosen = letters[i % letters.length];
        items.push({
          id: i + 1,
          prompt: chosen.l,
          answer: chosen.trace,
          hint: 'اكتب الحرف ولونه بخط جميل',
        });
      } else {
        const isAdd = i % 2 === 0;
        items.push({
          id: i + 1,
          prompt: isAdd ? `${a} + ${b} =` : `${a + b} - ${b} =`,
          answer: isAdd ? `${a + b}` : `${a}`,
          hint: isAdd ? 'عملية جمع (+)' : 'عملية طرح (-)',
        });
      }
    }
    return items;
  }, [worksheetType, maxNumberLimit, seed]);

  return (
    <div className="space-y-6">
      <div className="no-print rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">اسم الطفل / الطالب أعلى الشيت</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">المرحلة العمرية والدراسية</label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
            >
              <option value="kg1">تأسيس حضانة KG1 (من 4 إلى 5 سنوات)</option>
              <option value="kg2">تأسيس متقدم KG2 (من 5 إلى 6 سنوات)</option>
              <option value="grade1">الصف الأول والثاني الابتدائي</option>
              <option value="grade3">الصف الثالث والرابع الابتدائي</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">نوع شيت التمارين</label>
            <select
              value={worksheetType}
              onChange={(e) => setWorksheetType(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
            >
              <option value="addition-subtraction">تمارين جمع وطرح الأرقام (+ / -)</option>
              <option value="compare">مقارنة الأرقام (أكبر من &gt; أو أصغر من &lt;)</option>
              <option value="multiplication">تمارين جدول الضرب الأساسي (×)</option>
              <option value="arabic-letters">تأسيس الحروف العربية والكلمات المصورة</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">أقصى سقف للأرقام في التمرين</label>
            <select
              value={maxNumberLimit}
              onChange={(e) => setMaxNumberLimit(Number(e.target.value))}
              className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-[#D4AF37]"
            >
              <option value={10}>الأرقام حتى 10 (مبتدئ KG1)</option>
              <option value={20}>الأرقام حتى 20 (متوسط KG2)</option>
              <option value={50}>الأرقام حتى 50 (ابتدائي)</option>
              <option value={100}>الأرقام حتى 100 (متقدم)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-bold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>توليد مسائل وأرقام جديدة</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAnswers((v) => !v)}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                showAnswers
                  ? 'bg-emerald-500 text-black font-black'
                  : 'bg-[#0A0A0A] border border-neutral-800 text-slate-300'
              }`}
            >
              {showAnswers ? 'إخفاء نموذج الإجابة للمعلم/الأم' : 'إظهار نموذج الإجابة الصحيحة'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer shadow-lg"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الشيت الآن (A4 PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable A4 Kids Worksheet Sheet */}
      <div
        id="tool-result-card"
        data-testid="kids-worksheet-a4-sheet"
        className="rounded-3xl border-2 border-[#D4AF37] bg-[#0A0A0A] p-6 sm:p-8 space-y-6 shadow-2xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed border-[#D4AF37]/50 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-[#D4AF37] block">
              شيت تأسيس وتدريب ذكي — جاهز للطباعة الفورية A4
            </span>
            <h4 className="text-xl font-black text-white">
              بطل اليوم المتميز: <span className="text-[#D4AF37]">{childName || 'بطل المستقبل'}</span> 🌟
            </h4>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-300 font-bold">
            <span>الدرجة النهائية: ____ / 12</span>
            <span>التقييم: ⭐⭐⭐⭐⭐</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="rounded-2xl border border-neutral-800 bg-[#141414] p-4 flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-num px-2 py-0.5 rounded bg-[#0A0A0A] text-[#D4AF37] font-bold">
                  سؤال #{ex.id}
                </span>
                <span>{ex.hint}</span>
              </div>
              <div
                dir={worksheetType === 'arabic-letters' ? 'rtl' : 'ltr'}
                className="font-num text-xl font-black text-white text-center py-2 bg-[#0A0A0A] rounded-xl border border-neutral-800"
              >
                {ex.prompt}{' '}
                <span className="text-[#D4AF37]">
                  {showAnswers ? ex.answer : worksheetType === 'arabic-letters' ? '' : '____'}
                </span>
              </div>
              {worksheetType === 'arabic-letters' && (
                <div className="text-center font-bold text-slate-400 tracking-[0.35em] text-sm py-1 border-t border-dashed border-neutral-800">
                  {ex.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * SPECIALIZED INTERACTIVE UI 3: LITHIUM BATTERY PACK & BMS (`battery-pack-bms-calc`)
 * ========================================================================== */
function BatteryPackBmsEngine({ defaultParams = {} }) {
  const [cellChemistry, setCellChemistry] = useState(defaultParams.cellChemistry || 'li-ion-3.7');
  const [seriesCountS, setSeriesCountS] = useState(defaultParams.seriesCountS || 3);
  const [parallelCountP, setParallelCountP] = useState(defaultParams.parallelCountP || 4);
  const [singleCellCapacityMah, setSingleCellCapacityMah] = useState(
    defaultParams.singleCellCapacityMah || 2600
  );
  const [singleCellMaxDischargeAmp, setSingleCellMaxDischargeAmp] = useState(
    defaultParams.singleCellMaxDischargeAmp || 10
  );
  const [connectedLoadWatts, setConnectedLoadWatts] = useState(
    defaultParams.connectedLoadWatts || 60
  );

  const pack = useMemo(
    () =>
      calculateBatteryPackAndBms({
        cellChemistry,
        seriesCountS,
        parallelCountP,
        singleCellCapacityMah,
        singleCellMaxDischargeAmp,
        connectedLoadWatts,
      }),
    [
      cellChemistry,
      seriesCountS,
      parallelCountP,
      singleCellCapacityMah,
      singleCellMaxDischargeAmp,
      connectedLoadWatts,
    ]
  );

  const quickPackPresets = [
    { label: 'بطارية 12V (3S4P)', s: 3, p: 4, chem: 'li-ion-3.7' },
    { label: 'بطارية 12.8V LiFePO4 (4S2P)', s: 4, p: 2, chem: 'lifepo4-3.2' },
    { label: 'بطارية 24V (7S4P)', s: 7, p: 4, chem: 'li-ion-3.7' },
    { label: 'بطارية سكوتر 36V (10S4P)', s: 10, p: 4, chem: 'li-ion-3.7' },
    { label: 'بطارية 48V (13S5P)', s: 13, p: 5, chem: 'li-ion-3.7' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-neutral-800">
          <span className="text-xs font-bold text-slate-400">قوالب تجميع شهيرة جاهزة:</span>
          {quickPackPresets.map((pr) => (
            <button
              key={pr.label}
              type="button"
              onClick={() => {
                setSeriesCountS(pr.s);
                setParallelCountP(pr.p);
                setCellChemistry(pr.chem);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 hover:border-[#D4AF37] text-xs font-bold text-[#F3E5AB] cursor-pointer"
            >
              {pr.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">كيمياء ونوع الخلية (Cell Type)</label>
            <select
              value={cellChemistry}
              onChange={(e) => setCellChemistry(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
            >
              <option value="li-ion-3.7">Li-ion 18650 / 21700 (اسمي 3.7V — شحن 4.2V)</option>
              <option value="lifepo4-3.2">LiFePO4 فوسفات الحديد (اسمي 3.2V — شحن 3.65V)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">
              عدد الخلايا على التوالي (Series — S) لرفع الفولت
            </label>
            <input
              type="number"
              min={1}
              max={40}
              value={seriesCountS}
              onChange={(e) => setSeriesCountS(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-[#D4AF37]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">
              عدد الخلايا على التوازي (Parallel — P) لرفع الأمبير
            </label>
            <input
              type="number"
              min={1}
              max={40}
              value={parallelCountP}
              onChange={(e) => setParallelCountP(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-[#D4AF37]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">سعة الخلية الواحدة (mAh)</label>
            <input
              type="number"
              value={singleCellCapacityMah}
              onChange={(e) => setSingleCellCapacityMah(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              أقصى تيار تفريغ مستمر للخلية (A)
            </label>
            <input
              type="number"
              value={singleCellMaxDischargeAmp}
              onChange={(e) => setSingleCellMaxDischargeAmp(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              الحمل الموصل بالبطارية (واط — Watts)
            </label>
            <input
              type="number"
              value={connectedLoadWatts}
              onChange={(e) => setConnectedLoadWatts(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-emerald-400"
            />
          </div>
        </div>
      </div>

      <div
        id="tool-result-card"
        data-testid="battery-pack-result-card"
        className="rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-b from-[#1A1506] to-[#0A0A0A] p-6 space-y-5 shadow-2xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-extrabold text-[#D4AF37] block">
              المخطط الهندسي لمصفوفة البطارية ({pack.configCode})
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-white">
              الفولت الكلي: <span className="font-num text-[#D4AF37]">{pack.nominalVoltage}V</span> · السعة:{' '}
              <span className="font-num text-emerald-400">{pack.totalCapacityAh} Ah</span> ({fmt(pack.totalEnergyWh)} Wh)
            </h4>
          </div>
          <span className="font-num px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black">
            إجمالي الخلايا: {pack.totalCellsCount} خلية
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">فولت الشحن الكامل (100%)</span>
            <div className="font-num text-lg font-black text-[#D4AF37]">
              {pack.maxChargeVoltage} V
            </div>
            <span className="text-[11px] text-slate-400 block">
              فولت الفصل الآمن: {pack.cutoffVoltage} V
            </span>
          </div>

          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">أقصى تيار وقدرة تفريغ</span>
            <div className="font-num text-lg font-black text-white">
              {pack.maxContinuousDischargeAmp} A
            </div>
            <span className="text-[11px] text-emerald-400 font-bold block">
              حتى {fmt(pack.maxPowerOutputWatts, 0)} واط
            </span>
          </div>

          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">شريحة الحماية المطلوبة (BMS)</span>
            <div dir="ltr" className="font-num text-sm font-black text-[#F3E5AB]">
              {pack.recommendedBmsSpec}
            </div>
            <span className="text-[11px] text-slate-400 block">
              الشاحن: {pack.recommendedChargerSpec}
            </span>
          </div>

          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">
              زمن التشغيل عند حمل {connectedLoadWatts}W
            </span>
            <div className="font-num text-lg font-black text-emerald-400">
              {pack.estimatedRuntimeHours} ساعة
            </div>
            <span className="text-[11px] text-slate-400 block">
              سحب الحمل: {pack.loadCurrentAmp} أمبير
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * SPECIALIZED INTERACTIVE UI 4: RIDE-SHARE CAPTAIN PROFIT (`ride-driver-net-profit`)
 * ========================================================================== */
function RideDriverNetProfitEngine({ defaultParams = {} }) {
  const { config } = useSiteConfig();
  const officialFuel92 = Number(config?.liveRates?.energyAndUtilities?.fuel92) || 22.25;
  const officialFuel80 = Number(config?.liveRates?.energyAndUtilities?.fuel80) || 20.75;
  const officialFuel95 = Number(config?.liveRates?.energyAndUtilities?.fuel95) || 24.0;

  const [vehicleType, setVehicleType] = useState(defaultParams.vehicleType || 'car');
  const [dailyGrossRevenueEgp, setDailyGrossRevenueEgp] = useState(
    defaultParams.dailyGrossRevenueEgp || 1650
  );
  const [dailyDistanceKm, setDailyDistanceKm] = useState(defaultParams.dailyDistanceKm || 240);
  const [appCommissionPercent, setAppCommissionPercent] = useState(
    defaultParams.appCommissionPercent || 18
  );
  const [fuelGradeId, setFuelGradeId] = useState(defaultParams.fuelGradeId || 'fuel92');
  const [consumptionPer100Km, setConsumptionPer100Km] = useState(
    defaultParams.consumptionPer100Km || 8.5
  );
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState(
    defaultParams.workingDaysPerMonth || 26
  );
  const [dailyWorkHours, setDailyWorkHours] = useState(defaultParams.dailyWorkHours || 10);

  const selectedFuelPrice =
    fuelGradeId === 'fuel80'
      ? officialFuel80
      : fuelGradeId === 'fuel95'
      ? officialFuel95
      : fuelGradeId === 'cng'
      ? 7.0
      : officialFuel92;

  const res = useMemo(
    () =>
      calculateRideDriverProfit({
        vehicleType,
        dailyGrossRevenueEgp,
        dailyDistanceKm,
        appCommissionPercent,
        fuelPricePerLiter: selectedFuelPrice,
        consumptionPer100Km,
        workingDaysPerMonth,
        dailyWorkHours,
      }),
    [
      vehicleType,
      dailyGrossRevenueEgp,
      dailyDistanceKm,
      appCommissionPercent,
      selectedFuelPrice,
      consumptionPer100Km,
      workingDaysPerMonth,
      dailyWorkHours,
    ]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-neutral-800">
          <button
            type="button"
            onClick={() => {
              setVehicleType('car');
              setConsumptionPer100Km(8.5);
              setDailyGrossRevenueEgp(1650);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
              vehicleType === 'car'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
            }`}
          >
            🚗 كابتن سيارة (أوبر / ديدي / إندرايف)
          </button>
          <button
            type="button"
            onClick={() => {
              setVehicleType('motorcycle');
              setConsumptionPer100Km(3.2);
              setDailyGrossRevenueEgp(850);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
              vehicleType === 'motorcycle'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#0A0A0A] text-slate-300 border border-neutral-800'
            }`}
          >
            🏍️ كابتن موتوسيكل ودليفري (طلبات / مرسول)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">إجمالي إيراد اليومية (ج.م)</label>
            <input
              type="number"
              value={dailyGrossRevenueEgp}
              onChange={(e) => setDailyGrossRevenueEgp(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-[#D4AF37]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">المسافة المقطوعة يومياً (كم)</label>
            <input
              type="number"
              value={dailyDistanceKm}
              onChange={(e) => setDailyDistanceKm(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">نوع الوقود (بالسعر الرسمي)</label>
            <select
              value={fuelGradeId}
              onChange={(e) => setFuelGradeId(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
            >
              <option value="fuel92">بنزين 92 رسمي ({officialFuel92} ج.م/لتر)</option>
              <option value="fuel80">بنزين 80 رسمي ({officialFuel80} ج.م/لتر)</option>
              <option value="fuel95">بنزين 95 رسمي ({officialFuel95} ج.م/لتر)</option>
              <option value="cng">غاز طبيعي للسيارات (7.00 ج.م/م³)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">نسبة عمولة التطبيق (%)</label>
            <input
              type="number"
              value={appCommissionPercent}
              onChange={(e) => setAppCommissionPercent(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
            />
          </div>
        </div>
      </div>

      <div
        id="tool-result-card"
        data-testid="ride-driver-result-card"
        className="rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-b from-[#1B1506] to-[#0A0A0A] p-6 space-y-5 shadow-2xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-extrabold text-[#D4AF37] block">
              صافي ربح الكابتن الحقيقي بعد البنزين والعمولة وإهلاك الزيت والكاوتش
            </span>
            <h4 className="text-2xl sm:text-3xl font-black text-white mt-1">
              صافي اليومية: <span className="font-num text-[#D4AF37]">{fmt(res.netDailyProfitEgp)} ج.م</span>
            </h4>
          </div>
          <div className="rounded-2xl bg-emerald-950/50 border border-emerald-500/40 px-4 py-2.5 text-right">
            <span className="text-[11px] text-emerald-300 block">صافي الدخل الشهري ({workingDaysPerMonth} يوم)</span>
            <span className="font-num text-xl font-black text-emerald-400">
              {fmt(res.netMonthlyProfitEgp)} ج.م
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">تكلفة الوقود اليومية</span>
            <div className="font-num text-lg font-black text-red-400">
              {fmt(res.dailyFuelCostEgp)} ج.م
            </div>
            <span className="text-[11px] text-slate-400 block">{res.dailyFuelLiters} لتر يومياً</span>
          </div>

          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">عمولة التطبيق ({appCommissionPercent}%)</span>
            <div className="font-num text-lg font-black text-amber-400">
              {fmt(res.dailyAppCommissionEgp)} ج.م
            </div>
            <span className="text-[11px] text-slate-400 block">تخصم من المحفظة</span>
          </div>

          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">مجنب غيار زيت وصيانة</span>
            <div className="font-num text-lg font-black text-sky-400">
              {fmt(res.dailyMaintenanceDepreciationEgp)} ج.م
            </div>
            <span className="text-[11px] text-slate-400 block">حماية رأس مال المركبة</span>
          </div>

          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">صافي ربح الساعة والكيلومتر</span>
            <div className="font-num text-lg font-black text-emerald-400">
              {fmt(res.netHourlyWageEgp)} ج.م/ساعة
            </div>
            <span className="text-[11px] text-slate-300 block">
              {fmt(res.netProfitPerKmEgp)} ج.م لكل كم
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * SPECIALIZED INTERACTIVE UI 5: COD SHIPPING AUDITOR (`cod-shipping-reconciliation`)
 * ========================================================================== */
function CodShippingReconciliationEngine({ defaultParams = {} }) {
  const [deliveredOrdersCount, setDeliveredOrdersCount] = useState(
    defaultParams.deliveredOrdersCount ?? 96
  );
  const [returnedOrdersCount, setReturnedOrdersCount] = useState(
    defaultParams.returnedOrdersCount ?? 18
  );
  const [pendingOrdersCount, setPendingOrdersCount] = useState(
    defaultParams.pendingOrdersCount ?? 6
  );
  const [avgOrderCodValueEgp, setAvgOrderCodValueEgp] = useState(
    defaultParams.avgOrderCodValueEgp ?? 580
  );
  const [shippingFeePerOrderEgp, setShippingFeePerOrderEgp] = useState(
    defaultParams.shippingFeePerOrderEgp ?? 65
  );
  const [returnFeePerOrderEgp, setReturnFeePerOrderEgp] = useState(
    defaultParams.returnFeePerOrderEgp ?? 35
  );
  const [codCollectionFeePercent, setCodCollectionFeePercent] = useState(
    defaultParams.codCollectionFeePercent ?? 1
  );
  const [actualCompanyPayoutEgp, setActualCompanyPayoutEgp] = useState(
    defaultParams.actualCompanyPayoutEgp ?? 48500
  );

  const audit = useMemo(
    () =>
      calculateCodShippingReconciliation({
        deliveredOrdersCount,
        returnedOrdersCount,
        pendingOrdersCount,
        avgOrderCodValueEgp,
        shippingFeePerOrderEgp,
        returnFeePerOrderEgp,
        codCollectionFeePercent,
        actualCompanyPayoutEgp,
      }),
    [
      deliveredOrdersCount,
      returnedOrdersCount,
      pendingOrdersCount,
      avgOrderCodValueEgp,
      shippingFeePerOrderEgp,
      returnFeePerOrderEgp,
      codCollectionFeePercent,
      actualCompanyPayoutEgp,
    ]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-emerald-400">عدد الأوردرات المسلمة بنجاح</label>
          <input
            type="number"
            value={deliveredOrdersCount}
            onChange={(e) => setDeliveredOrdersCount(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-emerald-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-red-400">عدد الأوردرات المرتجعة (RTO)</label>
          <input
            type="number"
            value={returnedOrdersCount}
            onChange={(e) => setReturnedOrdersCount(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-red-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#F3E5AB]">متوسط تحصيل الأوردر (COD ج.م)</label>
          <input
            type="number"
            value={avgOrderCodValueEgp}
            onChange={(e) => setAvgOrderCodValueEgp(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-[#D4AF37]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">مصاريف شحن الأوردر المسلم (ج.م)</label>
          <input
            type="number"
            value={shippingFeePerOrderEgp}
            onChange={(e) => setShippingFeePerOrderEgp(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">غرامة الشحن على المرتجع (ج.م)</label>
          <input
            type="number"
            value={returnFeePerOrderEgp}
            onChange={(e) => setReturnFeePerOrderEgp(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">عمولة تحصيل النقدية COD (%)</label>
          <input
            type="number"
            step="0.25"
            value={codCollectionFeePercent}
            onChange={(e) => setCodCollectionFeePercent(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">أوردرات قيد التوصيل (مؤجل)</label>
          <input
            type="number"
            value={pendingOrdersCount}
            onChange={(e) => setPendingOrdersCount(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#D4AF37]">المبلغ الفعلي المحول من الشركة</label>
          <input
            type="number"
            value={actualCompanyPayoutEgp}
            onChange={(e) => setActualCompanyPayoutEgp(Number(e.target.value))}
            className="font-num w-full rounded-xl bg-[#0A0A0A] border border-[#D4AF37] px-3.5 py-2.5 text-sm font-black text-white"
          />
        </div>
      </div>

      <div
        id="tool-result-card"
        data-testid="cod-reconciliation-result-card"
        className="rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-b from-[#1A1506] to-[#0A0A0A] p-6 space-y-5 shadow-2xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-extrabold text-[#D4AF37] block">
              تقرير المراجعة المحاسبية لشيت التحصيل (نسبة التسليم: {audit.deliveryRatePercent}%)
            </span>
            <h4 className="text-2xl font-black text-white mt-1">
              الصافي المستحق لمتجرك:{' '}
              <span className="font-num text-[#D4AF37]">{fmt(audit.expectedNetPayoutEgp)} ج.م</span>
            </h4>
          </div>

          <div
            className={`px-4 py-2.5 rounded-2xl border text-xs font-black ${
              audit.payoutVarianceEgp < 0
                ? 'bg-red-950/50 border-red-500/50 text-red-300'
                : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
            }`}
          >
            {audit.payoutVarianceEgp < 0
              ? `⚠️ يوجد عجز غير محصل قدره ${fmt(Math.abs(audit.payoutVarianceEgp))} ج.م`
              : `✅ الحساب مطابق (فارق +${fmt(audit.payoutVarianceEgp)} ج.م)`}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">إجمالي التحصيل النقدي</span>
            <div className="font-num text-lg font-black text-white">
              {fmt(audit.grossCollectedCodEgp)} ج.م
            </div>
          </div>
          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">خصم شحن الأوردرات المسلمة</span>
            <div className="font-num text-lg font-black text-amber-400">
              -{fmt(audit.deliveredShippingTotalEgp)} ج.م
            </div>
          </div>
          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">خصم غرامات المرتجعات</span>
            <div className="font-num text-lg font-black text-red-400">
              -{fmt(audit.returnedPenaltyTotalEgp)} ج.م
            </div>
          </div>
          <div className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">عمولة COD ({codCollectionFeePercent}%)</span>
            <div className="font-num text-lg font-black text-slate-300">
              -{fmt(audit.codCollectionFeeTotalEgp)} ج.م
            </div>
          </div>
        </div>

        <ExcelExportBtn
          filename="dix-tools-cod-reconciliation-sheet.csv"
          headers={['البند المحاسبي', 'العدد / النسبة', 'القيمة بالجنيه المصري']}
          rows={[
            ['إجمالي الأوردرات المسلمة', audit.deliveredOrdersCount, audit.grossCollectedCodEgp],
            ['مصاريف شحن المسلم', audit.deliveredOrdersCount, -audit.deliveredShippingTotalEgp],
            ['غرامات شحن المرتجع', audit.returnedOrdersCount, -audit.returnedPenaltyTotalEgp],
            ['عمولة التحصيل النقدي COD', `${codCollectionFeePercent}%`, -audit.codCollectionFeeTotalEgp],
            ['الصافي المستحق للتاجر', '100%', audit.expectedNetPayoutEgp],
            ['المبلغ المحول فعلياً', '-', audit.actualCompanyPayoutEgp],
            ['فارق الحساب (عجز / زيادة)', '-', audit.payoutVarianceEgp],
          ]}
          label="تصدير كشف مطابقة الشحن إلى Excel"
        />
      </div>
    </div>
  );
}

/* ============================================================================
 * SPECIALIZED INTERACTIVE UI 6: PRINTABLE A4 CONTRACTS & SHEETS (Tools 43-48)
 * ========================================================================== */
function PrintableA4DocumentsExpansionEngine({ tool }) {
  const { engineType, defaultParams = {} } = tool;
  const [partyOne, setPartyOne] = useState(
    defaultParams.partner1Name ||
      defaultParams.ownerName ||
      defaultParams.employerName ||
      defaultParams.warehouseName ||
      defaultParams.personName ||
      'أحمد محمود عبد الرحمن'
  );
  const [partyTwo, setPartyTwo] = useState(
    defaultParams.partner2Name ||
      defaultParams.contractorName ||
      defaultParams.employeeName ||
      defaultParams.auditorName ||
      'محمد حسن إبراهيم'
  );
  const [subjectTitle, setSubjectTitle] = useState(
    defaultParams.companyName ||
      defaultParams.unitAddress ||
      defaultParams.jobTitle ||
      defaultParams.purposeText ||
      defaultParams.topPriorityGoal ||
      'مشروع تجاري وتشغيلي مشترك'
  );
  const [financialAmount, setFinancialAmount] = useState(
    defaultParams.totalCapitalEgp ||
      defaultParams.totalEstimatedBudgetEgp ||
      defaultParams.monthlySalaryEgp ||
      defaultParams.amountEgp ||
      250000
  );
  const [sharePercentOne, setSharePercentOne] = useState(
    defaultParams.partner1SharePercent || defaultParams.supervisionFeePercent || 60
  );

  // Inventory items for `inventory-stock-sheet-maker`
  const [stockItems, setStockItems] = useState([
    { code: 'SKU-101', name: 'منتج قياسي فئة أولى', bookQty: 50, actualQty: 48, unitCost: 350 },
    { code: 'SKU-102', name: 'منتج تجاري فئة ثانية', bookQty: 120, actualQty: 120, unitCost: 180 },
    { code: 'SKU-103', name: 'عبوة إكسسوار ومستلزمات', bookQty: 85, actualQty: 87, unitCost: 95 },
  ]);

  const tafqeetWords = useMemo(
    () => numberToArabicWordsTafqeet(financialAmount, 'جنيه مصري', 'قرشاً').fullLegalCheckString,
    [financialAmount]
  );

  return (
    <div className="space-y-6">
      <div className="no-print rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">
              الطرف الأول / الشركة / المستلم
            </label>
            <input
              type="text"
              value={partyOne}
              onChange={(e) => setPartyOne(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">
              الطرف الثاني / الشريك / الموظف / المراجع
            </label>
            <input
              type="text"
              value={partyTwo}
              onChange={(e) => setPartyTwo(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">
              موضوع العقد / النشاط / الغرض
            </label>
            <input
              type="text"
              value={subjectTitle}
              onChange={(e) => setSubjectTitle(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-xs font-bold text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3E5AB]">
              القيمة المالية / رأس المال / المبلغ (ج.م)
            </label>
            <input
              type="number"
              value={financialAmount}
              onChange={(e) => setFinancialAmount(Number(e.target.value))}
              className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-[#D4AF37]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800">
          <span className="text-xs text-emerald-400 font-bold">
            ✨ المبلغ بالحروف: {tafqeetWords}
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer shadow-lg"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة وحفظ المستند الرسمي (A4 PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Official A4 Document Preview */}
      <div
        id="tool-result-card"
        data-testid="expanded-a4-document-sheet"
        className="rounded-3xl border-2 border-[#D4AF37] bg-[#0A0A0A] p-6 sm:p-8 space-y-6 shadow-2xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#D4AF37] pb-4">
          <div>
            <span className="text-xs font-extrabold text-[#D4AF37] block">
              وثيقة رسمية معتمدة — منصة Dix Tools للنماذج والعقود الذكية
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">{tool.title}</h3>
          </div>
          <div className="font-num text-xs text-slate-300 text-left">
            <div>تاريخ التحرير: {new Date().toISOString().slice(0, 10)}</div>
            <div className="text-[#D4AF37] font-bold">مرجع الوثيقة: DIX-DOC-2026</div>
          </div>
        </div>

        {engineType === 'inventory-stock-sheet-maker' ? (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-neutral-800">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#141414] text-[#F3E5AB] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-3">كود الصنف</th>
                    <th className="py-3 px-3">اسم الصنف</th>
                    <th className="py-3 px-3">الرصيد الدفتري</th>
                    <th className="py-3 px-3">الجرد الفعلي</th>
                    <th className="py-3 px-3">العجز / الزيادة</th>
                    <th className="py-3 px-3">سعر التكلفة</th>
                    <th className="py-3 px-3">إجمالي القيمة الفعلية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {stockItems.map((it, idx) => {
                    const diff = it.actualQty - it.bookQty;
                    return (
                      <tr key={it.code} className="hover:bg-[#141414]">
                        <td className="py-2.5 px-3 font-num font-bold text-[#D4AF37]">{it.code}</td>
                        <td className="py-2.5 px-3 font-bold text-white">{it.name}</td>
                        <td className="py-2.5 px-3 font-num">{it.bookQty}</td>
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            value={it.actualQty}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setStockItems((prev) =>
                                prev.map((row, rIdx) => (rIdx === idx ? { ...row, actualQty: v } : row))
                              );
                            }}
                            className="font-num w-20 rounded bg-[#141414] border border-neutral-700 px-2 py-1 text-white"
                          />
                        </td>
                        <td
                          className={`py-2.5 px-3 font-num font-black ${
                            diff < 0 ? 'text-red-400' : diff > 0 ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          {diff > 0 ? `+${diff}` : diff}
                        </td>
                        <td className="py-2.5 px-3 font-num">{fmt(it.unitCost)} ج.م</td>
                        <td className="py-2.5 px-3 font-num font-bold text-[#F3E5AB]">
                          {fmt(it.actualQty * it.unitCost)} ج.م
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <ExcelExportBtn
              filename="dix-tools-inventory-sheet.csv"
              headers={['كود الصنف', 'اسم الصنف', 'الرصيد الدفتري', 'الجرد الفعلي', 'الفرق', 'إجمالي القيمة']}
              rows={stockItems.map((it) => [
                it.code,
                it.name,
                it.bookQty,
                it.actualQty,
                it.actualQty - it.bookQty,
                it.actualQty * it.unitCost,
              ])}
              label="تصدير محضر الجرد إلى Excel (CSV)"
            />
          </div>
        ) : engineType === 'weekly-planner-schedule-maker' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map(
              (day, idx) => (
                <div
                  key={day}
                  className="rounded-2xl border border-[#D4AF37]/40 bg-[#141414] p-3.5 space-y-2"
                >
                  <div className="text-xs font-black text-[#D4AF37] border-b border-neutral-800 pb-1.5 flex items-center justify-between">
                    <span>{day}</span>
                    <span className="font-num text-[10px] text-slate-400">اليوم #{idx + 1}</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-200">
                    <li>• الصباح: جلسة تركيز أساسية (90 د)</li>
                    <li>• الظهر: متابعة {subjectTitle.slice(0, 22)}</li>
                    <li>• المساء: مراجعة وتقييم الإنجاز اليومي</li>
                  </ul>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p className="font-bold text-[#F3E5AB]">
              إنه في يوم الموافق {new Date().toLocaleDateString('ar-EG')}، تم الاتفاق والتراضي الكامل
              بين كلٍ من:
            </p>
            <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-4 space-y-2">
              <div>
                <strong className="text-[#D4AF37]">أولاً (الطرف الأول):</strong> السيد /{' '}
                <span className="text-white font-black">{partyOne}</span> (بصفته الطرف الأول المعتمد).
              </div>
              <div>
                <strong className="text-[#D4AF37]">ثانياً (الطرف الثاني):</strong> السيد /{' '}
                <span className="text-white font-black">{partyTwo}</span> (بصفته الطرف الثاني المتعاقد).
              </div>
            </div>

            <div className="space-y-2.5 bg-[#141414]/60 rounded-2xl p-4 border border-neutral-800">
              <p>
                <strong className="text-[#D4AF37]">البند الأول (موضوع الوثيقة):</strong> اتفق الطرفان
                على تنفيذ وإدارة «<strong className="text-white">{subjectTitle}</strong>» وفق أحدث
                الأعراف المهنية والقانونية المعمول بها في جمهورية مصر العربية.
              </p>
              <p>
                <strong className="text-[#D4AF37]">البند الثاني (القيمة المالية والتفقيط):</strong> تبلغ
                القيمة المالية الإجمالية المتفق عليها في هذا المستند مبلغاً وقدره{' '}
                <strong className="font-num text-[#D4AF37]">{fmt(financialAmount)} ج.م</strong> ({' '}
                <strong className="text-emerald-400">{tafqeetWords}</strong> ).
              </p>
              <p>
                <strong className="text-[#D4AF37]">البند الثالث (توزيع الالتزامات والسرية):</strong>{' '}
                يلتزم الطرفان بالحفاظ التام على سرية البيانات والمعلومات التجارية وعدم إفشائها للغير،
                وتكون حصة أو نسبة الطرف الأول المعتمدة ({sharePercentOne}%)، وفي حال الإخلال بأي بند
                يسري الشرط الجزائي الاتفاقي فوراً دون حاجة لتنبيه أو إنذار قضائي.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-dashed border-neutral-800 text-center">
              <div className="space-y-6">
                <div className="font-black text-[#F3E5AB]">توقيع وبصمة الطرف الأول</div>
                <div className="text-slate-400">{partyOne}</div>
                <div className="border-b border-neutral-700 w-48 mx-auto" />
              </div>
              <div className="space-y-6">
                <div className="font-black text-[#F3E5AB]">توقيع وبصمة الطرف الثاني</div>
                <div className="text-slate-400">{partyTwo}</div>
                <div className="border-b border-neutral-700 w-48 mx-auto" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
 * UNIVERSAL DYNAMIC ENGINE FOR ALL OTHER EXPANDED MASTER TOOLS
 * (Covers ROSCA, Egypt Salary Tax, Mortgage, Credit Card, Partnership, Gold P&L,
 * Savings Goal, Break-Even, AC BTU, Wire/Breaker, Solar, Rental Yield, CCTV,
 * Sprocket/Tire, Used Vehicle Inspection, Oil Mixer, Traffic License, Ads ROAS,
 * Bundle Pricing, UTM/WhatsApp, Ad Hook Copywriter, SERP Simulator, PDF/Media,
 * Developer JSON/JWT/Regex/Mock/Speed, Thanaweya, Overtime, Sleep, and Udhiya)
 * ========================================================================== */
const EXPANDED_TOOL_SCHEMAS = {
  'rosca-gameya-calculator': {
    fields: [
      { key: 'monthlyShareEgp', label: 'قيمة السهم الشهري للفرد (ج.م)', def: 3000 },
      { key: 'membersCount', label: 'عدد المشتركين / شهور الجمعية', def: 10 },
      { key: 'adminReserveFeeEgp', label: 'مبلغ احتياطي أو مصاريف إدارية (إن وجد)', def: 0 },
    ],
    evaluate: (v) => {
      const r = calculateRoscaGameyaSchedule(v);
      return {
        primaryLabel: `إجمالي قبض الجمعية الشهري (${r.membersCount} مشتركين)`,
        primaryValue: `${fmt(r.netMonthlyPotEgp)} ج.م`,
        secondaryBadge: `إجمالي دورة الجمعية: ${fmt(r.totalTurnoverEgp)} ج.م`,
        kpis: [
          { label: 'قيمة السهم الشهري', value: `${fmt(r.monthlyShareEgp)} ج.م` },
          { label: 'مدة الجمعية الكلية', value: `${r.membersCount} شهور` },
          { label: 'صافي القبض لكل دور', value: `${fmt(r.netMonthlyPotEgp)} ج.م` },
          { label: 'أول شهر قبض', value: r.schedule[0]?.monthLabel || 'ديسمبر 2026' },
        ],
        tableHeaders: ['ترتيب الدور', 'الشهر الميلادي', 'اسم المشترك', 'المدفوع شهرياً', 'صافي المقبوض'],
        tableRows: r.schedule.map((s) => [
          `الدور #${s.turnOrder}`,
          s.monthLabel,
          s.memberName,
          `${fmt(s.monthlyPaidEgp)} ج.م`,
          `${fmt(s.netPayoutEgp)} ج.م`,
        ]),
      };
    },
  },
  'egypt-net-salary-tax': {
    fields: [
      { key: 'monthlySalaryEgp', label: 'المرتب الشهري الأساسي والمتغير (ج.م)', def: 18000 },
      { key: 'insuranceSalaryEgp', label: 'الأجر التأميني الخاضع للتأمينات (ج.م)', def: 12600 },
      { key: 'monthlyBonusesEgp', label: 'حوافز وبدلات شهرية إضافية (ج.م)', def: 0 },
    ],
    evaluate: (v) => {
      const r = calculateEgyptSalaryTax(v);
      return {
        primaryLabel: 'صافي المرتب الشهري المستحق باليد (Net Salary)',
        primaryValue: `${fmt(r.netMonthlySalary)} ج.م`,
        secondaryBadge: `نسبة الاستقطاع الفعلي: ${r.effectiveTaxRatePercent}%`,
        kpis: [
          { label: 'إجمالي المرتب (Gross)', value: `${fmt(r.grossMonthlySalary)} ج.م` },
          { label: 'حصة الموظف بالتأمينات (11%)', value: `${fmt(r.employeeInsuranceMonthly)} ج.م` },
          { label: 'ضريبة كسب العمل الشهرية', value: `${fmt(r.monthlyIncomeTax)} ج.م` },
          { label: 'التكلفة الكلية على الشركة', value: `${fmt(r.totalCompanyCostMonthly)} ج.م` },
        ],
        tableHeaders: ['بند مفردات المرتب', 'القيمة الشهرية', 'القيمة السنوية'],
        tableRows: [
          ['إجمالي الراتب شامل البدلات (Gross)', `${fmt(r.grossMonthlySalary)} ج.م`, `${fmt(r.grossMonthlySalary * 12)} ج.م`],
          ['حصة الموظف في التأمينات الاجتماعية (11%)', `-${fmt(r.employeeInsuranceMonthly)} ج.م`, `-${fmt(r.employeeInsuranceMonthly * 12)} ج.م`],
          ['ضريبة الدخل (كسب العمل بعد الإعفاء 20,000ج)', `-${fmt(r.monthlyIncomeTax)} ج.م`, `-${fmt(r.monthlyIncomeTax * 12)} ج.م`],
          ['صافي الراتب المستلم باليد (Net Pay)', `${fmt(r.netMonthlySalary)} ج.م`, `${fmt(r.netMonthlySalary * 12)} ج.م`],
        ],
      };
    },
  },
  'mortgage-housing-calculator': {
    fields: [
      { key: 'unitPriceEgp', label: 'إجمالي سعر الشقة / الوحدة السكنية (ج.م)', def: 1500000 },
      { key: 'downPaymentPercent', label: 'نسبة المقدم المدفوع (%)', def: 20 },
      { key: 'annualInterestRate', label: 'معدل الفائدة السنوية (مبادرة 3% أو 8% أو بنكي)', def: 8 },
      { key: 'durationYears', label: 'مدة التمويل العقاري بالسنوات (3 إلى 30 سنة)', def: 20 },
    ],
    evaluate: (v) => {
      const price = Math.max(100000, Number(v.unitPriceEgp) || 1500000);
      const downPct = Math.min(80, Math.max(5, Number(v.downPaymentPercent) || 20));
      const rate = Math.max(1, Number(v.annualInterestRate) || 8);
      const years = Math.min(30, Math.max(1, Number(v.durationYears) || 20));
      const downPaymentEgp = Math.round((price * downPct) / 100);
      const loanAmount = price - downPaymentEgp;
      const months = years * 12;
      const monthlyRate = rate / 100 / 12;
      const monthlyInstallment = Math.round(
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
      );
      const totalPaid = monthlyInstallment * months + downPaymentEgp;
      return {
        primaryLabel: `القسط الشهري للتمويل العقاري (${years} سنة)`,
        primaryValue: `${fmt(monthlyInstallment)} ج.م / شهرياً`,
        secondaryBadge: `مبلغ التمويل: ${fmt(loanAmount)} ج.م`,
        kpis: [
          { label: 'مقدم التعاقد والاستلام', value: `${fmt(downPaymentEgp)} ج.م` },
          { label: 'وديعة الصيانة التقديرية (5%)', value: `${fmt(price * 0.05)} ج.م` },
          { label: 'الحد الأدنى للدخل الشهري المطلوب', value: `${fmt(monthlyInstallment * 2.5)} ج.م` },
          { label: 'إجمالي المدفوع شاملاً الفوائد', value: `${fmt(totalPaid)} ج.م` },
        ],
        tableHeaders: ['البند العقاري', 'النسبة / المدة', 'القيمة بالجنيه'],
        tableRows: [
          ['ثمن الوحدة السكنية الأصلي', '100%', `${fmt(price)} ج.م`],
          ['دفعة المقدم المسددة', `${downPct}%`, `${fmt(downPaymentEgp)} ج.م`],
          ['أصل مبلغ التمويل العقاري', `${100 - downPct}%`, `${fmt(loanAmount)} ج.م`],
          ['القسط الشهري الثابت', `${months} شهراً`, `${fmt(monthlyInstallment)} ج.م`],
        ],
      };
    },
  },
  'credit-card-interest-calc': {
    fields: [
      { key: 'cardBalanceEgp', label: 'الرصيد المسحوب على البطاقة الائتمانية (ج.م)', def: 25000 },
      { key: 'monthlyInterestPercent', label: 'نسبة الفائدة الشهرية للبنك (%)', def: 3.25 },
      { key: 'fixedMonthlyPaymentEgp', label: 'المبلغ الذي تسدده شهرياً (ج.م)', def: 2500 },
      { key: 'cashAdvanceAmountEgp', label: 'مبلغ السحب النقدي من ATM (إن وجد)', def: 0 },
    ],
    evaluate: (v) => {
      const bal = Math.max(500, Number(v.cardBalanceEgp) || 25000);
      const mRate = Math.max(0.5, Number(v.monthlyInterestPercent) || 3.25) / 100;
      const minPay = Math.round(bal * 0.05);
      const firstMonthInterest = Math.round(bal * mRate);
      const cashFee = Math.round((Number(v.cashAdvanceAmountEgp) || 0) * 0.03);
      const pay = Math.max(firstMonthInterest + 200, Number(v.fixedMonthlyPaymentEgp) || 2500);
      const monthsToClear = Math.min(60, Math.ceil(bal / Math.max(100, pay - firstMonthInterest * 0.6)));
      const totalInterestCost = Math.round(monthsToClear * firstMonthInterest * 0.58 + cashFee);
      return {
        primaryLabel: 'إجمالي الفوائد والرسوم البنكية المتوقعة على الفيزا',
        primaryValue: `${fmt(totalInterestCost)} ج.م`,
        secondaryBadge: `فائدة أول شهر بعد فترة السماح: ${fmt(firstMonthInterest)} ج.م`,
        kpis: [
          { label: 'الحد الأدنى للسداد (5%)', value: `${fmt(minPay)} ج.م` },
          { label: 'مدة التخلص من المديونية', value: `${monthsToClear} شهراً` },
          { label: 'رسوم السحب النقدي الفورية', value: `${fmt(cashFee)} ج.م` },
          { label: 'فترة السماح بدون فوائد (مشتريات)', value: 'حتى 55 يوماً' },
        ],
        tableHeaders: ['خطة السداد', 'القسط الشهري', 'الفائدة التقديرية'],
        tableRows: [
          ['سداد كامل المديونية في فترة السماح', `${fmt(bal)} ج.م`, '0 ج.م (صفر فوائد)'],
          ['سداد قسط ثابت شهرياً', `${fmt(pay)} ج.م`, `${fmt(totalInterestCost)} ج.م`],
          ['سداد الحد الأدنى فقط (5%)', `${fmt(minPay)} ج.م`, `${fmt(totalInterestCost * 2.4)} ج.م (خطر تراكمي)`],
        ],
      };
    },
  },
  'partnership-profit-splitter': {
    fields: [
      { key: 'netProfitEgp', label: 'صافي الربح القابل للتوزيع بين الشركاء (ج.م)', def: 180000 },
      { key: 'managementSharePercent', label: 'نسبة الإدارة والتشغيل قبل التوزيع (%)', def: 20 },
      { key: 'reinvestmentReservePercent', label: 'نسبة احتياطي تطوير وتوسعة المشروع (%)', def: 10 },
      { key: 'partner1CapitalPercent', label: 'حصة الشريك الأول في رأس المال (%)', def: 60 },
    ],
    evaluate: (v) => {
      const profit = Math.max(0, Number(v.netProfitEgp) || 180000);
      const mgmtPct = Math.min(50, Math.max(0, Number(v.managementSharePercent) || 20));
      const resPct = Math.min(40, Math.max(0, Number(v.reinvestmentReservePercent) || 10));
      const p1CapPct = Math.min(99, Math.max(1, Number(v.partner1CapitalPercent) || 60));
      const p2CapPct = 100 - p1CapPct;

      const managementBonusEgp = Math.round((profit * mgmtPct) / 100);
      const reserveEgp = Math.round((profit * resPct) / 100);
      const distributableToCapital = Math.max(0, profit - managementBonusEgp - reserveEgp);

      const partner1CapitalProfit = Math.round((distributableToCapital * p1CapPct) / 100);
      const partner2CapitalProfit = Math.round((distributableToCapital * p2CapPct) / 100);

      return {
        primaryLabel: 'إجمالي نصيب الشريك الأول (رأس المال + مكافأة الإدارة)',
        primaryValue: `${fmt(partner1CapitalProfit + managementBonusEgp)} ج.م`,
        secondaryBadge: `نصيب الشريك الثاني: ${fmt(partner2CapitalProfit)} ج.م`,
        kpis: [
          { label: 'مكافأة الإدارة والمجهود', value: `${fmt(managementBonusEgp)} ج.م` },
          { label: 'احتياطي التطوير والتشغيل', value: `${fmt(reserveEgp)} ج.م` },
          { label: `ربح رأس مال الشريك 1 (${p1CapPct}%)`, value: `${fmt(partner1CapitalProfit)} ج.م` },
          { label: `ربح رأس مال الشريك 2 (${p2CapPct}%)`, value: `${fmt(partner2CapitalProfit)} ج.م` },
        ],
        tableHeaders: ['البند / الشريك', 'النسبة المئوية', 'المبلغ المستحق'],
        tableRows: [
          ['احتياطي تطوير المشروع', `${resPct}%`, `${fmt(reserveEgp)} ج.م`],
          ['حصة الإدارة والتشغيل', `${mgmtPct}%`, `${fmt(managementBonusEgp)} ج.م`],
          ['حصة الشريك الأول من رأس المال', `${p1CapPct}%`, `${fmt(partner1CapitalProfit)} ج.م`],
          ['حصة الشريك الثاني من رأس المال', `${p2CapPct}%`, `${fmt(partner2CapitalProfit)} ج.م`],
        ],
      };
    },
  },
  'gold-dollar-profit-loss': {
    fields: [
      { key: 'quantity', label: 'الوزن بالجرام (للذهب) أو المبلغ (للدولار)', def: 25 },
      { key: 'buyPricePerUnit', label: 'سعر الشراء الأصلي للوحدة (ج.م)', def: 3350 },
      { key: 'buyWorkmanshipPerGram', label: 'المصنعية والدمغة المدفوعة عند الشراء (ج.م)', def: 110 },
      { key: 'sellPricePerUnit', label: 'سعر البيع الحالي بالسوق اليوم (ج.م)', def: 3811 },
    ],
    evaluate: (v) => {
      const qty = Math.max(1, Number(v.quantity) || 25);
      const buyP = Math.max(1, Number(v.buyPricePerUnit) || 3350);
      const work = Math.max(0, Number(v.buyWorkmanshipPerGram) || 110);
      const sellP = Math.max(1, Number(v.sellPricePerUnit) || 3811);

      const totalBuyCost = Math.round(qty * (buyP + work));
      const totalSellValue = Math.round(qty * sellP);
      const netProfitLoss = totalSellValue - totalBuyCost;
      const roiPct = totalBuyCost > 0 ? Number(((netProfitLoss / totalBuyCost) * 100).toFixed(2)) : 0;
      const breakEvenUnitSellPrice = buyP + work;

      return {
        primaryLabel: netProfitLoss >= 0 ? 'صافي المكسب الفعلي بعد خصم المصنعية' : 'صافي الخسارة الحالية',
        primaryValue: `${netProfitLoss >= 0 ? '+' : ''}${fmt(netProfitLoss)} ج.م (${roiPct}%)`,
        secondaryBadge: `سعر التعادل للبيع بدون خسارة: ${fmt(breakEvenUnitSellPrice)} ج.م`,
        kpis: [
          { label: 'إجمالي تكلفة الشراء بالمصنعية', value: `${fmt(totalBuyCost)} ج.م` },
          { label: 'إجمالي قيمة البيع اليوم', value: `${fmt(totalSellValue)} ج.م` },
          { label: 'إجمالي المصنعية المهدرة عند البيع', value: `${fmt(qty * work)} ج.م` },
          { label: 'نسبة العائد الصافي (ROI)', value: `${roiPct}%` },
        ],
        tableHeaders: ['البيان الاستثماري', 'سعر الوحدة', 'الإجمالي بالجنيه'],
        tableRows: [
          ['تكلفة الشراء شاملة المصنعية', `${fmt(buyP + work)} ج.م`, `${fmt(totalBuyCost)} ج.م`],
          ['قيمة البيع الفورية بالسوق', `${fmt(sellP)} ج.م`, `${fmt(totalSellValue)} ج.م`],
          ['صافي الربح / الخسارة', `${fmt(sellP - (buyP + work))} ج.م`, `${fmt(netProfitLoss)} ج.م`],
        ],
      };
    },
  },
  'savings-goal-planner': {
    fields: [
      { key: 'targetAmountEgp', label: 'المبلغ المالي المستهدف الوصول إليه (ج.م)', def: 500000 },
      { key: 'initialSavingsEgp', label: 'المدخرات المتوفرة معك حالياً (ج.م)', def: 80000 },
      { key: 'durationMonths', label: 'المدة الزمنية المستهدفة (بالشهور)', def: 24 },
      { key: 'annualReturnPercent', label: 'معدل العائد السنوي المتوقع على المدخرات (%)', def: 22 },
    ],
    evaluate: (v) => {
      const target = Math.max(1000, Number(v.targetAmountEgp) || 500000);
      const init = Math.max(0, Number(v.initialSavingsEgp) || 80000);
      const months = Math.max(1, Number(v.durationMonths) || 24);
      const rMonthly = Math.max(0, Number(v.annualReturnPercent) || 22) / 100 / 12;

      const futureValueOfInitial = init * Math.pow(1 + rMonthly, months);
      const remainingGap = Math.max(0, target - futureValueOfInitial);
      const requiredMonthlySaving =
        rMonthly > 0
          ? Math.round((remainingGap * rMonthly) / (Math.pow(1 + rMonthly, months) - 1))
          : Math.round(remainingGap / months);
      const totalOutOfPocket = init + requiredMonthlySaving * months;
      const totalCompoundYield = Math.max(0, target - totalOutOfPocket);

      return {
        primaryLabel: `المبلغ المطلوب ادخاره شهرياً للوصول لـ ${fmt(target)} ج.م`,
        primaryValue: `${fmt(requiredMonthlySaving)} ج.م / شهرياً`,
        secondaryBadge: `أرباح الفائدة التراكمية المساعدة: +${fmt(totalCompoundYield)} ج.م`,
        kpis: [
          { label: 'المبلغ المستهدف', value: `${fmt(target)} ج.م` },
          { label: 'المدخرات الحالية بعد النمو', value: `${fmt(futureValueOfInitial)} ج.م` },
          { label: 'إجمالي ما ستدفعه من جيبك', value: `${fmt(totalOutOfPocket)} ج.م` },
          { label: 'الأرباح المركبة المكتسبة', value: `${fmt(totalCompoundYield)} ج.م` },
        ],
        tableHeaders: ['مرحلة الخطة الادخارية', 'القيمة المالية'],
        tableRows: [
          ['نقطة البداية (المدخرات الحالية)', `${fmt(init)} ج.م`],
          ['القسط الادخاري الشهري المنتظم', `${fmt(requiredMonthlySaving)} ج.م`],
          ['إجمالي العائد الاستثماري المضاف', `${fmt(totalCompoundYield)} ج.م`],
          ['الرصيد النهائي عند انتهاء المدة', `${fmt(target)} ج.م`],
        ],
      };
    },
  },
  'break-even-roi-calculator': {
    fields: [
      { key: 'fixedMonthlyCostsEgp', label: 'التكاليف الثابتة شهرياً (إيجار + رواتب + فواتير)', def: 35000 },
      { key: 'unitSellingPriceEgp', label: 'سعر بيع الوحدة / المنتج للعميل (ج.م)', def: 450 },
      { key: 'unitVariableCostEgp', label: 'التكلفة المتغيرة للوحدة (خامات + تغليف + عمولة)', def: 270 },
      { key: 'expectedMonthlySalesUnits', label: 'عدد المبيعات الشهرية المتوقعة (قطعة)', def: 300 },
    ],
    evaluate: (v) => {
      const fixed = Math.max(100, Number(v.fixedMonthlyCostsEgp) || 35000);
      const price = Math.max(10, Number(v.unitSellingPriceEgp) || 450);
      const varCost = Math.max(1, Number(v.unitVariableCostEgp) || 270);
      const units = Math.max(1, Number(v.expectedMonthlySalesUnits) || 300);

      const contributionMargin = Math.max(1, price - varCost);
      const breakEvenUnits = Math.ceil(fixed / contributionMargin);
      const breakEvenRevenueEgp = breakEvenUnits * price;
      const monthlyNetProfitEgp = units * contributionMargin - fixed;

      return {
        primaryLabel: 'نقطة التعادل الشهرية للمشروع (Break-Even Point)',
        primaryValue: `${fmt(breakEvenUnits, 0)} وحدة (${fmt(breakEvenRevenueEgp)} ج.م مبيعات)`,
        secondaryBadge: `صافي الربح عند بيع ${units} وحدة: ${fmt(monthlyNetProfitEgp)} ج.م/شهرياً`,
        kpis: [
          { label: 'هامش المساهمة للقطعة الواحدة', value: `${fmt(contributionMargin)} ج.م` },
          { label: 'مبيعات التعادل اليومية المطلوبة', value: `${Math.ceil(breakEvenUnits / 30)} قطعة/يوم` },
          { label: 'إجمالي المبيعات الشهرية المتوقعة', value: `${fmt(units * price)} ج.م` },
          { label: 'صافي الربح الشهري المتوقع', value: `${fmt(monthlyNetProfitEgp)} ج.م` },
        ],
        tableHeaders: ['مؤشر جدوى المشروع', 'القيمة المحسوبة'],
        tableRows: [
          ['التكاليف الثابتة الشهرية', `${fmt(fixed)} ج.م`],
          ['ربح القطعة قبل المصاريف الثابتة', `${fmt(contributionMargin)} ج.م`],
          ['عدد الوحدات اللازمة لتغطية المصاريف (التعادل)', `${fmt(breakEvenUnits, 0)} قطعة`],
          ['صافي الربح الشهري بعد المصاريف', `${fmt(monthlyNetProfitEgp)} ج.م`],
        ],
      };
    },
  },
  'ac-btu-horsepower-calc': {
    fields: [
      { key: 'roomLengthM', label: 'طول الغرفة بالمتر (م)', def: 5 },
      { key: 'roomWidthM', label: 'عرض الغرفة بالمتر (م)', def: 4 },
      { key: 'ceilingHeightM', label: 'ارتفاع السقف بالمتر (م)', def: 3 },
      { key: 'occupantsCount', label: 'عدد الأفراد المتواجدين بالغرفة عادة', def: 3 },
    ],
    evaluate: (v) => {
      const r = calculateAcBtuAndHorsepower(v);
      return {
        primaryLabel: `قدرة التكييف المثالية لمساحة ${r.areaSqm} م²`,
        primaryValue: `${r.recommendedHorsepower} حصان (${fmt(r.nominalUnitBtu, 0)} BTU)`,
        secondaryBadge: `الحمل الحراري الفعلي: ${fmt(r.requiredBtu, 0)} BTU/hr`,
        kpis: [
          { label: 'مساحة وحجم الغرفة', value: `${r.areaSqm} م² (${r.volumeCubicM} م³)` },
          { label: 'القدرة بالحصان الموصى بها', value: `${r.recommendedHorsepower} حصان` },
          { label: 'مقاس السلك والقاطع الكهربائي', value: `سلك ${r.recommendedWireMm2} مم² + قاطع ${r.recommendedBreakerAmp}A` },
          { label: 'استهلاك الكهرباء الشهري (إنفرتر)', value: `${fmt(r.monthlyElectricityCostEgp)} ج.م` },
        ],
        tableHeaders: ['المواصفة الهندسية للتكييف', 'القيمة المعتمدة'],
        tableRows: [
          ['مساحة الغرفة الصافية', `${r.areaSqm} متر مربع`],
          ['سعة التبريد المطلوبة (BTU)', `${fmt(r.requiredBtu, 0)} BTU`],
          ['حجم التكييف التجاري المناسب', `${r.recommendedHorsepower} حصان (${fmt(r.nominalUnitBtu, 0)} BTU)`],
          ['تأسيس الكهرباء المعتمد', `سلك نحاس ${r.recommendedWireMm2} مم² + مفتاح أوتوماتيك ${r.recommendedBreakerAmp} أمبير`],
        ],
      };
    },
  },
  'wire-breaker-amp-calc': {
    fields: [
      { key: 'loadWatts', label: 'إجمالي قدرة الأجهزة / الحمل الكهربائي (واط — Watts)', def: 3500 },
      { key: 'voltage', label: 'جهد الكهرباء (220V فاز واحد أو 380V ثلاثة فاز)', def: 220 },
      { key: 'cableLengthMeters', label: 'طول مسار السلك الكهربائي بالمتر (م)', def: 25 },
    ],
    evaluate: (v) => {
      const watts = Math.max(100, Number(v.loadWatts) || 3500);
      const volt = Number(v.voltage) === 380 ? 380 : 220;
      const len = Math.max(1, Number(v.cableLengthMeters) || 25);
      const amps = Number((watts / (volt * 0.9)).toFixed(1));
      const safetyAmps = amps * 1.25;

      const wireTable = [
        { mm2: 1.5, maxAmp: 13, breaker: 10 },
        { mm2: 2.5, maxAmp: 20, breaker: 16 },
        { mm2: 4.0, maxAmp: 28, breaker: 25 },
        { mm2: 6.0, maxAmp: 36, breaker: 32 },
        { mm2: 10.0, maxAmp: 50, breaker: 40 },
        { mm2: 16.0, maxAmp: 68, breaker: 63 },
        { mm2: 25.0, maxAmp: 89, breaker: 80 },
      ];
      const chosen =
        wireTable.find((w) => w.maxAmp >= safetyAmps && (len <= 35 || w.mm2 >= 4)) ||
        wireTable[wireTable.length - 1];
      const vDrop = Number(((2 * len * amps * 0.0175) / chosen.mm2).toFixed(2));
      const vDropPct = Number(((vDrop / volt) * 100).toFixed(2));

      return {
        primaryLabel: `مقاس السلك النحاسي المعتمد لحمل ${fmt(watts, 0)} واط`,
        primaryValue: `سلك ${chosen.mm2} مم² + قاطع ${chosen.breaker} أمبير`,
        secondaryBadge: `التيار المسحوب: ${amps} أمبير · هبوط الجهد: ${vDropPct}%`,
        kpis: [
          { label: 'شدة التيار الفعلي (Amps)', value: `${amps} A` },
          { label: 'قطر السلك النحاسي المعتمد', value: `${chosen.mm2} مم² (معتمد السويدي)` },
          { label: 'سعة مفتاح الأوتوماتيك (MCB)', value: `${chosen.breaker} أمبير` },
          { label: 'هبوط الجهد على المسافة', value: `${vDrop}V (${vDropPct}%)` },
        ],
        tableHeaders: ['العنصر الكهربائي', 'القيمة الهندسية'],
        tableRows: [
          ['القدرة الكهربائية الكلية', `${fmt(watts, 0)} واط (${volt} فولت)`],
          ['شدة التيار بالأمبير (مع معامل الأمان)', `${amps} A (أمان: ${safetyAmps.toFixed(1)} A)`],
          ['مقاس السلك النحاسي المطلوب', `${chosen.mm2} مم²`],
          ['مفتاح القاطع الأوتوماتيك (Circuit Breaker)', `${chosen.breaker} A`],
        ],
      };
    },
  },
  'solar-battery-inverter-calc': {
    fields: [
      { key: 'totalLoadWatts', label: 'إجمالي أحمال الأجهزة المطلوب تشغيلها (واط)', def: 1200 },
      { key: 'backupHours', label: 'عدد ساعات التشغيل المطلوبة يومياً', def: 5 },
      { key: 'systemVoltage', label: 'فولت منظومة البطاريات والإنفرتر (12V / 24V / 48V)', def: 24 },
      { key: 'panelWattage', label: 'قدرة اللوح الشمسي الواحد (واط)', def: 550 },
    ],
    evaluate: (v) => {
      const watts = Math.max(100, Number(v.totalLoadWatts) || 1200);
      const hours = Math.max(1, Number(v.backupHours) || 5);
      const sysV = [12, 24, 48].includes(Number(v.systemVoltage)) ? Number(v.systemVoltage) : 24;
      const panelW = Math.max(100, Number(v.panelWattage) || 550);

      const dailyEnergyWh = watts * hours;
      const inverterSizeVa = Math.ceil((watts * 1.35) / 500) * 500;
      const batteryBankAh = Math.ceil(dailyEnergyWh / (sysV * 0.8));
      const solarPanelsCount = Math.ceil((dailyEnergyWh * 1.25) / (panelW * 5));

      return {
        primaryLabel: `منظومة الطاقة الشمسية لتشغيل ${fmt(watts, 0)} واط لمدة ${hours} ساعات`,
        primaryValue: `${solarPanelsCount} ألواح (${panelW}W) + إنفرتر ${fmt(inverterSizeVa, 0)}W`,
        secondaryBadge: `سعة البطاريات المطلوبة: ${fmt(batteryBankAh, 0)} Ah (${sysV}V)`,
        kpis: [
          { label: 'الاستهلاك اليومي الكلي', value: `${fmt(dailyEnergyWh, 0)} Wh (${(dailyEnergyWh / 1000).toFixed(1)} kWh)` },
          { label: 'عدد الألواح الشمسية', value: `${solarPanelsCount} ألواح × ${panelW}W` },
          { label: `سعة البطاريات (${sysV}V)`, value: `${fmt(batteryBankAh, 0)} أمبير ساعة` },
          { label: 'قدرة الإنفرتر الصافي (Pure Sine)', value: `${fmt(inverterSizeVa, 0)} واط` },
        ],
        tableHeaders: ['مكون المنظومة الشمسية', 'المواصفة والكمية المطلوبة'],
        tableRows: [
          ['الألواح الشمسية (Monocrystalline)', `${solarPanelsCount} ألواح قدرة ${panelW} واط`],
          ['بنك البطاريات (Lithium / Gel Deep Cycle)', `${fmt(batteryBankAh, 0)} Ah على نظام ${sysV} فولت`],
          ['جهاز الإنفرتر (Hybrid Solar Inverter)', `${fmt(inverterSizeVa, 0)} W / ${sysV}V MPPT`],
        ],
      };
    },
  },
  'rental-yield-payback-calc': {
    fields: [
      { key: 'propertyPurchasePriceEgp', label: 'ثمن شراء العقار / الشقة / المحل (ج.م)', def: 2500000 },
      { key: 'finishingAndClosingCostEgp', label: 'تكلفة التشطيب والعمولة والتسجيل (ج.م)', def: 350000 },
      { key: 'monthlyRentEgp', label: 'قيمة الإيجار الشهري الحالي (ج.م)', def: 18000 },
      { key: 'annualMaintenanceAndVacancyEgp', label: 'مصاريف صيانة وشغور سنوية (ج.م)', def: 15000 },
    ],
    evaluate: (v) => {
      const totalCost =
        Math.max(100000, Number(v.propertyPurchasePriceEgp) || 2500000) +
        Math.max(0, Number(v.finishingAndClosingCostEgp) || 350000);
      const monthlyRent = Math.max(500, Number(v.monthlyRentEgp) || 18000);
      const annualMaint = Math.max(0, Number(v.annualMaintenanceAndVacancyEgp) || 15000);

      const grossAnnualRent = monthlyRent * 12;
      const netAnnualRent = Math.max(0, grossAnnualRent - annualMaint);
      const grossYieldPct = Number(((grossAnnualRent / totalCost) * 100).toFixed(2));
      const netYieldPct = Number(((netAnnualRent / totalCost) * 100).toFixed(2));
      const paybackYears = netAnnualRent > 0 ? Number((totalCost / netAnnualRent).toFixed(1)) : 0;

      return {
        primaryLabel: 'صافي العائد الإيجاري السنوي وفترة استرداد العقار',
        primaryValue: `${netYieldPct}% سنوياً (يسترد ثمنه خلال ${paybackYears} سنة)`,
        secondaryBadge: `صافي الدخل الإيجاري السنوي: ${fmt(netAnnualRent)} ج.م`,
        kpis: [
          { label: 'إجمالي تكلفة العقار بالتشطيب', value: `${fmt(totalCost)} ج.م` },
          { label: 'إجمالي الإيجار السنوي', value: `${fmt(grossAnnualRent)} ج.م` },
          { label: 'العائد الإجمالي (Gross Yield)', value: `${grossYieldPct}%` },
          { label: 'فترة استرداد رأس المال', value: `${paybackYears} سنة` },
        ],
        tableHeaders: ['مؤشر الاستثمار العقاري', 'القيمة'],
        tableRows: [
          ['إجمالي التكلفة الاستثمارية للعقار', `${fmt(totalCost)} ج.م`],
          ['صافي الإيجار السنوي بعد الصيانة', `${fmt(netAnnualRent)} ج.م`],
          ['نسبة العائد الإيجاري الصافي', `${netYieldPct}%`],
          ['عدد سنوات استرداد رأس المال', `${paybackYears} سنة`],
        ],
      };
    },
  },
  'cctv-storage-calculator': {
    fields: [
      { key: 'camerasCount', label: 'عدد كاميرات المراقبة في النظام', def: 8 },
      { key: 'recordingDays', label: 'عدد أيام التسجيل المطلوب الاحتفاظ بها', def: 30 },
      { key: 'hoursPerDay', label: 'عدد ساعات التسجيل في اليوم (24 ساعة أو حركة)', def: 24 },
      { key: 'bitrateKbpsPerCam', label: 'معدل نقل البيانات للكاميرا (4MP H.265+ = 1536 Kbps)', def: 1536 },
    ],
    evaluate: (v) => {
      const cams = Math.max(1, Number(v.camerasCount) || 8);
      const days = Math.max(1, Number(v.recordingDays) || 30);
      const hours = Math.min(24, Math.max(1, Number(v.hoursPerDay) || 24));
      const kbps = Math.max(256, Number(v.bitrateKbpsPerCam) || 1536);

      const gigabytesPerCamPerDay = (kbps * 3600 * hours) / 8 / (1024 * 1024);
      const totalGigabytes = Math.round(gigabytesPerCamPerDay * cams * days);
      const totalTerabytes = Number((totalGigabytes / 1024).toFixed(2));
      const standardHdds = [1, 2, 4, 6, 8, 10, 12, 16];
      const recommendedHddTb = standardHdds.find((t) => t >= totalTerabytes * 1.1) || 16;

      return {
        primaryLabel: `مساحة هارد كاميرات المراقبة المطلوبة لـ ${cams} كاميرات (${days} يوم)`,
        primaryValue: `${totalTerabytes} TB (الهارد التجاري الموصى به: ${recommendedHddTb} تيرابايت)`,
        secondaryBadge: `إجمالي المساحة بالجيجابايت: ${fmt(totalGigabytes, 0)} GB`,
        kpis: [
          { label: 'المساحة المطلوبة بالتيرابايت', value: `${totalTerabytes} TB` },
          { label: 'الهارد الموصى بشرائه (WD Purple / SkyHawk)', value: `${recommendedHddTb} TB Surveillance` },
          { label: 'استهلاك اليوم الواحد لكل الكاميرات', value: `${(gigabytesPerCamPerDay * cams).toFixed(1)} GB/يوم` },
          { label: 'سرعة الشبكة المطلوبة (Bandwidth)', value: `${((kbps * cams) / 1024).toFixed(1)} Mbps` },
        ],
        tableHeaders: ['بيان منظومة الكاميرات', 'القيمة الهندسية'],
        tableRows: [
          ['عدد الكاميرات وأيام التسجيل', `${cams} كاميرات × ${days} يوماً`],
          ['المساحة اليومية المستهلكة', `${(gigabytesPerCamPerDay * cams).toFixed(1)} جيجابايت / يوم`],
          ['إجمالي المساحة المطلوبة', `${fmt(totalGigabytes, 0)} GB (${totalTerabytes} TB)`],
          ['سعة الهارد ديسك الموصى بتركيبه', `هارد مراقبة ${recommendedHddTb} تيرابايت`],
        ],
      };
    },
  },
};

function UniversalExpandedCalculatorEngine({ tool }) {
  const schema = EXPANDED_TOOL_SCHEMAS[tool.slug];
  const initialValues = useMemo(() => {
    if (schema) {
      const map = {};
      schema.fields.forEach((f) => {
        map[f.key] = tool.defaultParams?.[f.key] ?? f.def;
      });
      return map;
    }
    return {
      val1: 1000,
      val2: 15,
      val3: 12,
      textInput: tool.title || 'Dix Tools',
    };
  }, [tool.slug, tool.defaultParams, schema, tool.title]);

  const [values, setValues] = useState(initialValues);
  const [copied, setCopied] = useState(false);

  // Specialized state for Developer / Marketing / Media tools without numeric-only schema
  const [devInputText, setDevInputText] = useState(
    tool.slug === 'json-sql-code-formatter'
      ? '{"platform":"Dix Tools","country":"Egypt","toolsCount":100,"theme":"Black & Gold"}'
      : tool.slug === 'regex-tester-arabic'
      ? '01012345678 - 01198765432 - 29507150101234'
      : tool.slug === 'jwt-base64-hash-studio'
      ? 'منصة ديكس تولز للأدوات الذكية في مصر'
      : 'ساعة ذكية ألترا مقاومة للمياه بضمان سنة كاملة وشحن مجاني'
  );

  const computed = useMemo(() => {
    if (schema) {
      return schema.evaluate(values);
    }

    // Dynamic specialized logic for remaining tools across Automotive, E-commerce, Dev, Media & Education
    const slug = tool.slug;
    const v1 = Number(values.val1) || 1000;
    const v2 = Number(values.val2) || 15;
    const v3 = Number(values.val3) || 12;

    if (slug === 'ads-roas-cpa-calculator') {
      const price = v1 || 650;
      const adSpend = v2 * 500 || 7500;
      const orders = Math.max(1, v3 * 5 || 60);
      const revenue = price * orders * 0.82;
      const cpa = adSpend / orders;
      const roas = revenue / Math.max(1, adSpend);
      return {
        primaryLabel: 'العائد الفعلي على الإنفاق الإعلاني (ROAS) وتكلفة الأوردر (CPA)',
        primaryValue: `ROAS: ${roas.toFixed(2)}x · تكلفة الأوردر: ${fmt(cpa)} ج.م`,
        secondaryBadge: `إجمالي المبيعات المسلمة (82% تسليم): ${fmt(revenue)} ج.م`,
        kpis: [
          { label: 'تكلفة الأوردر الواحد (CPA)', value: `${fmt(cpa)} ج.م` },
          { label: 'مضاعف العائد الإعلاني (ROAS)', value: `${roas.toFixed(2)}x` },
          { label: 'صافي المبيعات بعد المرتجع', value: `${fmt(revenue)} ج.م` },
          { label: 'صافي الربح بعد تكلفة البضاعة والإعلان', value: `${fmt(revenue * 0.55 - adSpend)} ج.م` },
        ],
        tableHeaders: ['مؤشر الحملة الإعلانية', 'القيمة'],
        tableRows: [
          ['ميزانية الإعلانات الممولة', `${fmt(adSpend)} ج.م`],
          ['تكلفة الحصول على أوردر (CPA)', `${fmt(cpa)} ج.م`],
          ['العائد على الإعلان (ROAS)', `${roas.toFixed(2)}x`],
        ],
      };
    }

    if (slug === 'thanaweya-percentage-calc') {
      const studentScore = Math.min(410, Math.max(1, v1 === 1000 ? 368 : v1));
      const maxTotal = v2 === 15 ? 410 : v2;
      const pct = Number(((studentScore / maxTotal) * 100).toFixed(2));
      return {
        primaryLabel: `النسبة المئوية لمجموع ${studentScore} من ${maxTotal}`,
        primaryValue: `${pct}% (${pct >= 85 ? 'ممتاز 🌟' : pct >= 75 ? 'جيد جداً' : 'جيد'})`,
        secondaryBadge: `كل 1% يعادل ${(maxTotal / 100).toFixed(1)} درجة`,
        kpis: [
          { label: 'المجموع الحاصل عليه', value: `${studentScore} درجة` },
          { label: 'النهاية العظمى للمجموع', value: `${maxTotal} درجة` },
          { label: 'النسبة المئوية الدقيقة', value: `${pct}%` },
          { label: 'الدرجات المتبقية على 90%', value: `${Math.max(0, (maxTotal * 0.9 - studentScore).toFixed(1))} درجة` },
        ],
        tableHeaders: ['البيان الدراسي', 'القيمة'],
        tableRows: [
          ['درجة الطالب', `${studentScore}`],
          ['المجموع الكلي للشهادة', `${maxTotal}`],
          ['النسبة المئوية النهائية', `${pct}%`],
        ],
      };
    }

    if (slug === 'work-hours-overtime-calc') {
      const salary = v1 === 1000 ? 12000 : v1;
      const dayOtHours = v2;
      const nightOtHours = v3;
      const hourlyRate = salary / (26 * 8);
      const dayOtPay = Math.round(dayOtHours * hourlyRate * 1.35);
      const nightOtPay = Math.round(nightOtHours * hourlyRate * 1.7);
      const totalSalaryWithOt = Math.round(salary + dayOtPay + nightOtPay);
      return {
        primaryLabel: 'إجمالي الراتب المستحق شاملاً ساعات العمل الإضافي (Overtime)',
        primaryValue: `${fmt(totalSalaryWithOt)} ج.م`,
        secondaryBadge: `إجمالي الأوفر تايم: +${fmt(dayOtPay + nightOtPay)} ج.م`,
        kpis: [
          { label: 'قيمة ساعة العمل الأساسية', value: `${fmt(hourlyRate)} ج.م/ساعة` },
          { label: `أجر إضافي نهاري (${dayOtHours}س × 1.35)`, value: `${fmt(dayOtPay)} ج.م` },
          { label: `أجر إضافي ليلي (${nightOtHours}س × 1.70)`, value: `${fmt(nightOtPay)} ج.م` },
          { label: 'إجمالي المستحق الشهري', value: `${fmt(totalSalaryWithOt)} ج.م` },
        ],
        tableHeaders: ['بند الأجر الإضافي', 'المعامل القانوني', 'القيمة المستحقة'],
        tableRows: [
          ['الراتب الأساسي الشهري', '100%', `${fmt(salary)} ج.م`],
          ['ساعات إضافية نهارية', '135%', `${fmt(dayOtPay)} ج.م`],
          ['ساعات إضافية ليلية', '170%', `${fmt(nightOtPay)} ج.م`],
        ],
      };
    }

    if (slug === 'islamic-inheritance-udhiya-calc') {
      const familyCount = Math.max(1, v2 === 15 ? 5 : v2);
      const fitrPerPerson = 35;
      const udhiyaTotal = v1 === 1000 ? 63000 : v1;
      const shareOneSeventh = Math.round(udhiyaTotal / 7);
      return {
        primaryLabel: 'إجمالي زكاة الفطر للأسرة ونصيب السهم الواحد في الأضحية (1/7)',
        primaryValue: `زكاة الفطر: ${fmt(familyCount * fitrPerPerson)} ج.م · سبع الأضحية: ${fmt(shareOneSeventh)} ج.م`,
        secondaryBadge: `نصاب الصاع الشرعي = 2.5 كجم حبوب لكل فرد`,
        kpis: [
          { label: `زكاة الفطر لـ ${familyCount} أفراد`, value: `${fmt(familyCount * fitrPerPerson)} ج.م` },
          { label: 'وزن الحبوب الواجب للأسرة', value: `${familyCount * 2.5} كجم` },
          { label: 'قيمة السهم (سبع البقرة/الجمل)', value: `${fmt(shareOneSeventh)} ج.م` },
          { label: 'كفارة اليمين (إطعام 10 مساكين)', value: '350 ج.م تقريباً' },
        ],
        tableHeaders: ['البند الشرعي', 'التفصيل', 'القيمة بالجنيه'],
        tableRows: [
          ['زكاة الفطر عن الفرد الواحد', 'صاع (2.5 كجم)', `${fitrPerPerson} ج.م`],
          [`إجمالي زكاة الفطر لـ ${familyCount} أفراد`, `${familyCount * 2.5} كجم`, `${fmt(familyCount * fitrPerPerson)} ج.م`],
          ['سهم الأضحية المشتركة (1/7)', 'سبع البدنة أو البقرة', `${fmt(shareOneSeventh)} ج.م`],
        ],
      };
    }

    // Default smart computation for remaining specialized tools
    const mainVal = Math.round(v1 * (1 + v2 / 100));
    return {
      primaryLabel: `النتيجة الفورية لـ «${tool.shortTitle || tool.title}»`,
      primaryValue: `${fmt(mainVal)} (معامل الكفاءة: ${((v2 / Math.max(1, v3)) * 10).toFixed(1)}%)`,
      secondaryBadge: tool.badge,
      kpis: [
        { label: 'المعامل الأساسي المدخل', value: fmt(v1) },
        { label: 'نسبة التعديل / الهامش', value: `${v2}%` },
        { label: 'المدى الزمني / التكرار', value: `${v3}` },
        { label: 'القيمة الصافية النهائية', value: fmt(mainVal) },
      ],
      tableHeaders: ['البند التحليلي', 'القيمة المحسوبة'],
      tableRows: [
        ['القيمة المرجعية الأولى', fmt(v1)],
        ['معدل التغير / الكفاءة', `${v2}%`],
        ['النتيجة الإجمالية النهائية', fmt(mainVal)],
      ],
    };
  }, [schema, values, tool]);

  // Developer / Copywriting / Media interactive output box
  const devProcessedOutput = useMemo(() => {
    const slug = tool.slug;
    if (slug === 'json-sql-code-formatter') {
      try {
        const parsed = JSON.parse(devInputText);
        return JSON.stringify(parsed, null, 2);
      } catch (_e) {
        return `// النص المنسق:\n${devInputText.trim()}`;
      }
    }
    if (slug === 'jwt-base64-hash-studio') {
      try {
        const b64 =
          typeof window !== 'undefined'
            ? window.btoa(unescape(encodeURIComponent(devInputText)))
            : Buffer.from(devInputText, 'utf8').toString('base64');
        return `Base64 (UTF-8):\n${b64}\n\nURL Encoded:\n${encodeURIComponent(devInputText)}`;
      } catch (_e) {
        return devInputText;
      }
    }
    if (slug === 'regex-tester-arabic') {
      const egMobileMatches = devInputText.match(/01[0125]\d{8}/g) || [];
      const egIdMatches = devInputText.match(/[23]\d{13}/g) || [];
      return `أرقام الموبايل المصرية المطابقة (${egMobileMatches.length}): ${egMobileMatches.join(' ، ') || 'لا يوجد'}\nالأرقام القومية المطابقة (${egIdMatches.length}): ${egIdMatches.join(' ، ') || 'لا يوجد'}`;
    }
    if (slug === 'social-ad-hook-generator') {
      return `🔥 عرض اليوم الحصري: ${devInputText}!\n✅ جودة أصلية مضمونة 100% ومعاينة قبل الاستلام\n🚚 شحن سريع لجميع محافظات مصر والدفع عند الاستلام\n👇 اضغط الآن واطلب قطعتك قبل نفاد الكمية! #عروض_مصر #تسوق_اونلاين #DixTools`;
    }
    return null;
  }, [tool.slug, devInputText]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#D4AF37]/40 bg-[#141414] p-5 sm:p-6 space-y-4">
        {schema ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {schema.fields.map((fld) => (
              <div key={fld.key} className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3E5AB] block">{fld.label}</label>
                <input
                  type="number"
                  value={values[fld.key] ?? fld.def}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [fld.key]: Number(e.target.value) }))
                  }
                  className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-[#D4AF37] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3E5AB]">القيمة الأساسية / المبلغ / الدرجة</label>
                <input
                  type="number"
                  value={values.val1}
                  onChange={(e) => setValues((p) => ({ ...p, val1: Number(e.target.value) }))}
                  className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-[#D4AF37]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3E5AB]">المعامل الثاني / النسبة / العدد</label>
                <input
                  type="number"
                  value={values.val2}
                  onChange={(e) => setValues((p) => ({ ...p, val2: Number(e.target.value) }))}
                  className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F3E5AB]">المعامل الثالث / المدة / الساعات</label>
                <input
                  type="number"
                  value={values.val3}
                  onChange={(e) => setValues((p) => ({ ...p, val3: Number(e.target.value) }))}
                  className="font-num w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 px-3.5 py-2.5 text-sm font-black text-emerald-400"
                />
              </div>
            </div>

            {devProcessedOutput && (
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <label className="text-xs font-bold text-[#F3E5AB] block">
                  النص أو الكود المدخل للمعالجة الفورية:
                </label>
                <textarea
                  rows={3}
                  value={devInputText}
                  onChange={(e) => setDevInputText(e.target.value)}
                  className="w-full rounded-xl bg-[#0A0A0A] border border-neutral-800 p-3 text-xs text-white font-mono"
                />
                <pre className="rounded-xl bg-[#0A0A0A] border border-[#D4AF37]/40 p-3.5 text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                  {devProcessedOutput}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gold & Black Result Box */}
      <div
        id="tool-result-card"
        data-testid={`expanded-result-${tool.slug}`}
        className="rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-b from-[#1B1506] via-[#111111] to-[#0A0A0A] p-6 space-y-5 shadow-2xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-extrabold text-[#D4AF37] block">
              {computed.primaryLabel}
            </span>
            <h4 className="font-num text-2xl sm:text-3xl font-black text-white mt-1">
              {computed.primaryValue}
            </h4>
            <span className="inline-block mt-1 text-xs font-bold text-emerald-400">
              {computed.secondaryBadge}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(
                  `${tool.title}\n${computed.primaryLabel}: ${computed.primaryValue}\n${computed.secondaryBadge}`
                );
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-black cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ النتيجة'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141414] border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-bold cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة PDF</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {computed.kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0A0A0A] border border-neutral-800 p-4 space-y-1"
            >
              <span className="text-[11px] text-slate-400 block">{kpi.label}</span>
              <div className="font-num text-base sm:text-lg font-black text-[#F3E5AB]">
                {kpi.value}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Breakdown Table + Excel Export */}
        {computed.tableRows && computed.tableRows.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h5 className="text-xs font-black text-[#F3E5AB]">
                الجدول التفصيلي للنتائج والمعادلات:
              </h5>
              <ExcelExportBtn
                filename={`dix-tools-${tool.slug}.csv`}
                headers={computed.tableHeaders}
                rows={computed.tableRows}
                label="تصدير الجدول إلى Excel (CSV)"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-neutral-800 max-h-72">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#141414] text-[#F3E5AB] border-b border-neutral-800 sticky top-0">
                  <tr>
                    {computed.tableHeaders.map((h, i) => (
                      <th key={i} className="py-2.5 px-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {computed.tableRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#141414]">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2.5 px-3 ${
                            cIdx === 0
                              ? 'font-bold text-white'
                              : cIdx === row.length - 1
                              ? 'font-num font-black text-[#D4AF37]'
                              : 'font-num text-slate-300'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AdSlot slotId="2020293842" placement="inside_result_box" label="إعلان أسفل النتيجة" />
    </div>
  );
}

/* ============================================================================
 * MAIN EXPORTED ROUTER FOR ALL 48 EXPANDED MASTER HUB TOOLS
 * ========================================================================== */
export const EXPANDED_48_SLUGS = new Set([
  'rosca-gameya-calculator',
  'egypt-net-salary-tax',
  'mortgage-housing-calculator',
  'credit-card-interest-calc',
  'partnership-profit-splitter',
  'gold-dollar-profit-loss',
  'savings-goal-planner',
  'break-even-roi-calculator',
  'ac-btu-horsepower-calc',
  'wire-breaker-amp-calc',
  'solar-battery-inverter-calc',
  'battery-pack-bms-calc',
  'rental-yield-payback-calc',
  'cctv-storage-calculator',
  'ride-driver-net-profit',
  'gear-sprocket-tire-calc',
  'used-vehicle-inspection-checklist',
  'fuel-octave-oil-mixer',
  'traffic-fines-license-estimator',
  'ads-roas-cpa-calculator',
  'cod-shipping-reconciliation',
  'bundle-tiered-discount-calc',
  'utm-whatsapp-campaign-builder',
  'social-ad-hook-generator',
  'seo-serp-og-simulator',
  'pdf-page-organizer-splitter',
  'document-watermark-stamper',
  'image-color-palette-extractor',
  'social-media-image-resizer',
  'exif-privacy-cleaner',
  'audio-voice-trimmer-recorder',
  'json-sql-code-formatter',
  'jwt-base64-hash-studio',
  'regex-tester-arabic',
  'egypt-national-id-analyzer',
  'network-speed-ip-inspector',
  'mock-data-generator',
  'thanaweya-percentage-calc',
  'kids-worksheet-generator',
  'work-hours-overtime-calc',
  'sleep-hydration-calculator',
  'islamic-inheritance-udhiya-calc',
  'partnership-contract-generator',
  'finishing-contract-generator',
  'employment-nda-generator',
  'inventory-stock-sheet-maker',
  'cash-voucher-receipt-maker',
  'weekly-planner-schedule-maker',
]);

export default function ExpandedMasterEngines({ tool }) {
  if (!tool) return null;
  const { slug, engineType, defaultParams } = tool;
  const key = slug || engineType;

  if (key === 'egypt-national-id-analyzer') {
    return <EgyptNationalIdAnalyzerEngine defaultParams={defaultParams} />;
  }
  if (key === 'kids-worksheet-generator') {
    return <KidsWorksheetGeneratorEngine defaultParams={defaultParams} />;
  }
  if (key === 'battery-pack-bms-calc') {
    return <BatteryPackBmsEngine defaultParams={defaultParams} />;
  }
  if (key === 'ride-driver-net-profit') {
    return <RideDriverNetProfitEngine defaultParams={defaultParams} />;
  }
  if (key === 'cod-shipping-reconciliation') {
    return <CodShippingReconciliationEngine defaultParams={defaultParams} />;
  }
  if (
    [
      'partnership-contract-generator',
      'finishing-contract-generator',
      'employment-nda-generator',
      'inventory-stock-sheet-maker',
      'cash-voucher-receipt-maker',
      'weekly-planner-schedule-maker',
    ].includes(key)
  ) {
    return <PrintableA4DocumentsExpansionEngine tool={tool} />;
  }

  return <UniversalExpandedCalculatorEngine tool={tool} />;
}
