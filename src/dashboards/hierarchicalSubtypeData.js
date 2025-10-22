/**
 * hierarchicalSubtypeData.js
 * Contains functions for processing and grouping dashboard data by subtype
 */

import { getDisplayKey } from './utils';

/**
 * Process and group data hierarchically based on dashboard type and subtype
 * @param {string} dashboardType - The type of dashboard being displayed
 * @param {string} subtypeValue - The current subtype value
 * @param {Array} filteredSubtypeData - The filtered data for the current subtype
 * @param {Array} subtypeMetrics - The metrics to be calculated for the current subtype
 * @param {string} selectedEntity - The currently selected entity, if any
 * @param {string} QUERY_BY_ENTITY_BE - Constant for entity query type (Billing Edit)
 * @param {string} QUERY_BY_INS_BE - Constant for insurance query type (Billing Edit)
 * @param {string} QUERY_BY_VISIT_TYPE_BE - Constant for visit type query type (Billing Edit)
 * @param {string} QUERY_BY_BE_TYPE_BE - Constant for billing edit type query type
 * @returns {Array} Processed and grouped data
 */
export const getSubtypeHierarchicalData = ({
  dashboardType,
  subtypeValue,
  filteredSubtypeData,
  subtypeMetrics,
  selectedEntity,
  QUERY_BY_ENTITY_BE,
  QUERY_BY_INS_BE,
  QUERY_BY_VISIT_TYPE_BE,
  QUERY_BY_BE_TYPE_BE
}) => {
  if (dashboardType === "Bad Debt") {
    if (subtypeValue.includes("Month")) {
      return filteredSubtypeData.map(d => ({
        ...d,
        [getDisplayKey(subtypeValue)]: d.MonthYear
      }));
    } else if (subtypeValue === "Bad Debt By Entity 01") {
      const entityGroups = {};
      filteredSubtypeData.forEach(d => {
        if (!entityGroups[d.EntityName]) {
          entityGroups[d.EntityName] = { EntityName: d.EntityName };
          subtypeMetrics.forEach(metric => {
            entityGroups[d.EntityName][metric] = 0;
          });
        }
        subtypeMetrics.forEach(metric => {
          entityGroups[d.EntityName][metric] += parseFloat(d[metric]) || 0;
        });
      });
      // If selected entity is present, only return data for that entity
      if (selectedEntity) {
        return Object.values(entityGroups).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(entityGroups);
    } else if (subtypeValue === "Bad Debt By Fin Class 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.FinancialClass;
        if (!groupedData[key]) {
          groupedData[key] = { FinancialClass: key, EntityName: item.EntityName };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === "Bad Debt By Visit Type 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.VisitType;
        if (!groupedData[key]) {
          groupedData[key] = { VisitType: key, EntityName: item.EntityName };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === "Bad Debt By Service Area 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.ServiceArea;
        if (!groupedData[key]) {
          groupedData[key] = { ServiceArea: key, EntityName: item.EntityName };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    }
  } else if (dashboardType === "Denials") {
    if (subtypeValue.includes("Month")) {
      return filteredSubtypeData.map(d => ({
        ...d,
        [getDisplayKey(subtypeValue)]: d.MonthYear
      }));
    } else if (subtypeValue.includes("Entity")) {
      const result = [];
      const entityGroups = {};
      filteredSubtypeData.forEach(d => {
        if (!entityGroups[d.EntityName]) {
          entityGroups[d.EntityName] = { EntityName: d.EntityName };
          subtypeMetrics.forEach(metric => {
            entityGroups[d.EntityName][metric] = 0;
          });
        }
        subtypeMetrics.forEach(metric => {
          entityGroups[d.EntityName][metric] += parseFloat(d[metric]) || 0;
        });
      });
      // If selected entity is present, only return data for that entity
      if (selectedEntity) {
        return Object.values(entityGroups).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(entityGroups);
    } else if (subtypeValue.includes("Insurance")) {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.CarrierName || item.InsuranceName;
        if (!groupedData[key]) {
          groupedData[key] = { CarrierName: key, InsuranceName: key, EntityName: item.EntityName };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue.includes("Visit Type")) {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.VisitType;
        if (!groupedData[key]) {
          groupedData[key] = { VisitType: key, EntityName: item.EntityName, CarrierName: item.CarrierName || item.InsuranceName };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue.includes("Denial Code")) {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.DenialCode;
        if (!groupedData[key]) {
          groupedData[key] = { DenialCode: key, EntityName: item.EntityName, CarrierName: item.CarrierName || item.InsuranceName, VisitType: item.VisitType };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    }
  } else if (dashboardType === "Transactions") {
    if (subtypeValue.includes("Month")) {
      return filteredSubtypeData.map(d => ({
        ...d,
        [getDisplayKey(subtypeValue)]: d.MonthYear
      }));
    }
  } else if (dashboardType === "Aged AR Days") {
    if (subtypeValue === "Aged AR By Entity 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.EntityName;
        if (!groupedData[key]) {
          groupedData[key] = { EntityName: key, MonthYear: item.MonthYear, AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      return Object.values(groupedData);
    } else if (subtypeValue === "Aged AR By Financial Class 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.FinancialClass;
        if (!groupedData[key]) {
          groupedData[key] = { FinancialClass: key, EntityName: item.EntityName, AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === "Aged AR By Account Group 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item["Account Group"] || "Unknown Account Group";
        if (!groupedData[key]) {
          groupedData[key] = { "Account Group": key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === "Aged AR By Service Area 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.ServiceArea;
        if (!groupedData[key]) {
          groupedData[key] = { ServiceArea: key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, "Account Group": item["Account Group"], AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    }
  } else if (dashboardType === "AR Days") {
    if (subtypeValue === "AR Days By Entity 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.EntityName;
        if (!groupedData[key]) {
          groupedData[key] = { EntityName: key, MonthYear: item.MonthYear, AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === "AR Days By Financial Class 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.FinancialClass;
        if (!groupedData[key]) {
          groupedData[key] = { FinancialClass: key, EntityName: item.EntityName, AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === "AR Days By Account Group 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item["Account Group"];
        if (!groupedData[key]) {
          groupedData[key] = { "Account Group": key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === "AR Days By Primary Ins 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.PrimaryInsurance;
        if (!groupedData[key]) {
          groupedData[key] = { PrimaryInsurance: key, EntityName: item.EntityName, FinancialClass: item.FinancialClass, "Account Group": item["Account Group"], AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    }
  } else if (dashboardType === "POS Cash") {
    if (subtypeValue.includes("Month")) {
      return filteredSubtypeData.map(d => ({
        ...d,
        [getDisplayKey(subtypeValue)]: d.MonthYear
      }));
    } else if (subtypeValue === "POS Cash By Entity 01") {
      const entityGroups = {};
      filteredSubtypeData.forEach(d => {
        if (!entityGroups[d.EntityName]) {
          entityGroups[d.EntityName] = { EntityName: d.EntityName };
          subtypeMetrics.forEach(metric => {
            entityGroups[d.EntityName][metric] = 0;
          });
        }
        subtypeMetrics.forEach(metric => {
          entityGroups[d.EntityName][metric] += parseFloat(d[metric]) || 0;
        });
      });
      // If selected entity is present, only return data for that entity
      if (selectedEntity) {
        return Object.values(entityGroups).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(entityGroups);
    } else if (subtypeValue === "POS Cash By Payment Code 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.PaymentCode;
        if (!groupedData[key]) {
          groupedData[key] = { PaymentCode: key, EntityName: item.EntityName };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === "POS Cash By Visit Type 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.VisitType;
        if (!groupedData[key]) {
          groupedData[key] = { VisitType: key, EntityName: item.EntityName };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === "POS Cash By Service Area 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.ServiceArea;
        if (!groupedData[key]) {
          groupedData[key] = { ServiceArea: key, EntityName: item.EntityName };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    }
  } else if (dashboardType === "Cost to Collect") {
    if (subtypeValue.includes("Month")) {
      return filteredSubtypeData.map(d => ({
        ...d,
        [getDisplayKey(subtypeValue)]: d.MonthYear
      }));
    } else if (subtypeValue === "Cost To Collect By Entity 01") {
      // For Cost To Collect By Entity, when an entity is selected,
      // we'll aggregate all the metrics into a single data point
      if (selectedEntity) {
        const totalsByMetric = {};
        
        // Initialize metrics
        subtypeMetrics.forEach(metric => {
          totalsByMetric[metric] = 0;
        });
        
        // Sum up values for the selected entity
        filteredSubtypeData.forEach(item => {
          if (item.EntityName === selectedEntity) {
            subtypeMetrics.forEach(metric => {
              totalsByMetric[metric] += parseFloat(item[metric] || 0);
            });
          }
        });
        
        // Return a single data point with aggregated values
        const sampleItem = filteredSubtypeData.find(d => d.EntityName === selectedEntity) || {};
        return [{
          EntityName: selectedEntity,
          MonthYear: sampleItem.MonthYear,
          AccountingYearPeriod: sampleItem.dateValue,
          ...totalsByMetric
        }];
      } else {
        // If no entity is selected, process normally
        const entityGroups = {};
        filteredSubtypeData.forEach(d => {
          if (!entityGroups[d.EntityName]) {
            entityGroups[d.EntityName] = { EntityName: d.EntityName };
            subtypeMetrics.forEach(metric => {
              entityGroups[d.EntityName][metric] = 0;
            });
          }
          subtypeMetrics.forEach(metric => {
            entityGroups[d.EntityName][metric] += parseFloat(d[metric] || 0);
          });
        });
        return Object.values(entityGroups);
      }
    }
  } else if (dashboardType === "Cash Collected") {
    if (subtypeValue.includes("Month")) {
      return filteredSubtypeData.map(d => ({
        ...d,
        [getDisplayKey(subtypeValue)]: d.MonthYear
      }));
    } else if (subtypeValue === "Cash Collected By Entity 01") {
      const entityGroups = {};
      filteredSubtypeData.forEach(d => {
        if (!entityGroups[d.EntityName]) {
          entityGroups[d.EntityName] = { EntityName: d.EntityName };
          subtypeMetrics.forEach(metric => {
            entityGroups[d.EntityName][metric] = 0;
          });
        }
        subtypeMetrics.forEach(metric => {
          entityGroups[d.EntityName][metric] += parseFloat(d[metric]) || 0;
        });
      });
      // If selected entity is present, only return data for that entity
      if (selectedEntity) {
        return Object.values(entityGroups).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(entityGroups);
    } else if (subtypeValue === "Cash Collected By Acc Grp 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item["Acc Grp"];
        if (!groupedData[key]) {
          groupedData[key] = { "Acc Grp": key, EntityName: item.EntityName };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === "Cash Collected By PC 01") {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.PC;
        if (!groupedData[key]) {
          groupedData[key] = { PC: key, EntityName: item.EntityName };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    }
  } else if (dashboardType === "Charity Care") {
    if (subtypeValue.includes("Month")) {
      return filteredSubtypeData.map(d => ({
        ...d,
        [getDisplayKey(subtypeValue)]: d.MonthYear
      }));
    } else if (subtypeValue === "Charity Care By Entity 01") {
      const entityGroups = {};
      filteredSubtypeData.forEach(d => {
        if (!entityGroups[d.EntityName]) {
          entityGroups[d.EntityName] = { EntityName: d.EntityName };
          subtypeMetrics.forEach(metric => {
            entityGroups[d.EntityName][metric] = 0;
          });
        }
        subtypeMetrics.forEach(metric => {
          entityGroups[d.EntityName][metric] += parseFloat(d[metric]) || 0;
        });
      });
      // If selected entity is present, only return data for that entity
      if (selectedEntity) {
        return Object.values(entityGroups).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(entityGroups);
    }
  } else if (dashboardType === "Billing Edit") {
    if (subtypeValue === QUERY_BY_ENTITY_BE) {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.EntityName;
        if (!groupedData[key]) {
          groupedData[key] = { EntityName: key, MonthYear: item.MonthYear, AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // If selected entity is present, only return data for that entity
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === QUERY_BY_INS_BE) {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.CarrierName || item.InsuranceName || item.Ins;
        if (!groupedData[key]) {
          groupedData[key] = { CarrierName: key, InsuranceName: key, Ins: key, EntityName: item.EntityName, AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === QUERY_BY_VISIT_TYPE_BE) {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.VisitType;
        if (!groupedData[key]) {
          groupedData[key] = { VisitType: key, EntityName: item.EntityName, CarrierName: item.CarrierName || item.InsuranceName || item.Ins, AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    } else if (subtypeValue === QUERY_BY_BE_TYPE_BE) {
      const groupedData = {};
      filteredSubtypeData.forEach(item => {
        const key = item.BillingEditType;
        if (!groupedData[key]) {
          groupedData[key] = { BillingEditType: key, EntityName: item.EntityName, CarrierName: item.CarrierName || item.InsuranceName || item.Ins, VisitType: item.VisitType, AccountingYearPeriod: item.dateValue };
          subtypeMetrics.forEach(m => {
            groupedData[key][m] = 0;
          });
        }
        subtypeMetrics.forEach(m => {
          groupedData[key][m] += parseFloat(item[m]) || 0;
        });
      });
      // Filter by selected entity if it's specified
      if (selectedEntity) {
        return Object.values(groupedData).filter(item => item.EntityName === selectedEntity);
      }
      return Object.values(groupedData);
    }
  }
  return filteredSubtypeData;
};