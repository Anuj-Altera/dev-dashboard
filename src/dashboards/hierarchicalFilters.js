/**
 * Hierarchical filtering functions for IRIS dashboards
 * Contains logic for filtering and grouping data based on dashboard type and subtype
 */

/**
 * Filters and groups data hierarchically based on dashboard type, subtype, and selected filters
 * 
 * @param {Array} filteredData - Initial filtered dataset
 * @param {boolean} isHierarchicalSubtype - Whether the current subtype is hierarchical
 * @param {boolean} isDenialsDashboard - Whether the current dashboard is Denials dashboard
 * @param {boolean} isBadDebtDashboard - Whether the current dashboard is Bad Debt dashboard
 * @param {boolean} isBillingEditDashboard - Whether the current dashboard is Billing Edit dashboard
 * @param {boolean} isArDaysDashboard - Whether the current dashboard is AR Days dashboard
 * @param {boolean} isAgedArDaysDashboard - Whether the current dashboard is Aged AR dashboard
 * @param {boolean} isDaysDischargedDashboard - Whether the current dashboard is Days Discharged dashboard
 * @param {boolean} isPosCashDashboard - Whether the current dashboard is POS Cash dashboard
 * @param {boolean} isCashCollectedDashboard - Whether the current dashboard is Cash Collected dashboard
 * @param {boolean} isCharityCareDashboard - Whether the current dashboard is Charity Care dashboard
 * @param {string} subtype - Current dashboard subtype
 * @param {string} selectedEntity - Selected entity
 * @param {object} selectedEntityBar - Selected entity from bar chart (Denials)
 * @param {string} selectedInsuranceBar - Selected insurance from bar chart (Denials)
 * @param {string} selectedVisitTypeBar - Selected visit type from bar chart (Denials)
 * @param {object} selectedEntityBarBD - Selected entity from bar chart (Bad Debt)
 * @param {string} selectedFinancialClassBarBD - Selected financial class from bar chart (Bad Debt)
 * @param {string} selectedVisitTypeBarBD - Selected visit type from bar chart (Bad Debt)
 * @param {object} selectedEntityBarBE - Selected entity from bar chart (Billing Edit)
 * @param {string} selectedInsBarBE - Selected insurance from bar chart (Billing Edit)
 * @param {string} selectedVisitTypeBarBE - Selected visit type from bar chart (Billing Edit)
 * @param {object} selectedEntityBarAR - Selected entity from bar chart (AR Days)
 * @param {object} selectedEntityBarAgedAR - Selected entity from bar chart (Aged AR)
 * @param {object} selectedEntityBarDD - Selected entity from bar chart (Days Discharged)
 * @param {object} selectedEntityBarCCare - Selected entity from bar chart (Charity Care)
 * @param {number} charityCareHierarchyLevel - Current hierarchy level for Charity Care dashboard
 * @param {object} selectedVisitTypeBarCCare - Selected visit type from bar chart (Charity Care)
 * @param {object} selectedServiceAreaBarCCare - Selected service area from bar chart (Charity Care)
 * @param {Array} metricOptions - Available metrics for aggregation
 * @param {string} QUERY_BY_ENTITY_01 - Constant for entity query type
 * @param {string} QUERY_BY_INSURANCE_01 - Constant for insurance query type
 * @param {string} QUERY_BY_VISIT_TYPE_01 - Constant for visit type query type
 * @param {string} QUERY_BY_DENIAL_CODE_01 - Constant for denial code query type
 * @param {string} QUERY_BY_ENTITY_BE - Constant for entity query type (Billing Edit)
 * @param {string} QUERY_BY_INS_BE - Constant for insurance query type (Billing Edit)
 * @param {string} QUERY_BY_VISIT_TYPE_BE - Constant for visit type query type (Billing Edit)
 * @param {string} QUERY_BY_BE_TYPE_BE - Constant for billing edit type query type
 * @returns {Array} Filtered and grouped data
 */
export const getHierarchicalFilteredData = ({
  filteredData,
  isHierarchicalSubtype,
  isDenialsDashboard,
  isBadDebtDashboard,
  isBillingEditDashboard,
  isArDaysDashboard,
  isAgedArDaysDashboard,
  isDaysDischargedDashboard,
  isPosCashDashboard,
  isCashCollectedDashboard,
  isCharityCareDashboard,
  subtype,
  selectedEntity,
  selectedEntityBar,
  selectedInsuranceBar,
  selectedVisitTypeBar,
  selectedEntityBarBD,
  selectedFinancialClassBarBD,
  selectedVisitTypeBarBD,
  selectedEntityBarBE,
  selectedInsBarBE,
  selectedVisitTypeBarBE,
  selectedEntityBarAR,
  selectedEntityBarAgedAR,
  selectedEntityBarDD,
  selectedEntityBarCCare,
  charityCareHierarchyLevel,
  selectedVisitTypeBarCCare,
  selectedServiceAreaBarCCare,
  metricOptions,
  QUERY_BY_ENTITY_01,
  QUERY_BY_INSURANCE_01,
  QUERY_BY_VISIT_TYPE_01,
  QUERY_BY_DENIAL_CODE_01,
  QUERY_BY_ENTITY_BE,
  QUERY_BY_INS_BE,
  QUERY_BY_VISIT_TYPE_BE,
  QUERY_BY_BE_TYPE_BE
}) => {
  if (!isHierarchicalSubtype) return filteredData;

  let result = [...filteredData];

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
  } else if (isBadDebtDashboard) {
    if (subtype === "Bad Debt By Entity 01") {
      if (!selectedEntityBarBD) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarBD) {
        result = result.filter(d => d.EntityName === selectedEntityBarBD.EntityName);
      }
    } else {
      if (selectedEntity && !selectedEntityBarBD) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarBD) {
        result = result.filter(d => d.EntityName === selectedEntityBarBD.EntityName);
      }
    }

    // Filter by selected FinancialClass if applicable
    if (selectedFinancialClassBarBD) {
      result = result.filter(d => d.FinancialClass === selectedFinancialClassBarBD);
    }

    // Filter by selected VisitType if applicable
    if (selectedVisitTypeBarBD) {
      result = result.filter(d => d.VisitType === selectedVisitTypeBarBD);
    }

    // Group data based on current level
    if (result.length > 0) {
      if (subtype === "Bad Debt By Entity 01") {
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
      } else if (subtype === "Bad Debt By Fin Class 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.FinancialClass;
          if (!groupedData[key]) {
            groupedData[key] = { FinancialClass: key, EntityName: item.EntityName, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "Bad Debt By Visit Type 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.VisitType;
          if (!groupedData[key]) {
            groupedData[key] = { VisitType: key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "Bad Debt By Service Area 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.ServiceArea;
          if (!groupedData[key]) {
            groupedData[key] = { ServiceArea: key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, VisitType: item.VisitType, AccountingYearPeriod: item.dateValue };
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
  } else if (isBillingEditDashboard) {
    if (subtype === QUERY_BY_ENTITY_BE) {
      if (!selectedEntityBarBE) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarBE) {
        result = result.filter(d => d.EntityName === selectedEntityBarBE.EntityName);
      }
    } else {
      if (selectedEntity && !selectedEntityBarBE) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarBE) {
        result = result.filter(d => d.EntityName === selectedEntityBarBE.EntityName);
      }
    }

    // Filter by selected Ins if applicable
    if (selectedInsBarBE) {
      result = result.filter(d => (d.CarrierName || d.InsuranceName || d.Ins) === selectedInsBarBE);
    }

    // Filter by selected visit type if applicable
    if (selectedVisitTypeBarBE) {
      result = result.filter(d => d.VisitType === selectedVisitTypeBarBE);
    }

    // Group data based on current level
    if (result.length > 0) {
      if (subtype === QUERY_BY_ENTITY_BE) {
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
      } else if (subtype === QUERY_BY_INS_BE) {
        const groupedData = {};
        result.forEach(item => {
          const key = item.CarrierName || item.InsuranceName || item.Ins;
          if (!groupedData[key]) {
            groupedData[key] = { CarrierName: key, InsuranceName: key, Ins: key, EntityName: item.EntityName, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === QUERY_BY_VISIT_TYPE_BE) {
        const groupedData = {};
        result.forEach(item => {
          const key = item.VisitType;
          if (!groupedData[key]) {
            groupedData[key] = { VisitType: key, EntityName: item.EntityName, CarrierName: item.CarrierName || item.InsuranceName || item.Ins, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === QUERY_BY_BE_TYPE_BE) {
        const groupedData = {};
        result.forEach(item => {
          const key = item.BillingEditType;
          if (!groupedData[key]) {
            groupedData[key] = { BillingEditType: key, EntityName: item.EntityName, CarrierName: item.CarrierName || item.InsuranceName || item.Ins, VisitType: item.VisitType, AccountingYearPeriod: item.dateValue };
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
  } else if (isArDaysDashboard) {
    if (subtype === "AR Days By Entity 01") {
      if (!selectedEntityBarAR) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarAR) {
        result = result.filter(d => d.EntityName === selectedEntityBarAR.EntityName);
      }
    } else {
      if (selectedEntity && !selectedEntityBarAR) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarAR) {
        result = result.filter(d => d.EntityName === selectedEntityBarAR.EntityName);
      }
    }

    // Note: Filters for previous levels (FinancialClass, AccountGroup) are skipped as API already applies them

    // Group data based on current level
    if (result.length > 0) {
      if (subtype === "AR Days By Entity 01") {
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
      } else if (subtype === "AR Days by Financial Class 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.FinancialClass;
          if (!groupedData[key]) {
            groupedData[key] = { FinancialClass: key, EntityName: item.EntityName, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "AR Days by Account Group 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item["Account Group"];
          if (!groupedData[key]) {
            groupedData[key] = { "Account Group": key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "AR Days By Primary Ins 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.PrimaryInsurance;
          if (!groupedData[key]) {
            groupedData[key] = { PrimaryInsurance: key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, AccountGroup: item.AccountGroup, AccountingYearPeriod: item.dateValue };
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
  } else if (isAgedArDaysDashboard) {
    if (subtype === "Aged AR By Entity 01") {
      if (!selectedEntityBarAgedAR) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarAgedAR) {
        result = result.filter(d => d.EntityName === selectedEntityBarAgedAR.EntityName);
      }
    } else {
      if (selectedEntity && !selectedEntityBarAgedAR) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarAgedAR) {
        result = result.filter(d => d.EntityName === selectedEntityBarAgedAR.EntityName);
      }
    }

    // Note: Filters for previous levels (FinancialClass, AccountGroup) are skipped as API already applies them

    // Group data based on current level
    if (result.length > 0) {
      if (subtype === "Aged AR By Entity 01") {
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
      } else if (subtype === "Aged AR By Financial Class 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.FinancialClass;
          if (!groupedData[key]) {
            groupedData[key] = { FinancialClass: key, EntityName: item.EntityName, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "Aged AR By Account Group 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item["AccountGroup"] || "Unknown Account Group";
          if (!groupedData[key]) {
            groupedData[key] = { "Account Group": key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "Aged AR By Service Area 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.ServiceArea;
          if (!groupedData[key]) {
            groupedData[key] = { ServiceArea: key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, "Account Group": item["Account Group"], AccountingYearPeriod: item.dateValue };
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
  } else if (isDaysDischargedDashboard) {
    if (subtype === "Days Dis By Entity 01") {
      if (!selectedEntityBarDD) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarDD) {
        result = result.filter(d => d.EntityName === selectedEntityBarDD.EntityName);
      }
    } else {
      if (selectedEntity && !selectedEntityBarDD) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarDD) {
        result = result.filter(d => d.EntityName === selectedEntityBarDD.EntityName);
      }
    }

    // Note: Filters for previous levels are skipped as API already applies them

    // Group data based on current level
    if (result.length > 0) {
      if (subtype === "Days Dis By Entity 01") {
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
      } else if (subtype === "Days Dis By Fin Class 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.FinancialClass;
          if (!groupedData[key]) {
            groupedData[key] = { FinancialClass: key, EntityName: item.EntityName, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "Days Dis By Visit Type 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.VisitType;
          if (!groupedData[key]) {
            groupedData[key] = { VisitType: key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "Days Dis By Service Area 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.ServiceArea;
          if (!groupedData[key]) {
            groupedData[key] = { ServiceArea: key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, VisitType: item.VisitType, AccountingYearPeriod: item.dateValue };
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
  } else if (isPosCashDashboard) {
    // First filter by selected entity
    if (selectedEntity) {
      result = result.filter(d => d.EntityName === selectedEntity);
    }
    
    // Apply additional filters if needed
    if (selectedEntityBarDD) {
      result = result.filter(d => d.EntityName === selectedEntityBarDD.EntityName);
    }

    // Note: Filters for previous levels are skipped as API already applies them

    // Group data based on current level
    if (result.length > 0) {
      if (subtype === "POS Cash By Entity 01" || subtype === "Pos Cash By Entity 01") {
        // For POS Cash By Entity, we should only show one entity - the selected one
        // Create a single entry that aggregates all metrics for the selected entity
        const totalsByMetric = {};
        
        // Initialize metrics
        metricOptions.forEach(metric => {
          totalsByMetric[metric] = 0;
        });
        
        // Sum up all values for each metric
        result.forEach(item => {
          metricOptions.forEach(metric => {
            totalsByMetric[metric] += Number(item[metric] || 0);
          });
        });
        
        // Create a single entry with the selected entity name
        const entityName = selectedEntity || (result.length > 0 ? result[0].EntityName : "Unknown");
        const sampleItem = result.length > 0 ? result[0] : {};
        
        return [{
          EntityName: entityName,
          MonthYear: sampleItem.MonthYear,
          AccountingYearPeriod: sampleItem.dateValue,
          ...totalsByMetric
        }];
      } else if (subtype === "POS Cash By Visit Type 01" || subtype === "Pos Cash By Visit Type 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.VisitType;
          if (!groupedData[key]) {
            groupedData[key] = { VisitType: key, EntityName: item.EntityName, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "POS Cash By Service Area 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.ServiceArea;
          if (!groupedData[key]) {
            groupedData[key] = { ServiceArea: key, EntityName: item.EntityName, VisitType: item.VisitType, AccountingYearPeriod: item.dateValue };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "POS Cash By Payment Code 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.PaymentCode;
          if (!groupedData[key]) {
            groupedData[key] = { PaymentCode: key, EntityName: item.EntityName, VisitType: item.VisitType, ServiceArea: item.ServiceArea, AccountingYearPeriod: item.dateValue };
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
  } else if (isCashCollectedDashboard) {
    if (subtype === "Cash Collected By Entity 01") {
      if (!selectedEntityBarDD) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarDD) {
        result = result.filter(d => d.EntityName === selectedEntityBarDD.EntityName);
      }
    } else {
      if (selectedEntity && !selectedEntityBarDD) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarDD) {
        result = result.filter(d => d.EntityName === selectedEntityBarDD.EntityName);
      }
    }

    // Note: Filters for previous levels are skipped as API already applies them

    // Group data based on current level
    if (result.length > 0) {
      if (subtype === "Cash Collected By Entity 01") {
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
      } else if (subtype === "Cash Collected By Acc Grp 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.AccountGroup || item["Account Group"];
          if (!groupedData[key]) {
            groupedData[key] = { 
              AccGrp: key, 
              AccountGroup: key, 
              "Account Group": key,
              EntityName: item.EntityName, 
              AccountingYearPeriod: item.dateValue 
            };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "POS Cash By PC 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.PC;
          if (!groupedData[key]) {
            groupedData[key] = { PC: key, EntityName: item.EntityName, PC: item.PC, AccountingYearPeriod: item.dateValue };
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
  } else if (isCharityCareDashboard) {
    if (subtype === "Charity Care By Entity 01") {
      if (!selectedEntityBarCCare) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarCCare) {
        result = result.filter(d => d.EntityName === selectedEntityBarCCare.EntityName);
      }
    } else {
      if (selectedEntity && !selectedEntityBarCCare) {
        result = result.filter(d => d.EntityName === selectedEntity);
      }
      if (selectedEntityBarCCare) {
        result = result.filter(d => d.EntityName === selectedEntityBarCCare.EntityName);
      }
    }

    // Note: Filters for previous levels are skipped as API already applies them

    // Group data based on current level
    if (result.length > 0) {
      if (subtype === "Charity Care By Entity 01") {
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
      } else if (subtype === "Charity Care By Account Group 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.AccountGroup || item["Account Group"];
          if (!groupedData[key]) {
            groupedData[key] = { 
              AccGrp: key, 
              AccountGroup: key, 
              "Account Group": key,
              EntityName: item.EntityName, 
              AccountingYearPeriod: item.dateValue 
            };
            metricOptions.forEach(m => {
              groupedData[key][m] = 0;
            });
          }
          metricOptions.forEach(m => {
            groupedData[key][m] += Number(item[m] || 0);
          });
        });
        return Object.values(groupedData);
      } else if (subtype === "Charity Care By PC 01") {
        const groupedData = {};
        result.forEach(item => {
          const key = item.PC;
          if (!groupedData[key]) {
            groupedData[key] = { PC: key, EntityName: item.EntityName, PC: item.PC, AccountingYearPeriod: item.dateValue };
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

  // Charity Care dashboard hierarchical filtering
  if (isCharityCareDashboard) {
    // Filter by entity
    if (selectedEntityBarCCare) {
      result = result.filter(d => d.EntityName === selectedEntityBarCCare.EntityName);
    } else if (selectedEntity) {
      result = result.filter(d => d.EntityName === selectedEntity);
    }

    // Filter by visit type if at level 2+
    if (charityCareHierarchyLevel >= 2 && selectedVisitTypeBarCCare) {
      result = result.filter(d => d.VisitType === selectedVisitTypeBarCCare.VisitType);
    }

    // Filter by adjustment code if at level 3+
    if (charityCareHierarchyLevel >= 3 && selectedServiceAreaBarCCare && selectedServiceAreaBarCCare.AdjustmentCode) {
      result = result.filter(d => d.AdjustmentCode === selectedServiceAreaBarCCare.AdjustmentCode);
    }

    // Filter by service area if at level 3+
    if (charityCareHierarchyLevel >= 3 && selectedServiceAreaBarCCare && selectedServiceAreaBarCCare.ServiceArea) {
      result = result.filter(d => d.ServiceArea === selectedServiceAreaBarCCare.ServiceArea);
    }

    // Group by appropriate field based on hierarchy
    if (subtype === "Charity Care By Entity 01") {
      const groupedData = {};
      result.forEach(item => {
        const key = item.EntityName || 'Unknown';
        if (!groupedData[key]) {
          groupedData[key] = { EntityName: key, AccountingYearPeriod: item.dateValue };
          metricOptions.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        metricOptions.forEach(m => {
          groupedData[key][m] += Number(item[m] || 0);
        });
      });
      return Object.values(groupedData);
    } else if (subtype === "Charity Care By Visit Type 01") {
      const groupedData = {};
      result.forEach(item => {
        const key = item.VisitType || 'Unknown';
        if (!groupedData[key]) {
          groupedData[key] = { VisitType: key, EntityName: item.EntityName, AccountingYearPeriod: item.dateValue };
          metricOptions.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        metricOptions.forEach(m => {
          groupedData[key][m] += Number(item[m] || 0);
        });
      });
      return Object.values(groupedData);
    } else if (subtype === "Charity Care By Serv Area 01") {
      const groupedData = {};
      result.forEach(item => {
        const key = item.ServiceArea || 'Unknown';
        if (!groupedData[key]) {
          groupedData[key] = { 
            ServiceArea: key, 
            EntityName: item.EntityName, 
            VisitType: item.VisitType, 
            AccountingYearPeriod: item.dateValue 
          };
          metricOptions.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        metricOptions.forEach(m => {
          groupedData[key][m] += Number(item[m] || 0);
        });
      });
      return Object.values(groupedData);
    } else if (subtype === "Charity Care By AC 01") {
      const groupedData = {};
      result.forEach(item => {
        const key = item.AdjustmentCode || 'Unknown';
        if (!groupedData[key]) {
          groupedData[key] = { 
            AdjustmentCode: key, 
            EntityName: item.EntityName, 
            VisitType: item.VisitType, 
            ServiceArea: item.ServiceArea, 
            AccountingYearPeriod: item.dateValue 
          };
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
  
  return result;
};