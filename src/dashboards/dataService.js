import { 
  QUERY_BY_ENTITY_01, QUERY_BY_INSURANCE_01, QUERY_BY_VISIT_TYPE_01, QUERY_BY_DENIAL_CODE_01,
  QUERY_BY_ENTITY_BE, QUERY_BY_INS_BE, QUERY_BY_VISIT_TYPE_BE, QUERY_BY_BE_TYPE_BE,
  DENIALS_HIERARCHY, BILLING_EDIT_HIERARCHY, AR_DAYS_HIERARCHY, AGED_AR_DAYS_HIERARCHY, 
  DAYS_DISCHARGED_HIERARCHY, BAD_DEBT_HIERARCHY, POS_CASH_HIERARCHY, CASH_COLLECTED_HIERARCHY,
  CHARITY_CARE_HIERARCHY, DASHBOARD_OPTIONS
} from "./constants";
import { formatMonthYear } from "./utils";
import { API_CONFIG } from "../config/config";

// Helper function to check if subtype is hierarchical
export function isHierarchicalSubtype(subtype, dashboardType) {
  return DENIALS_HIERARCHY.includes(subtype) || 
         BILLING_EDIT_HIERARCHY.includes(subtype) || 
         AR_DAYS_HIERARCHY.includes(subtype) || 
         AGED_AR_DAYS_HIERARCHY.includes(subtype) || 
         DAYS_DISCHARGED_HIERARCHY.includes(subtype) || 
         BAD_DEBT_HIERARCHY.includes(subtype) || 
         POS_CASH_HIERARCHY.includes(subtype) || 
         CASH_COLLECTED_HIERARCHY.includes(subtype) || 
         CHARITY_CARE_HIERARCHY.includes(subtype);
}

// Helper function to filter data by entity and date range
export function filterDataByEntityAndDate(chartData, selectedEntity, fromDate, toDate) {
  return chartData.filter(d => {
    // Always filter by selected entity if set
    if (selectedEntity) {
      const entityInData = (d.EntityName || '').toString().trim().toUpperCase();
      const selected = selectedEntity.toString().trim().toUpperCase();
      if (entityInData !== selected) return false;
    }
    // Always filter by date range
    const date = new Date(d.dateValue);
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return !isNaN(date) && date >= from && date <= to;
  });
}

// Get subtype options with hierarchical logic
export function getSubtypeOptions(dashboardType, subtype, denialHierarchyLevel, billingEditHierarchyLevel, 
  arDaysHierarchyLevel, agedArDaysHierarchyLevel, daysDischargedHierarchyLevel, badDebtHierarchyLevel, 
  posCashHierarchyLevel, cashCollectedHierarchyLevel, charityCareHierarchyLevel) {
    
  const isDenialsDashboard = dashboardType === "Denials";
  const isBillingEditDashboard = dashboardType === "Billing Edit";
  const isArDaysDashboard = dashboardType === "AR Days";
  const isAgedArDaysDashboard = dashboardType === "Aged AR Days";
  const isDaysDischargedDashboard = dashboardType === "Days Discharged";
  const isBadDebtDashboard = dashboardType === "Bad Debt";
  const isPosCashDashboard = dashboardType === "POS Cash";
  const isCashCollectedDashboard = dashboardType === "Cash Collected";
  const isCharityCareDashboard = dashboardType === "Charity Care";
    
  if (!isDenialsDashboard && !isBillingEditDashboard && !isArDaysDashboard && !isAgedArDaysDashboard && !isDaysDischargedDashboard && !isBadDebtDashboard && !isPosCashDashboard && !isCashCollectedDashboard && !isCharityCareDashboard) 
    return DASHBOARD_OPTIONS[dashboardType].map(st => ({ value: st, disabled: false }));
  
  if (isDenialsDashboard) {
    // Always show non-hierarchical subtypes enabled
    const nonHierarchicalOptions = DASHBOARD_OPTIONS[dashboardType]
      .filter(st => !DENIALS_HIERARCHY.includes(st))
      .map(st => ({ value: st, disabled: false }));
    // Hierarchical options: disable until reached, with indentation
    const hierarchyOptions = DENIALS_HIERARCHY.map((st, idx) => ({
      value: st,
      disabled: idx > denialHierarchyLevel,
      label: ' '.repeat(idx * 2) + st
    }));
    return [...nonHierarchicalOptions, ...hierarchyOptions];
  } else if (isBillingEditDashboard) {
    // Always show non-hierarchical subtypes enabled
    const nonHierarchicalOptions = DASHBOARD_OPTIONS[dashboardType]
      .filter(st => !BILLING_EDIT_HIERARCHY.includes(st))
      .map(st => ({ value: st, disabled: false }));
    // Hierarchical options: disable until reached, with indentation
    const hierarchyOptions = BILLING_EDIT_HIERARCHY.map((st, idx) => ({
      value: st,
      disabled: idx > billingEditHierarchyLevel,
      label: ' '.repeat(idx * 2) + st
    }));
    return [...nonHierarchicalOptions, ...hierarchyOptions];
  } else if (isArDaysDashboard) {
    // Always show non-hierarchical subtypes enabled
    const nonHierarchicalOptions = DASHBOARD_OPTIONS[dashboardType]
      .filter(st => !AR_DAYS_HIERARCHY.includes(st))
      .map(st => ({ value: st, disabled: false }));
    // Hierarchical options: disable until reached, with indentation
    const hierarchyOptions = AR_DAYS_HIERARCHY.map((st, idx) => ({
      value: st,
      disabled: idx > arDaysHierarchyLevel,
      label: ' '.repeat(idx * 2) + st
    }));
    return [...nonHierarchicalOptions, ...hierarchyOptions];
  } else if (isAgedArDaysDashboard) {
    // Always show non-hierarchical subtypes enabled
    const nonHierarchicalOptions = DASHBOARD_OPTIONS[dashboardType]
      .filter(st => !AGED_AR_DAYS_HIERARCHY.includes(st))
      .map(st => ({ value: st, disabled: false }));
    // Hierarchical options: disable until reached, with indentation
    const hierarchyOptions = AGED_AR_DAYS_HIERARCHY.map((st, idx) => ({
      value: st,
      disabled: idx > agedArDaysHierarchyLevel,
      label: ' '.repeat(idx * 2) + st
    }));
    return [...nonHierarchicalOptions, ...hierarchyOptions];
  } else if (isDaysDischargedDashboard) {
    // Always show non-hierarchical subtypes enabled
    const nonHierarchicalOptions = DASHBOARD_OPTIONS[dashboardType]
      .filter(st => !DAYS_DISCHARGED_HIERARCHY.includes(st))
      .map(st => ({ value: st, disabled: false }));
    // Hierarchical options: disable until reached, with indentation
    const hierarchyOptions = DAYS_DISCHARGED_HIERARCHY.map((st, idx) => ({
      value: st,
      disabled: idx > daysDischargedHierarchyLevel,
      label: ' '.repeat(idx * 2) + st
    }));
    return [...nonHierarchicalOptions, ...hierarchyOptions];
  } else if (isBadDebtDashboard) {
    // Always show non-hierarchical subtypes enabled
    const nonHierarchicalOptions = DASHBOARD_OPTIONS[dashboardType]
      .filter(st => !BAD_DEBT_HIERARCHY.includes(st))
      .map(st => ({ value: st, disabled: false }));
    // Hierarchical options: disable until reached, with indentation
    const hierarchyOptions = BAD_DEBT_HIERARCHY.map((st, idx) => ({
      value: st,
      disabled: idx > badDebtHierarchyLevel,
      label: ' '.repeat(idx * 2) + st
    }));
    return [...nonHierarchicalOptions, ...hierarchyOptions];
  } else if (isPosCashDashboard) {
    // Always show non-hierarchical subtypes enabled
    const nonHierarchicalOptions = DASHBOARD_OPTIONS[dashboardType]
      .filter(st => !POS_CASH_HIERARCHY.includes(st))
      .map(st => ({ value: st, disabled: false }));
    // Hierarchical options: disable until reached, with indentation
    const hierarchyOptions = POS_CASH_HIERARCHY.map((st, idx) => ({
      value: st,
      disabled: idx > posCashHierarchyLevel,
      label: ' '.repeat(idx * 2) + st
    }));
    return [...nonHierarchicalOptions, ...hierarchyOptions];
  } else if (isCashCollectedDashboard) {
    // Always show non-hierarchical subtypes enabled
    const nonHierarchicalOptions = DASHBOARD_OPTIONS[dashboardType]
      .filter(st => !CASH_COLLECTED_HIERARCHY.includes(st))
      .map(st => ({ value: st, disabled: false }));
    // Hierarchical options: disable until reached, with indentation
    const hierarchyOptions = CASH_COLLECTED_HIERARCHY.map((st, idx) => ({
      value: st,
      disabled: idx > cashCollectedHierarchyLevel,
      label: ' '.repeat(idx * 2) + st
    }));
    return [...nonHierarchicalOptions, ...hierarchyOptions];
  } else if (isCharityCareDashboard) {
    // Always show non-hierarchical subtypes enabled
    const nonHierarchicalOptions = DASHBOARD_OPTIONS[dashboardType]
      .filter(st => !CHARITY_CARE_HIERARCHY.includes(st))
      .map(st => ({ value: st, disabled: false }));
    // Hierarchical options: disable until reached, with indentation
    const hierarchyOptions = CHARITY_CARE_HIERARCHY.map((st, idx) => ({
      value: st,
      disabled: idx > charityCareHierarchyLevel,
      label: ' '.repeat(idx * 2) + st
    }));
    return [...nonHierarchicalOptions, ...hierarchyOptions];
  }
}

// Filter and process hierarchical data
export function getHierarchicalFilteredData(filteredData, isHierarchicalSubtype, subtype, dashboardType, metricOptions, 
  selectedEntityBar, selectedInsuranceBar, selectedVisitTypeBar, selectedEntityBarBE, selectedInsBarBE, selectedVisitTypeBarBE,
  selectedEntityBarAR, selectedFinancialClassBarAR, selectedAccountGroupBarAR, selectedEntityBarAgedAR, 
  selectedFinancialClassBarAgedAR, selectedAccountGroupBarAgedAR, selectedServiceAreaBarAgedAR, 
  selectedEntityBarDD, selectedFinancialClassBarDD, selectedVisitTypeBarDD, selectedServiceAreaBarDD,
  selectedEntityBarBD, selectedFinancialClassBarBD, selectedVisitTypeBarBD, selectedServiceAreaBarBD,
  selectedEntityBarPC, selectedVisitTypeBarPC, selectedServiceAreaBarPC, selectedPaymentCodeBarPC,
  selectedEntityBarCC, selectedAccGrpBarCC, selectedPCBarCC, selectedEntityBarCCare, selectedVisitTypeBarCCare,
  selectedServiceAreaBarCCare, charityCareHierarchyLevel, selectedEntity) {
    
  if (!isHierarchicalSubtype) return filteredData;

  let result = [...filteredData];
  const isDenialsDashboard = dashboardType === "Denials";
  const isBillingEditDashboard = dashboardType === "Billing Edit";
  const isArDaysDashboard = dashboardType === "AR Days";
  const isAgedArDaysDashboard = dashboardType === "Aged AR Days";
  const isDaysDischargedDashboard = dashboardType === "Days Discharged";
  const isBadDebtDashboard = dashboardType === "Bad Debt";
  const isPosCashDashboard = dashboardType === "POS Cash";
  const isCashCollectedDashboard = dashboardType === "Cash Collected";
  const isCharityCareDashboard = dashboardType === "Charity Care";

  if (isDenialsDashboard) {
    if (subtype === QUERY_BY_ENTITY_01) {
      if (!selectedEntityBar) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBar) {
        result = result.filter(d => d.EntityName === selectedEntityBar.EntityName);
      }
    } else {
      if (selectedEntity && !selectedEntityBar) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBar) {
        result = result.filter(d => d.EntityName === selectedEntityBar.EntityName);
      }
    }

    // Filter by selected insurance if applicable
    if (selectedInsuranceBar) {
      result = result.filter(d => (d.CarrierName || d.InsuranceName) === selectedInsuranceBar);
    }

    // Filter by selected visit type if applicable
    if (selectedVisitTypeBar) {
      result = result.filter(d => d.VisitType === selectedVisitTypeBar);
    }

    // Group data based on current level
    if (result.length > 0) {
      if (subtype === QUERY_BY_ENTITY_01) {
        const groupedData = {};
        result.forEach(item => {
          const key = item.EntityName;
          if (!groupedData[key]) {
            groupedData[key] = { EntityName: key, MonthYear: item.MonthYear, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === QUERY_BY_INSURANCE_01) {
        const groupedData = {};
        result.forEach(item => {
          const key = item.CarrierName || item.InsuranceName;
          if (!groupedData[key]) {
            groupedData[key] = { CarrierName: key, InsuranceName: key, EntityName: item.EntityName, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === QUERY_BY_VISIT_TYPE_01) {
        const groupedData = {};
        result.forEach(item => {
          const key = item.VisitType;
          if (!groupedData[key]) {
            groupedData[key] = { VisitType: key, EntityName: item.EntityName, CarrierName: item.CarrierName || item.InsuranceName, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === QUERY_BY_DENIAL_CODE_01) {
        const groupedData = {};
        result.forEach(item => {
          const key = item.DenialCode;
          if (!groupedData[key]) {
            groupedData[key] = { DenialCode: key, EntityName: item.EntityName, CarrierName: item.CarrierName || item.InsuranceName, VisitType: item.VisitType, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      }
    }
  } 
  
  // Add all the other dashboard type logic here
  // Refer to App.js lines 800-1752 for the implementation

  return result;
}

export async function fetchDataForSubtype({
  namespace,
  dashboardType,
  subtypeValue,
  denialHierarchyLevel,
  selectedEntityBar,
  selectedInsuranceBar,
  selectedVisitTypeBar,
  billingEditHierarchyLevel,
  selectedEntityBarBE,
  selectedInsBarBE,
  selectedVisitTypeBarBE,
  arDaysHierarchyLevel,
  selectedEntityBarAR,
  selectedFinancialClassBarAR,
  selectedAccountGroupBarAR,
  agedArDaysHierarchyLevel,
  selectedEntityBarAgedAR,
  selectedFinancialClassBarAgedAR,
  selectedAccountGroupBarAgedAR,
  selectedServiceAreaBarAgedAR,
  daysDischargedHierarchyLevel,
  selectedEntityBarDD,
  selectedFinancialClassBarDD,
  selectedVisitTypeBarDD,
  selectedServiceAreaBarDD,
  badDebtHierarchyLevel,
  selectedEntityBarBD,
  selectedFinancialClassBarBD,
  selectedVisitTypeBarBD,
  selectedServiceAreaBarBD,
  posCashHierarchyLevel,
  selectedEntityBarPC,
  selectedFinancialClassBarPC,
  selectedVisitTypeBarPC,
  selectedServiceAreaBarPC,
  selectedPaymentCodeBarPC,
  cashCollectedHierarchyLevel,
  selectedEntityBarCC,
  selectedAccGrpBarCC,
  selectedPCBarCC,
  charityCareHierarchyLevel,
  selectedEntityBarCCare,
  selectedVisitTypeBarCCare,
  selectedServiceAreaBarCCare,
  selectedAccGrpBarCCare,
  selectedPCBarCCare,
  selectedEntity,
  fromDate,
  toDate
}) {
  let args = [];
  if (dashboardType === "Denials") {
    // Hierarchy level 1: Denials by Entity
    if (subtypeValue === QUERY_BY_ENTITY_01 && denialHierarchyLevel === 0 && selectedEntityBar) {
      // Removed AccountingYearPeriod
    }
    // Hierarchy level 2: Denials by Insurance
    else if (subtypeValue === QUERY_BY_INSURANCE_01 && denialHierarchyLevel === 1 && selectedEntityBar && selectedEntityBar.EntityName) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBar.EntityName)}`);
    }
    // Hierarchy level 3: Denials by Visit Type
    else if (subtypeValue === QUERY_BY_VISIT_TYPE_01 && denialHierarchyLevel === 2 && selectedEntityBar && selectedEntityBar.EntityName && selectedInsuranceBar) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBar.EntityName)}`);
      args.push(`Insurance=${encodeURIComponent(selectedInsuranceBar)}`);
    }
    // Hierarchy level 4: Denials by Denial Code
    else if (subtypeValue === QUERY_BY_DENIAL_CODE_01 && denialHierarchyLevel === 3 && selectedEntityBar && selectedEntityBar.EntityName && selectedInsuranceBar && selectedVisitTypeBar) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBar.EntityName)}`);
      args.push(`Insurance=${encodeURIComponent(selectedInsuranceBar)}`);
      args.push(`VisitType=${encodeURIComponent(selectedVisitTypeBar)}`);
    }
  } else if (dashboardType === "Billing Edit") {
    // Hierarchy level 1: Billing Edit by Entity
    if (subtypeValue === QUERY_BY_ENTITY_BE && billingEditHierarchyLevel === 0 && selectedEntityBarBE) {
      // Removed AccountingYearPeriod
    }
    // Hierarchy level 2: Billing Edit by Ins
    else if (subtypeValue === QUERY_BY_INS_BE && billingEditHierarchyLevel === 1 && selectedEntityBarBE && selectedEntityBarBE.EntityName) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarBE.EntityName)}`);
    }
    // Hierarchy level 3: Billing Edit by Visit Type
    else if (subtypeValue === QUERY_BY_VISIT_TYPE_BE && billingEditHierarchyLevel === 2 && selectedEntityBarBE && selectedEntityBarBE.EntityName && selectedInsBarBE) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarBE.EntityName)}`);
      args.push(`Ins=${encodeURIComponent(selectedInsBarBE)}`);
    }
    // Hierarchy level 4: Billing Edit by BE Type
    else if (subtypeValue === QUERY_BY_BE_TYPE_BE && billingEditHierarchyLevel === 3 && selectedEntityBarBE && selectedEntityBarBE.EntityName && selectedInsBarBE && selectedVisitTypeBarBE) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarBE.EntityName)}`);
      args.push(`Ins=${encodeURIComponent(selectedInsBarBE)}`);
      args.push(`VisitType=${encodeURIComponent(selectedVisitTypeBarBE)}`);
    }
  } else if (dashboardType === "AR Days") {
    // Hierarchy level 0: AR Days By Entity
    if (subtypeValue === "AR Days By Entity 01" && arDaysHierarchyLevel === 0 && selectedEntityBarAR) {
      // Removed AccountingYearPeriod
    }
    // Hierarchy level 1: AR Days by Financial Class
    else if (subtypeValue === "AR Days By Financial Class 01" && arDaysHierarchyLevel === 1 && selectedEntityBarAR && selectedEntityBarAR.EntityName) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarAR.EntityName)}`);
    }
    // Hierarchy level 2: AR Days by Account Group
    else if (subtypeValue === "AR Days By Account Group 01" && arDaysHierarchyLevel === 2 && selectedEntityBarAR && selectedEntityBarAR.EntityName && selectedFinancialClassBarAR) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarAR.EntityName)}`);
      args.push(`FinancialClass=${encodeURIComponent(selectedFinancialClassBarAR)}`);
    }
    // Hierarchy level 3: AR Days by Primary Insurance
    else if (subtypeValue === "AR Days By Primary Ins 01" && arDaysHierarchyLevel === 3 && selectedEntityBarAR && selectedEntityBarAR.EntityName && selectedFinancialClassBarAR && selectedAccountGroupBarAR) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarAR.EntityName)}`);
      args.push(`FinancialClass=${encodeURIComponent(selectedFinancialClassBarAR)}`);
      args.push(`AccountGroup=${encodeURIComponent(selectedAccountGroupBarAR)}`);
    }
  } else if (dashboardType === "Aged AR Days") {
    // Hierarchy level 0: Aged AR By Entity
    if (subtypeValue === "Aged AR By Entity 01" && agedArDaysHierarchyLevel === 0 && selectedEntityBarAgedAR) {
      // Removed AccountingYearPeriod
    }
    // Hierarchy level 1: Aged AR By Financial Class
    else if (subtypeValue === "Aged AR By Financial Class 01" && agedArDaysHierarchyLevel === 1 && selectedEntityBarAgedAR && selectedEntityBarAgedAR.EntityName) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarAgedAR.EntityName)}`);
    }
    // Hierarchy level 2: Aged AR By Account Group
    else if (subtypeValue === "Aged AR By Account Group 01" && agedArDaysHierarchyLevel === 2 && selectedEntityBarAgedAR && selectedEntityBarAgedAR.EntityName && selectedFinancialClassBarAgedAR) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarAgedAR.EntityName)}`);
      args.push(`FinancialClass=${encodeURIComponent(selectedFinancialClassBarAgedAR)}`);
    }
    // Hierarchy level 3: Aged AR By Service Area
    else if (subtypeValue === "Aged AR By Service Area 01" && agedArDaysHierarchyLevel === 3 && selectedEntityBarAgedAR && selectedEntityBarAgedAR.EntityName && selectedFinancialClassBarAgedAR && selectedAccountGroupBarAgedAR) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarAgedAR.EntityName)}`);
      args.push(`FinancialClass=${encodeURIComponent(selectedFinancialClassBarAgedAR)}`);
      args.push(`AccountGroup=${encodeURIComponent(selectedAccountGroupBarAgedAR)}`);
    }
  } else if (dashboardType === "Days Discharged") {
    // Hierarchy level 0: Days Dis By Entity
    if (subtypeValue === "Days Dis By Entity 01" && daysDischargedHierarchyLevel === 0 && selectedEntityBarDD) {
      // Removed AccountingYearPeriod
    }
    // Hierarchy level 1: Days Dis By Fin Class
    else if (subtypeValue === "Days Dis By Fin Class 01" && daysDischargedHierarchyLevel === 1 && selectedEntityBarDD && selectedEntityBarDD.EntityName) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarDD.EntityName)}`);
    }
    // Hierarchy level 2: Days Dis By Visit Type
    else if (subtypeValue === "Days Dis By Visit Type 01" && daysDischargedHierarchyLevel === 2 && selectedEntityBarDD && selectedEntityBarDD.EntityName && selectedFinancialClassBarDD) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarDD.EntityName)}`);
      args.push(`FinancialClass=${encodeURIComponent(selectedFinancialClassBarDD)}`);
    }
    // Hierarchy level 3: Days Dis By Service Area
    else if (subtypeValue === "Days Dis By Service Area 01" && daysDischargedHierarchyLevel === 3 && selectedEntityBarDD && selectedEntityBarDD.EntityName && selectedFinancialClassBarDD && selectedVisitTypeBarDD) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarDD.EntityName)}`);
      args.push(`FinancialClass=${encodeURIComponent(selectedFinancialClassBarDD)}`);
      args.push(`VisitType=${encodeURIComponent(selectedVisitTypeBarDD)}`);
    }
  } else if (dashboardType === "Bad Debt") {
    // Hierarchy level 0: Bad Debt By Entity
    if (subtypeValue === "Bad Debt By Entity 01" && badDebtHierarchyLevel === 0 && selectedEntityBarBD) {
      // Removed AccountingYearPeriod
    }
    // Hierarchy level 1: Bad Debt By Fin Class
    else if (subtypeValue === "Bad Debt By Fin Class 01" && badDebtHierarchyLevel === 1 && selectedEntityBarBD && selectedEntityBarBD.EntityName) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarBD.EntityName)}`);
    }
    // Hierarchy level 2: Bad Debt By Visit Type
    else if (subtypeValue === "Bad Debt By Visit Type 01" && badDebtHierarchyLevel === 2 && selectedEntityBarBD && selectedEntityBarBD.EntityName && selectedFinancialClassBarBD) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarBD.EntityName)}`);
      args.push(`FinancialClass=${encodeURIComponent(selectedFinancialClassBarBD)}`);
    }
    // Hierarchy level 3: Bad Debt By Service Area
    else if (subtypeValue === "Bad Debt By Service Area 01" && badDebtHierarchyLevel === 3 && selectedEntityBarBD && selectedEntityBarBD.EntityName && selectedFinancialClassBarBD && selectedVisitTypeBarBD) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarBD.EntityName)}`);
      args.push(`FinancialClass=${encodeURIComponent(selectedFinancialClassBarBD)}`);
      args.push(`VisitType=${encodeURIComponent(selectedVisitTypeBarBD)}`);
    }
  } else if (dashboardType === "POS Cash") {
    // Always include selected entity if available
    if (selectedEntityBarPC && selectedEntityBarPC.EntityName) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarPC.EntityName)}`);
    }

    // Add parameters based on hierarchy level and selected values
    if (posCashHierarchyLevel >= 2 && selectedVisitTypeBarPC && selectedVisitTypeBarPC.VisitType) {
      args.push(`VisitType=${encodeURIComponent(selectedVisitTypeBarPC.VisitType)}`);
    }

    if (posCashHierarchyLevel >= 3 && selectedServiceAreaBarPC && selectedServiceAreaBarPC.ServiceArea) {
      args.push(`ServiceArea=${encodeURIComponent(selectedServiceAreaBarPC.ServiceArea)}`);
    }
  } else if (dashboardType === "Cash Collected") {
    console.log("Cash Collected Dashboard State 483:", {
      selectedEntityBarCC,
      selectedEntity,
      cashCollectedHierarchyLevel,
      selectedAccGrpBarCC,
      subtype: subtypeValue
    });

    // Include selected entity for all hierarchy levels
    if (selectedEntityBarCC && selectedEntityBarCC.EntityName) {
      console.log("Using selectedEntityBarCC:", selectedEntityBarCC.EntityName);
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarCC.EntityName)}`);
    } else if (selectedEntity) {
      console.log("Using selectedEntity from dropdown:", selectedEntity);
      // If no entity bar selection, use the dropdown selection
      args.push(`EntityName=${encodeURIComponent(selectedEntity)}`);
    }

    // Add parameters based on hierarchy level and selected values
    if (cashCollectedHierarchyLevel >= 2 && selectedAccGrpBarCC) {
      console.log("Adding AccountGroup parameter:", selectedAccGrpBarCC);
      // Extract the actual account group value from the object
      const accountGroupValue = typeof selectedAccGrpBarCC === 'object' && selectedAccGrpBarCC !== null
        ? (selectedAccGrpBarCC.AccGrp || selectedAccGrpBarCC.AccountGroup || selectedAccGrpBarCC["Account Group"] || selectedAccGrpBarCC.toString())
        : selectedAccGrpBarCC;
        
      console.log("Extracted AccountGroup value:", accountGroupValue);
      args.push(`AccountGroup=${encodeURIComponent(accountGroupValue)}`);
    }

    if (cashCollectedHierarchyLevel >= 3 && selectedPCBarCC && selectedPCBarCC.PaymentCode) {
      args.push(`PaymentCode=${encodeURIComponent(selectedPCBarCC.PaymentCode)}`);
    }
  } else if (dashboardType === "Charity Care") {
    // Always include selected entity if available
    if (selectedEntityBarCCare && selectedEntityBarCCare.EntityName) {
      args.push(`EntityName=${encodeURIComponent(selectedEntityBarCCare.EntityName)}`);
    }

    // Add parameters based on hierarchy level and selected values
    if (charityCareHierarchyLevel >= 2 && selectedVisitTypeBarCCare && selectedVisitTypeBarCCare.VisitType) {
      args.push(`VisitType=${encodeURIComponent(selectedVisitTypeBarCCare.VisitType)}`);
    }

    if (charityCareHierarchyLevel >= 3 && selectedServiceAreaBarCCare) {
      if (selectedServiceAreaBarCCare.AdjustmentCode) {
        args.push(`AdjustmentCode=${encodeURIComponent(selectedServiceAreaBarCCare.AdjustmentCode)}`);
      }
      if (selectedServiceAreaBarCCare.ServiceArea) {
        args.push(`ServiceArea=${encodeURIComponent(selectedServiceAreaBarCCare.ServiceArea)}`);
      }
    }
  }

  // Build query string
  const queryString = args.length ? `?${args.join("&")}` : "";
  const delimiter = "__";
  const url = `${API_CONFIG.SERVER_URL}${API_CONFIG.API_BASE_PATH}/${namespace}/${encodeURIComponent(dashboardType)}/${encodeURIComponent(subtypeValue)}${delimiter}${queryString}`;
  console.log("Fetching for subtype:", subtypeValue);
  console.log("Request URL:", url);
  console.log("Request parameters:", {
    namespace,
    dashboardType,
    subtypeValue,
    args,
    queryString
  });

  const MAX_RETRIES = 3;
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched chart data for", subtypeValue, ":", data.length, "records");
      console.log("Raw data response:", data);
      console.log("Data structure sample:", data.length > 0 ? data[0] : "No data");
      console.log("Available fields:", data.length > 0 ? Object.keys(data[0]) : "No fields");

      // Use Day or AccountingYearPeriod for Month-Year X-axis
      const formattedData = data.map((item) => ({
        ...item,
        MonthYear: formatMonthYear(item.Day || item.AccountingYearPeriod),
        dateValue: item.Day || item.AccountingYearPeriod
      }));

      return { subtype: subtypeValue, data: formattedData };
    } catch (err) {
      console.error(`Error fetching chart data for ${subtypeValue} on attempt ${attempt + 1}:`, err);
      attempt++;
      if (attempt >= MAX_RETRIES) {
        return { subtype: subtypeValue, data: [] };
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export async function fetchAllSubtypeData({
  namespace,
  dashboardType,
  selectedSubtypes,
  denialHierarchyLevel,
  selectedEntityBar,
  selectedInsuranceBar,
  selectedVisitTypeBar,
  billingEditHierarchyLevel,
  selectedEntityBarBE,
  selectedInsBarBE,
  selectedVisitTypeBarBE,
  arDaysHierarchyLevel,
  selectedEntityBarAR,
  selectedFinancialClassBarAR,
  selectedAccountGroupBarAR,
  agedArDaysHierarchyLevel,
  selectedEntityBarAgedAR,
  selectedFinancialClassBarAgedAR,
  selectedAccountGroupBarAgedAR,
  selectedServiceAreaBarAgedAR,
  daysDischargedHierarchyLevel,
  selectedEntityBarDD,
  selectedFinancialClassBarDD,
  selectedVisitTypeBarDD,
  selectedServiceAreaBarDD,
  badDebtHierarchyLevel,
  selectedEntityBarBD,
  selectedFinancialClassBarBD,
  selectedVisitTypeBarBD,
  selectedServiceAreaBarBD,
  posCashHierarchyLevel,
  selectedEntityBarPC,
  selectedFinancialClassBarPC,
  selectedVisitTypeBarPC,
  selectedServiceAreaBarPC,
  selectedPaymentCodeBarPC,
  cashCollectedHierarchyLevel,
  selectedEntityBarCC,
  selectedAccGrpBarCC,
  selectedPCBarCC,
  charityCareHierarchyLevel,
  selectedEntityBarCCare,
  selectedVisitTypeBarCCare,
  selectedServiceAreaBarCCare,
  selectedAccGrpBarCCare,
  selectedPCBarCCare,
  activeFetches,
  setIsLoading,
  setSubtypeDataMap,
  setChartData,
  setEntityOptions,
  setSelectedEntity,
  setMetricOptions,
  setMetric,
  dashboardType: currentDashboardType,
  subtype: currentSubtype,
  selectedEntity,
  fromDate,
  toDate
}) {
  activeFetches.current++;
  if (activeFetches.current === 1) {
    setIsLoading(true);
  }
  try {
    const params = {
      namespace,
      dashboardType,
      denialHierarchyLevel,
      selectedEntityBar,
      selectedInsuranceBar,
      selectedVisitTypeBar,
      billingEditHierarchyLevel,
      selectedEntityBarBE,
      selectedInsBarBE,
      selectedVisitTypeBarBE,
      arDaysHierarchyLevel,
      selectedEntityBarAR,
      selectedFinancialClassBarAR,
      selectedAccountGroupBarAR,
      agedArDaysHierarchyLevel,
      selectedEntityBarAgedAR,
      selectedFinancialClassBarAgedAR,
      selectedAccountGroupBarAgedAR,
      selectedServiceAreaBarAgedAR,
      daysDischargedHierarchyLevel,
      selectedEntityBarDD,
      selectedFinancialClassBarDD,
      selectedVisitTypeBarDD,
      selectedServiceAreaBarDD,
      badDebtHierarchyLevel,
      selectedEntityBarBD,
      selectedFinancialClassBarBD,
      selectedVisitTypeBarBD,
      selectedServiceAreaBarBD,
      posCashHierarchyLevel,
      selectedEntityBarPC,
      selectedFinancialClassBarPC,
      selectedVisitTypeBarPC,
      selectedServiceAreaBarPC,
      selectedPaymentCodeBarPC,
      cashCollectedHierarchyLevel,
      selectedEntityBarCC,
      selectedAccGrpBarCC,
      selectedPCBarCC,
      charityCareHierarchyLevel,
      selectedEntityBarCCare,
      selectedVisitTypeBarCCare,
      selectedServiceAreaBarCCare,
      selectedAccGrpBarCCare,
      selectedPCBarCCare,
      selectedEntity,
      fromDate,
      toDate
    };

    const dataPromises = selectedSubtypes.map(subtypeValue => fetchDataForSubtype({ ...params, subtypeValue }));
    const results = await Promise.all(dataPromises);

    // Create a map of subtype -> data
    const newSubtypeDataMap = {};
    results.forEach(result => {
      newSubtypeDataMap[result.subtype] = result.data;
    });

    setSubtypeDataMap(newSubtypeDataMap);
    // Set main chart data to the first selected subtype (for backward compatibility)
    if (results.length > 0 && results[0].data.length > 0) {
      const mainData = results[0].data;
      setChartData(mainData);
      // Keep date range fixed to user selected values
      // Get unique entity names - filter out any date values
      const entities = Array.from(new Set(mainData.map(d => d.EntityName)))
        .filter(entity => entity && typeof entity === 'string' && !entity.match(/^\d{4}-\d{2}-\d{2}/) && !entity.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/));
      setEntityOptions(entities);
      setSelectedEntity(prev => (entities.includes(prev) ? prev : (entities[0] || "")));
      // Get metric keys (D1-D8) from first non-empty row
      const firstRow = mainData.find(row => row && row.EntityName);
      console.log("First row keys:", firstRow ? Object.keys(firstRow) : "No first row");
      if (currentDashboardType === "Transactions" && currentSubtype === "Transactions By Month 01") {
        console.log("Formatted data sample:", mainData.slice(0, 3));
      }
      if (firstRow) {
        const excluded = ["EntityName", "Day", "AccountingYearPeriod", "MonthYear", "dateValue", "CarrierName", "VisitType", "DenialCode", "InsuranceName", "Ins", "BillingEditType", "FinancialClass", "PrimaryInsurance", "AccountGroup", "Primary Insurance", "Account Group", "Financial Class", "ServiceArea","PaymentCode","Acc Grp","PC","VisitType","AdjustmentCode"];
        let metrics;

        // For Aged AR Days, always include all four metrics
        if (currentDashboardType === "Aged AR Days") {
          metrics = ["30 Days", "60 Days", "90 Days", "120 Days"];
        } else {
          // For other dashboards, use metrics from data
          metrics = Object.keys(firstRow).filter(k => !excluded.includes(k));
        }

        console.log("Metrics keys:", metrics);
        setMetricOptions(metrics);
        setMetric(metrics[0] || "");
      }
    }
    return newSubtypeDataMap;
  } catch (error) {
    console.error("Error in fetchAllSubtypeData:", error);
    return {};
  } finally {
    activeFetches.current--;
    if (activeFetches.current === 0) {
      setIsLoading(false);
    }
  }
}

// Chart click handler for hierarchy: advances hierarchy and triggers API call
export function handleBarClick(data, dashboardType, subtype, selectedEntity,
  // Denials dashboard
  selectedEntityBar, setSelectedEntityBar, setSelectedEntity, denialHierarchyLevel, setDenialHierarchyLevel,
  selectedInsuranceBar, setSelectedInsuranceBar, selectedVisitTypeBar, setSelectedVisitTypeBar,
  setSubtype, setSelectedSubtypes,
  // Billing Edit dashboard
  selectedEntityBarBE, setSelectedEntityBarBE, billingEditHierarchyLevel, setBillingEditHierarchyLevel,
  selectedInsBarBE, setSelectedInsBarBE, selectedVisitTypeBarBE, setSelectedVisitTypeBarBE,
  // Cash Collected dashboard
  selectedEntityBarCC, setSelectedEntityBarCC, cashCollectedHierarchyLevel, setCashCollectedHierarchyLevel,
  selectedAccGrpBarCC, setSelectedAccGrpBarCC, setSelectedPCBarCC,
  // AR Days dashboard
  selectedEntityBarAR, setSelectedEntityBarAR, arDaysHierarchyLevel, setArDaysHierarchyLevel,
  selectedFinancialClassBarAR, setSelectedFinancialClassBarAR, selectedAccountGroupBarAR, setSelectedAccountGroupBarAR,
  // Aged AR Days dashboard
  selectedEntityBarAgedAR, setSelectedEntityBarAgedAR, agedArDaysHierarchyLevel, setAgedArDaysHierarchyLevel,
  selectedFinancialClassBarAgedAR, setSelectedFinancialClassBarAgedAR, selectedAccountGroupBarAgedAR, setSelectedAccountGroupBarAgedAR,
  // Days Discharged dashboard
  selectedEntityBarDD, setSelectedEntityBarDD, daysDischargedHierarchyLevel, setDaysDischargedHierarchyLevel,
  selectedFinancialClassBarDD, setSelectedFinancialClassBarDD, selectedVisitTypeBarDD, setSelectedVisitTypeBarDD,
  // Bad Debt dashboard
  selectedEntityBarBD, setSelectedEntityBarBD, badDebtHierarchyLevel, setBadDebtHierarchyLevel,
  selectedFinancialClassBarBD, setSelectedFinancialClassBarBD, selectedVisitTypeBarBD, setSelectedVisitTypeBarBD,
  // POS Cash dashboard
  selectedEntityBarPC, setSelectedEntityBarPC, posCashHierarchyLevel, setPosCashHierarchyLevel,
  selectedVisitTypeBarPC, setSelectedVisitTypeBarPC, selectedServiceAreaBarPC, setSelectedServiceAreaBarPC,
  selectedPaymentCodeBarPC, setSelectedPaymentCodeBarPC, setChartData,
  // Charity Care dashboard
  selectedEntityBarCCare, setSelectedEntityBarCCare, charityCareHierarchyLevel, setCharityCareHierarchyLevel,
  selectedVisitTypeBarCCare, setSelectedVisitTypeBarCCare, selectedServiceAreaBarCCare, setSelectedServiceAreaBarCCare
) {
  const isDenialsDashboard = dashboardType === "Denials";
  const isBillingEditDashboard = dashboardType === "Billing Edit";
  const isArDaysDashboard = dashboardType === "AR Days";
  const isAgedArDaysDashboard = dashboardType === "Aged AR Days";
  const isDaysDischargedDashboard = dashboardType === "Days Discharged";
  const isBadDebtDashboard = dashboardType === "Bad Debt";
  const isPosCashDashboard = dashboardType === "POS Cash";
  const isCashCollectedDashboard = dashboardType === "Cash Collected";
  const isCharityCareDashboard = dashboardType === "Charity Care";

  if (!isDenialsDashboard && !isBillingEditDashboard && !isArDaysDashboard && !isAgedArDaysDashboard 
      && !isDaysDischargedDashboard && !isBadDebtDashboard && !isPosCashDashboard && !isCashCollectedDashboard 
      && !isCharityCareDashboard) return;

  if (isDenialsDashboard) {
    if (subtype === QUERY_BY_ENTITY_01 && data.EntityName) {
      setSelectedEntityBar(data);
      setSelectedEntity(data.EntityName); // Auto-select entity in dropdown
      setDenialHierarchyLevel(1);
      const nextSubtype = QUERY_BY_INSURANCE_01;
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === QUERY_BY_INSURANCE_01 && (data.CarrierName || data.InsuranceName)) {
      setSelectedInsuranceBar(data.CarrierName || data.InsuranceName);
      setDenialHierarchyLevel(2);
      const nextSubtype = QUERY_BY_VISIT_TYPE_01;
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === QUERY_BY_VISIT_TYPE_01 && data.VisitType) {
      setSelectedVisitTypeBar(data.VisitType);
      setDenialHierarchyLevel(3);
      const nextSubtype = QUERY_BY_DENIAL_CODE_01;
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    }
  } else if (isBillingEditDashboard) {
    if (subtype === QUERY_BY_ENTITY_BE && data.EntityName) {
      setSelectedEntityBarBE(data);
      setSelectedEntity(data.EntityName); // Auto-select entity in dropdown
      setBillingEditHierarchyLevel(1);
      const nextSubtype = QUERY_BY_INS_BE;
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === QUERY_BY_INS_BE && (data.CarrierName || data.InsuranceName || data.Ins)) {
      setSelectedInsBarBE(data.CarrierName || data.InsuranceName || data.Ins);
      setBillingEditHierarchyLevel(2);
      const nextSubtype = QUERY_BY_VISIT_TYPE_BE;
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === QUERY_BY_VISIT_TYPE_BE && data.VisitType) {
      setSelectedVisitTypeBarBE(data.VisitType);
      setBillingEditHierarchyLevel(3);
      const nextSubtype = QUERY_BY_BE_TYPE_BE;
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    }
  } else if (isCashCollectedDashboard) {
    if (subtype === "Cash Collected By Entity 01" && data.EntityName) {
      setSelectedEntityBarCC(data);
      setSelectedEntity(data.EntityName); // Auto-select entity in dropdown
      setCashCollectedHierarchyLevel(1);
      const nextSubtype = "Cash Collected By Acc Grp 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "Cash Collected By Acc Grp 01" && (data.AccountGroup || data.AccGrp) && selectedEntityBarCC) {
      const accountGroup = data.AccountGroup || data.AccGrp;
      const accountGroupData = {
        AccountGroup: accountGroup,
        AccGrp: accountGroup,
        EntityName: selectedEntityBarCC.EntityName
      };
      setSelectedAccGrpBarCC(accountGroupData);
      setCashCollectedHierarchyLevel(2);
      const nextSubtype = "Cash Collected By PC 01";
      setSubtype(nextSubtype);
      // Pass both EntityName and AccountGroup parameters for the next level
      const updatedData = {
        ...data,
        EntityName: selectedEntityBarCC.EntityName,
        AccountGroup: data.AccountGroup,
        PaymentCode: data.PaymentCode
      };
      setSelectedSubtypes([nextSubtype]);
      // Update data with required parameters
      setChartData(prevData => prevData.map(item => ({
        ...item,
        EntityName: selectedEntityBarCC.EntityName,
        AccountGroup: data.AccountGroup,
        PaymentCode: item.PaymentCode
      })));
    } else if (subtype === "Cash Collected By PC 01" && data.PaymentCode) {
      const paymentCodeData = {
        PaymentCode: data.PaymentCode,  // Use the actual payment code from the data
        EntityName: selectedEntityBarCC.EntityName,
        AccountGroup: selectedAccGrpBarCC.AccountGroup
      };
      setSelectedPCBarCC(paymentCodeData);
      setCashCollectedHierarchyLevel(3);
      const nextSubtype = "Cash Collected By PC 01";
      setSubtype(nextSubtype);
      // Update data for the next level with correct payment code
      setChartData(prevData => prevData.map(item => ({
        ...item,
        EntityName: selectedEntityBarCC.EntityName,
        AccountGroup: selectedAccGrpBarCC.AccountGroup,
        PaymentCode: data.PaymentCode  // Make sure we pass the correct payment code forward
      })));
      setSelectedSubtypes([nextSubtype]);
    }
  } else if (isArDaysDashboard) {
    if (subtype === "AR Days By Entity 01" && data.EntityName) {
      setSelectedEntityBarAR(data);
      setSelectedEntity(data.EntityName); // Auto-select entity in dropdown
      setArDaysHierarchyLevel(1);
      const nextSubtype = "AR Days By Financial Class 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "AR Days By Financial Class 01" && data.FinancialClass) {
      setSelectedFinancialClassBarAR(data.FinancialClass);
      setArDaysHierarchyLevel(2);
      const nextSubtype = "AR Days By Account Group 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "AR Days By Account Group 01" && data["Account Group"]) {
      setSelectedAccountGroupBarAR(data["Account Group"]);
      setArDaysHierarchyLevel(3);
      const nextSubtype = "AR Days By Primary Ins 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    }
  } else if (isAgedArDaysDashboard) {
    if (subtype === "Aged AR By Entity 01" && data.EntityName) {
      setSelectedEntityBarAgedAR(data);
      setSelectedEntity(data.EntityName); // Auto-select entity in dropdown
      setAgedArDaysHierarchyLevel(1);
      const nextSubtype = "Aged AR By Financial Class 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "Aged AR By Financial Class 01" && data.FinancialClass) {
      setSelectedFinancialClassBarAgedAR(data.FinancialClass);
      setAgedArDaysHierarchyLevel(2);
      const nextSubtype = "Aged AR By Account Group 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "Aged AR By Account Group 01" && data["Account Group"]) {
      setSelectedAccountGroupBarAgedAR(data["Account Group"]);
      setAgedArDaysHierarchyLevel(3);
      const nextSubtype = "Aged AR By Service Area 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    }
  } else if (isDaysDischargedDashboard) {
    if (subtype === "Days Dis By Entity 01" && data.EntityName) {
      setSelectedEntityBarDD(data);
      setSelectedEntity(data.EntityName); // Auto-select entity in dropdown
      setDaysDischargedHierarchyLevel(1);
      const nextSubtype = "Days Dis By Fin Class 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "Days Dis By Fin Class 01" && data.FinancialClass) {
      setSelectedFinancialClassBarDD(data.FinancialClass);
      setDaysDischargedHierarchyLevel(2);
      const nextSubtype = "Days Dis By Visit Type 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "Days Dis By Visit Type 01" && data.VisitType) {
      setSelectedVisitTypeBarDD(data.VisitType);
      setDaysDischargedHierarchyLevel(3);
      const nextSubtype = "Days Dis By Service Area 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    }
  } else if (isBadDebtDashboard) {
    if (subtype === "Bad Debt By Entity 01" && data.EntityName) {
      setSelectedEntityBarBD(data);
      setSelectedEntity(data.EntityName); // Auto-select entity in dropdown
      setBadDebtHierarchyLevel(1);
      const nextSubtype = "Bad Debt By Fin Class 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "Bad Debt By Fin Class 01" && data.FinancialClass) {
      setSelectedFinancialClassBarBD(data.FinancialClass);
      setBadDebtHierarchyLevel(2);
      const nextSubtype = "Bad Debt By Visit Type 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "Bad Debt By Visit Type 01" && data.VisitType) {
      setSelectedVisitTypeBarBD(data.VisitType);
      setBadDebtHierarchyLevel(3);
      const nextSubtype = "Bad Debt By Service Area 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    }
  } else if (isPosCashDashboard) {
    if (subtype === "POS Cash By Entity 01" && data.EntityName) {
      setSelectedEntityBarPC(data);
      setSelectedEntity(data.EntityName); // Auto-select entity in dropdown
      setPosCashHierarchyLevel(1);
      const nextSubtype = "POS Cash By Visit Type 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "POS Cash By Visit Type 01" && data.VisitType && selectedEntityBarPC) {
      const visitTypeData = {
        VisitType: data.VisitType,
        EntityName: selectedEntityBarPC.EntityName
      };
      setSelectedVisitTypeBarPC(visitTypeData);
      setPosCashHierarchyLevel(2);
      const nextSubtype = "POS Cash By Service Area 01";
      setSubtype(nextSubtype);
      // Pass both EntityName and VisitType parameters for Service Area level
      const updatedData = {
        ...data,
        EntityName: selectedEntityBarPC.EntityName,
        VisitType: data.VisitType,
        ServiceArea: data.ServiceArea
      };
      setSelectedSubtypes([nextSubtype]);
      // Update data with required parameters
      setChartData(prevData => prevData.map(item => ({
        ...item,
        EntityName: selectedEntityBarPC.EntityName,
        VisitType: data.VisitType,
        ServiceArea: item.ServiceArea
      })));
    } else if (subtype === "POS Cash By Service Area 01" && data.ServiceArea) {
      const serviceAreaData = {
        ServiceArea: data.ServiceArea,  // Use the actual service area from the data
        EntityName: selectedEntityBarPC.EntityName,
        VisitType: selectedVisitTypeBarPC.VisitType
      };
      setSelectedServiceAreaBarPC(serviceAreaData);
      setPosCashHierarchyLevel(3);
      const nextSubtype = "POS Cash By Payment Code 01";
      setSubtype(nextSubtype);
      // Update data for the next level with correct service area
      setChartData(prevData => prevData.map(item => ({
        ...item,
        EntityName: selectedEntityBarPC.EntityName,
        VisitType: selectedVisitTypeBarPC.VisitType,
        ServiceArea: data.ServiceArea  // Make sure we pass the correct service area forward
      })));
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "POS Cash By Payment Code 01" && data.PaymentCode) {
      const paymentCodeData = {
        PaymentCode: data.PaymentCode,  // Use the actual payment code from the data
        EntityName: selectedEntityBarPC.EntityName,
        ServiceArea: selectedServiceAreaBarPC.ServiceArea,
        VisitType: selectedVisitTypeBarPC.VisitType
      };
      setSelectedPaymentCodeBarPC(paymentCodeData);
      setPosCashHierarchyLevel(3);
      const nextSubtype = "POS Cash By Payment Code 01";
      setSubtype(nextSubtype);
      // Update data for the next level with correct service area
      setChartData(prevData => prevData.map(item => ({
        ...item,
        EntityName: selectedEntityBarPC.EntityName,
        VisitType: selectedVisitTypeBarPC.VisitType,
        ServiceArea: selectedServiceAreaBarPC.ServiceArea,
        PaymentCode: data.PaymentCode  // Make sure we pass the correct payment code forward
      })));
      setSelectedSubtypes([nextSubtype]);
    }
  } else if (isCharityCareDashboard) {
    if (subtype === "Charity Care By Entity 01" && data.EntityName) {
      setSelectedEntityBarCCare(data);
      setSelectedEntity(data.EntityName); // Auto-select entity in dropdown
      setCharityCareHierarchyLevel(1);
      const nextSubtype = "Charity Care By Visit Type 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
    } else if (subtype === "Charity Care By Visit Type 01" && data.VisitType && selectedEntityBarCCare) {
      const visitTypeData = {
        VisitType: data.VisitType,
        EntityName: selectedEntityBarCCare.EntityName
      };
      setSelectedVisitTypeBarCCare(visitTypeData);
      setCharityCareHierarchyLevel(2);
      const nextSubtype = "Charity Care By AC 01";
      setSubtype(nextSubtype);
      // Pass both EntityName and VisitType parameters for Adjustment Code level
      const updatedData = {
        ...data,
        EntityName: selectedEntityBarCCare.EntityName,
        VisitType: data.VisitType,
        AdjustmentCode: data.AdjustmentCode
      };
      setSelectedSubtypes([nextSubtype]);
      // Update data with required parameters
      setChartData(prevData => prevData.map(item => ({
        ...item,
        EntityName: selectedEntityBarCCare.EntityName,
        VisitType: data.VisitType,
        AdjustmentCode: item.AdjustmentCode
      })));
    } else if (subtype === "Charity Care By AC 01" && data.AdjustmentCode && selectedEntityBarCCare && selectedVisitTypeBarCCare) {
      const adjustmentCodeData = {
        AdjustmentCode: data.AdjustmentCode,
        VisitType: selectedVisitTypeBarCCare.VisitType,
        EntityName: selectedEntityBarCCare.EntityName
      };
      setSelectedServiceAreaBarCCare(adjustmentCodeData);
      setCharityCareHierarchyLevel(3);
      const nextSubtype = "Charity Care By Serv Area 01";
      setSubtype(nextSubtype);
      setSelectedSubtypes([nextSubtype]);
      // Update data with required parameters
      setChartData(prevData => prevData.map(item => ({
        ...item,
        EntityName: selectedEntityBarCCare.EntityName,
        VisitType: selectedVisitTypeBarCCare.VisitType,
        AdjustmentCode: data.AdjustmentCode,
        ServiceArea: item.ServiceArea
      })));
    }
  }
}
