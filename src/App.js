import React, { useState, useEffect, useRef } from "react";
import { FaHospital, FaChartBar, FaFileInvoice } from "react-icons/fa";
import logo from "./alogo.png";
import "./App.css";
import { DASHBOARD_OPTIONS, DENIALS_HIERARCHY, BILLING_EDIT_HIERARCHY, AR_DAYS_HIERARCHY, AGED_AR_DAYS_HIERARCHY, DAYS_DISCHARGED_HIERARCHY, BAD_DEBT_HIERARCHY, POS_CASH_HIERARCHY, CASH_COLLECTED_HIERARCHY, CHARITY_CARE_HIERARCHY, QUERY_BY_ENTITY_01, QUERY_BY_INSURANCE_01, QUERY_BY_VISIT_TYPE_01, QUERY_BY_DENIAL_CODE_01, QUERY_BY_ENTITY_BE, QUERY_BY_INS_BE, QUERY_BY_VISIT_TYPE_BE, QUERY_BY_BE_TYPE_BE } from "./dashboards/constants";
import { getCategory, getDisplayKey, formatMonthYear, formatYAxisTick } from "./dashboards/utils";
import { getSubtypeOptions, handleBarClick } from "./dashboards/dataService";
import { getHierarchicalFilteredData as processHierarchicalData } from "./dashboards/hierarchicalFilters";
import { getSubtypeHierarchicalData as processSubtypeData } from "./dashboards/hierarchicalSubtypeData";
import { API_CONFIG } from "./config/config";


import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

function App() {
  // Theme state
  const [theme, setTheme] = useState('light');
  
  // Cash Collected Dashboard states
  const [cashCollectedHierarchyLevel, setCashCollectedHierarchyLevel] = useState(0);
  const [selectedEntityBarCC, setSelectedEntityBarCC] = useState("");
  const [selectedAccGrpBarCC, setSelectedAccGrpBarCC] = useState("");
  const [selectedPCBarCC, setSelectedPCBarCC] = useState("");

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.multi-select-dropdown')) {
        setSubtypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine axis tick color based on theme
  const getAxisTickColor = () => {
    return theme === 'dark' ? '#d4d4d4' : '#333333';
  };

  // Determine chart colors based on theme
  const getChartColors = () => {
    if (theme === 'dark') {
      return ["#8ab4f8", "#4ade80", "#fb923c", "#c084fc", "#38bdf8", "#fde68a"];
    }
    return ["#6366f1", "#22c55e", "#f97316", "#d946ef", "#0ea5e9", "#facc15"];
  };

  // ...existing code...
  // hierarchicalFilteredData is already declared above
  const [chartData, setChartData] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [metricOptions, setMetricOptions] = useState([]);
  const [metric, setMetric] = useState("");
  const [chartType, setChartType] = useState("Line");
  const [namespaces, setNamespaces] = useState([]);
  const [namespace, setNamespace] = useState("");
  const [dashboardType, setDashboardType] = useState("Transactions");
  const [subtype, setSubtype] = useState("");
  const [selectedSubtypes, setSelectedSubtypes] = useState(() => []);
  const [subtypeDropdownOpen, setSubtypeDropdownOpen] = useState(false);
  const [subtypeDataMap, setSubtypeDataMap] = useState({}); // Store data for each subtype
  const [isLoading, setIsLoading] = useState(false);
  const activeFetches = useRef(0);
  
  // POS Cash state variables
  const [posCashHierarchyLevel, setPosCashHierarchyLevel] = useState(0);
  const [selectedEntityBarPC, setSelectedEntityBarPC] = useState("");
  const [selectedFinancialClassBarPC, setSelectedFinancialClassBarPC] = useState("");
  const [selectedVisitTypeBarPC, setSelectedVisitTypeBarPC] = useState("");
  const [selectedServiceAreaBarPC, setSelectedServiceAreaBarPC] = useState("");
  const [selectedPaymentCodeBarPC, setSelectedPaymentCodeBarPC] = useState("");

  // Payment Dashboard state variables
  const [selectedEntityBarPD, setSelectedEntityBarPD] = useState("");
  const [selectedFinancialClassBarPD, setSelectedFinancialClassBarPD] = useState("");
  const [selectedVisitTypeBarPD, setSelectedVisitTypeBarPD] = useState("");

  // Handle multiple subtype selection (max 2)
  const handleSubtypeToggle = (subtypeValue, event) => {
    // Prevent any event bubbling
    event.stopPropagation();

    setSelectedSubtypes(prev => {
      if (prev.includes(subtypeValue)) {
        // Remove if already selected
        const newSelection = prev.filter(s => s !== subtypeValue);
        // Update main subtype to first selected or none
        setSubtype(newSelection[0] || "");
        // If removing the last subtype, clear its data from the map
        if (newSelection.length === 0) {
          setSubtypeDataMap(prevMap => {
            const newMap = { ...prevMap };
            delete newMap[subtypeValue];
            return newMap;
          });
        }
        return newSelection;
      } else {
        // Add if not selected and less than 2
        if (prev.length < 2) {
          const newSelection = [...prev, subtypeValue];
          setSubtype(subtypeValue); // Set as main subtype
          return newSelection;
        }
        return prev; // Don't add if already 2 selected
      }
    });
  };

  // Add useEffect to trigger data fetch when dashboardType or subtype changes initially
  useEffect(() => {
    // Reset hierarchy levels and selections on dashboardType change
    setDenialHierarchyLevel(0);
    setBillingEditHierarchyLevel(0);
    setArDaysHierarchyLevel(0);
    setAgedArDaysHierarchyLevel(0);
    setCharityCareHierarchyLevel(0);
    setSelectedEntityBar("");
    setSelectedInsuranceBar("");
    setSelectedVisitTypeBar("");
    setSelectedEntityBarBE("");
    setSelectedInsBarBE("");
    setSelectedVisitTypeBarBE("");
    setSelectedEntityBarAR("");
    setSelectedFinancialClassBarAR("");
    setSelectedAccountGroupBarAR("");
    setSelectedEntityBarAgedAR("");
    setSelectedFinancialClassBarAgedAR("");
    setSelectedAccountGroupBarAgedAR("");
    setSelectedServiceAreaBarAgedAR("");
    setSelectedEntityBarCCare("");
    setSelectedVisitTypeBarCCare("");
    setSelectedServiceAreaBarCCare("");
    setSelectedAccGrpBarCCare("");
    setSelectedPCBarCCare("");

    // Reset selected subtypes and clear chart data
    setSubtype("");
    setSelectedSubtypes([]);
    setChartData([]); // Clear chart data when dashboard type changes
    setSubtypeDataMap({}); // Clear stored subtype data
    setSelectedEntity(""); // Reset entity selection on dashboard type change
  }, [dashboardType]);

  useEffect(() => {
    // Clear chart data when no subtype is selected
    if (!selectedSubtypes.length) {
      setChartData([]);
      setSubtypeDataMap({});
      setSelectedEntity(""); // Reset entity selection on subtype clear
    }
    // Switch from Pie to Line when multiple subtypes are selected
    if (selectedSubtypes.length > 1 && chartType === "Pie") {
      setChartType("Line");
    }
  }, [selectedSubtypes, chartType]);
  const [fromDate, setFromDate] = useState("2010-12-01");
  const [toDate, setToDate] = useState("2011-03-30");
  const [denialHierarchyLevel, setDenialHierarchyLevel] = useState(0); // 0: Entity, 1: Insurance, 2: Visit Type, 3: Denial Code
  const [selectedEntityBar, setSelectedEntityBar] = useState("");
  const [selectedInsuranceBar, setSelectedInsuranceBar] = useState("");
  const [selectedVisitTypeBar, setSelectedVisitTypeBar] = useState("");
  // Billing Edit hierarchy state
  const [billingEditHierarchyLevel, setBillingEditHierarchyLevel] = useState(0); // 0: Entity, 1: Ins, 2: Visit Type, 3: BE Type
  const [selectedEntityBarBE, setSelectedEntityBarBE] = useState("");
  const [selectedInsBarBE, setSelectedInsBarBE] = useState("");
  const [selectedVisitTypeBarBE, setSelectedVisitTypeBarBE] = useState("");

  // AR Days hierarchy state
  const [arDaysHierarchyLevel, setArDaysHierarchyLevel] = useState(0); // 0: Entity, 1: Financial Class, 2: Account Group, 3: Primary Insurance
  const [selectedEntityBarAR, setSelectedEntityBarAR] = useState("");
  const [selectedFinancialClassBarAR, setSelectedFinancialClassBarAR] = useState("");
  const [selectedAccountGroupBarAR, setSelectedAccountGroupBarAR] = useState("");

  // Aged AR Days hierarchy state
  const [agedArDaysHierarchyLevel, setAgedArDaysHierarchyLevel] = useState(0); // 0: Entity, 1: Financial Class, 2: Account Group, 3: Service Area
  const [selectedEntityBarAgedAR, setSelectedEntityBarAgedAR] = useState("");
  const [selectedFinancialClassBarAgedAR, setSelectedFinancialClassBarAgedAR] = useState("");
  const [selectedAccountGroupBarAgedAR, setSelectedAccountGroupBarAgedAR] = useState("");
  const [selectedServiceAreaBarAgedAR, setSelectedServiceAreaBarAgedAR] = useState("");

  // Days Discharged hierarchy state
  const [daysDischargedHierarchyLevel, setDaysDischargedHierarchyLevel] = useState(0); // 0: Entity, 1: Financial Class, 2: Visit Type, 3: Service Area
  const [selectedEntityBarDD, setSelectedEntityBarDD] = useState("");
  const [selectedFinancialClassBarDD, setSelectedFinancialClassBarDD] = useState("");
  const [selectedVisitTypeBarDD, setSelectedVisitTypeBarDD] = useState("");
  const [selectedServiceAreaBarDD, setSelectedServiceAreaBarDD] = useState("");

  // Bad Debt hierarchy state
  const [badDebtHierarchyLevel, setBadDebtHierarchyLevel] = useState(0); // 0: Entity, 1: Financial Class, 2: Visit Type, 3: Service Area
  const [selectedEntityBarBD, setSelectedEntityBarBD] = useState("");
  const [selectedFinancialClassBarBD, setSelectedFinancialClassBarBD] = useState("");
  const [selectedVisitTypeBarBD, setSelectedVisitTypeBarBD] = useState("");
  const [selectedServiceAreaBarBD, setSelectedServiceAreaBarBD] = useState("");

  // Charity Care hierarchy state
  const [charityCareHierarchyLevel, setCharityCareHierarchyLevel] = useState(0); // 0: Entity, 1: Visit Type, 2: Service Area, 3: Adjustment Code
  const [selectedEntityBarCCare, setSelectedEntityBarCCare] = useState("");
  const [selectedVisitTypeBarCCare, setSelectedVisitTypeBarCCare] = useState("");
  const [selectedServiceAreaBarCCare, setSelectedServiceAreaBarCCare] = useState("");
  const [selectedAccGrpBarCCare, setSelectedAccGrpBarCCare] = useState("");
  const [selectedPCBarCCare, setSelectedPCBarCCare] = useState("");


  // Calendar state for Transactions By Day - initialize with fromDate
  const [calendarDate, setCalendarDate] = useState(() => {
    if (fromDate) {
      return new Date(fromDate);
    }
    return new Date();
  });

  // Hover tooltip state for calendar
  const [hoveredDayData, setHoveredDayData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHoveringDay, setIsHoveringDay] = useState(false);

  // Update calendar date when fromDate changes
  useEffect(() => {
    if (fromDate && subtype === "Transactions By Day 01") {
      setCalendarDate(new Date(fromDate));
    }
  }, [fromDate, subtype]);

  // Reset Denials, Billing Edit, AR Days, Aged AR Days, and Days Discharged hierarchy state when dashboard type changes
  useEffect(() => {
    if (dashboardType !== "Denials") {
      setDenialHierarchyLevel(0);
      setSelectedEntityBar("");
      setSelectedInsuranceBar("");
      setSelectedVisitTypeBar("");
    }
    if (dashboardType !== "Billing Edit") {
      setBillingEditHierarchyLevel(0);
      setSelectedEntityBarBE("");
      setSelectedInsBarBE("");
      setSelectedVisitTypeBarBE("");
    }
    if (dashboardType !== "AR Days") {
      setArDaysHierarchyLevel(0);
      setSelectedEntityBarAR("");
      setSelectedFinancialClassBarAR("");
      setSelectedAccountGroupBarAR("");
    }
    if (dashboardType !== "Aged AR Days") {
      setAgedArDaysHierarchyLevel(0);
      setSelectedEntityBarAgedAR("");
      setSelectedFinancialClassBarAgedAR("");
      setSelectedAccountGroupBarAgedAR("");
      setSelectedServiceAreaBarAgedAR("");
    }
    if (dashboardType !== "Days Discharged") {
      setDaysDischargedHierarchyLevel(0);
      setSelectedEntityBarDD("");
      setSelectedFinancialClassBarDD("");
      setSelectedVisitTypeBarDD("");
      setSelectedServiceAreaBarDD("");
    }
    if (dashboardType !== "Bad Debt") {
      setBadDebtHierarchyLevel(0);
      setSelectedEntityBarBD("");
      setSelectedFinancialClassBarBD("");
      setSelectedVisitTypeBarBD("");
      setSelectedServiceAreaBarBD("");
    }
    if (dashboardType !== "POS Cash") {
      setPosCashHierarchyLevel(0);
      setSelectedEntityBarPC("");
      setSelectedFinancialClassBarPC("");
      setSelectedVisitTypeBarPC("");
      setSelectedServiceAreaBarPC("");
    }
    if (dashboardType !== "Cash Collected") {
      setCashCollectedHierarchyLevel(0);
      setSelectedEntityBarCC("");
      setSelectedAccGrpBarCC("");
      setSelectedPCBarCC("");
    }
    if (dashboardType !== "Charity Care") {
      setCharityCareHierarchyLevel(0);
      setSelectedEntityBarCCare("");
      setSelectedAccGrpBarCCare("");
      setSelectedPCBarCCare("");
    }
    
  }, [dashboardType]);

  const COLORS = getChartColors();

  const getMetricClass = (metricName) => {
    const lower = metricName.toLowerCase().replace(/\s+/g, '');
    if (lower.includes('adjustment')) return 'adjustment';
    if (lower.includes('payment')) return 'payment';
    if (lower.includes('charge')) return 'charge';
    if (lower.includes('room')) return 'room';
    if (lower.includes('transaction') && lower.includes('amount')) return 'transactionamount';
    return ''; // default
  };


  // Fetch namespaces
  useEffect(() => {
    fetch(`${API_CONFIG.SERVER_URL}${API_CONFIG.API_BASE_PATH}/namespaces`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched namespaces:", data);
        setNamespaces(data);
        if (data.length > 0) setNamespace(data[0]);
      })
      .catch((err) => console.error("Error fetching namespaces:", err));
  }, []);

  // Fetch entities
  useEffect(() => {
    if (!namespace) return;
    fetch(`${API_CONFIG.SERVER_URL}${API_CONFIG.API_BASE_PATH}/${namespace}/entities`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched entities:", data);
        // Filter out any values that look like dates
        const filteredEntities = data.filter(entity => 
          entity && typeof entity === 'string' && !entity.match(/^\d{4}-\d{2}-\d{2}/) && !entity.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/));
        setEntityOptions(filteredEntities);
        if (filteredEntities.length > 0) setSelectedEntity(filteredEntities[0]);
      })
      .catch((err) => console.error("Error fetching entities:", err));
  }, [namespace]);

  // Fetch chart data and format Month-Year for X-axis
  // Generic API call logic for all dashboard types/subtypes and hierarchy levels
  useEffect(() => {
    if (!namespace || !dashboardType || selectedSubtypes.length === 0) return;

    // Import the data fetching functionality from dataService
    import('./dashboards/dataService').then(({ fetchAllSubtypeData }) => {
      // Call the fetchAllSubtypeData function with all necessary parameters
      fetchAllSubtypeData({
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
        dashboardType,
        subtype,
        selectedEntity,
        fromDate,
        toDate
      });
    });
  }, [namespace, dashboardType, selectedSubtypes, denialHierarchyLevel, selectedEntityBar, selectedInsuranceBar, selectedVisitTypeBar, billingEditHierarchyLevel, selectedEntityBarBE, selectedInsBarBE, selectedVisitTypeBarBE, arDaysHierarchyLevel, selectedEntityBarAR, selectedFinancialClassBarAR, selectedAccountGroupBarAR, agedArDaysHierarchyLevel, selectedEntityBarAgedAR, selectedFinancialClassBarAgedAR, selectedAccountGroupBarAgedAR, selectedServiceAreaBarAgedAR, daysDischargedHierarchyLevel, selectedEntityBarDD, selectedFinancialClassBarDD, selectedVisitTypeBarDD, selectedServiceAreaBarDD, badDebtHierarchyLevel, selectedEntityBarBD, selectedFinancialClassBarBD, selectedVisitTypeBarBD, selectedServiceAreaBarBD, charityCareHierarchyLevel, selectedEntityBarCCare, selectedVisitTypeBarCCare, selectedServiceAreaBarCCare, fromDate, toDate]);

  // Hierarchical Subtype logic for Denials, Billing Edit, AR Days, Aged AR Days, and Days Discharged dashboards
  const isDenialsDashboard = dashboardType === "Denials";
  const isBillingEditDashboard = dashboardType === "Billing Edit";
  const isArDaysDashboard = dashboardType === "AR Days";
  const isAgedArDaysDashboard = dashboardType === "Aged AR Days";
  const isDaysDischargedDashboard = dashboardType === "Days Discharged";
  const isBadDebtDashboard = dashboardType === "Bad Debt";
  const isPosCashDashboard = dashboardType === "POS Cash";
  const isCashCollectedDashboard = dashboardType === "Cash Collected";
  const isCharityCareDashboard = dashboardType === "Charity Care";
  const isHierarchicalSubtype = DENIALS_HIERARCHY.includes(subtype) || BILLING_EDIT_HIERARCHY.includes(subtype) || AR_DAYS_HIERARCHY.includes(subtype) || AGED_AR_DAYS_HIERARCHY.includes(subtype) || DAYS_DISCHARGED_HIERARCHY.includes(subtype) || BAD_DEBT_HIERARCHY.includes(subtype) || POS_CASH_HIERARCHY.includes(subtype) || CASH_COLLECTED_HIERARCHY.includes(subtype) || CHARITY_CARE_HIERARCHY.includes(subtype);

  // Filter data by selected entity and date range
  const filteredData = chartData.filter(d => {
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

  // Subtype dropdown options and disabled logic - now using imported function from dataService
  const getSubtypeOptionsForApp = () => {
    return getSubtypeOptions(dashboardType, subtype, denialHierarchyLevel, billingEditHierarchyLevel, 
      arDaysHierarchyLevel, agedArDaysHierarchyLevel, daysDischargedHierarchyLevel, badDebtHierarchyLevel, 
      posCashHierarchyLevel, cashCollectedHierarchyLevel, charityCareHierarchyLevel);
  };

  // Chart click handler for hierarchy - now using imported function from dataService
  const handleBarClickForApp = (data) => {
    handleBarClick(data, dashboardType, subtype, selectedEntity,
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
    );
  };

  // Filter data for hierarchy
  // Create a more robust filtering function for the Denials and Billing Edit hierarchies
  const getHierarchicalFilteredData = () => {
    return processHierarchicalData({
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
    });
  }

  let hierarchicalFilteredData = getHierarchicalFilteredData();
  console.log("hierarchicalFilteredData:", hierarchicalFilteredData.length, "records");
  console.log("Current state - namespace:", namespace, "dashboardType:", dashboardType, "subtype:", subtype);

  // If hierarchicalFilteredData is empty, fallback to showing records for the selected subtype
  if (hierarchicalFilteredData.length === 0) {
    const fallbackData = subtypeDataMap[subtype] || [];
    hierarchicalFilteredData = fallbackData.filter(d => {
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
    console.log("Fallback data used:", hierarchicalFilteredData.length, "records for subtype:", subtype);
  }

  // Helper function to get category from subtype
  const getCategory = (subtype) => {
    if (subtype.includes("Month")) return "Month";
    if (subtype.includes("Entity")) return "Entity";
    if (subtype.includes("Insurance") || subtype.includes("Ins")) return "Insurance";
    if (subtype.includes("Visit Type")) return "Visit Type";
    if (subtype.includes("Denial Code")) return "Denial Code";
    if (subtype.includes("BE Type")) return "BE Type";
    if (subtype.includes("Financial Class") || subtype.includes("Fin Class")) return "Financial Class";
    if (subtype.includes("Account Group")) return "Account Group";
    if (subtype.includes("Primary Insurance")) return "Primary Insurance";
    return "Item";
  };

  // Helper function to get display key for highest/lowest
  const getDisplayKey = (subtype) => {
    if (subtype.includes("Month")) return "MonthYear";
    if (subtype.includes("Entity")) return "EntityName";
    if (subtype.includes("Insurance") || subtype.includes("Ins")) return "CarrierName";
    if (subtype.includes("Visit Type")) return "VisitType";
    if (subtype.includes("Denial Code")) return "DenialCode";
    if (subtype.includes("BE Type")) return "BillingEditType";
    if (subtype.includes("Financial Class") || subtype.includes("Fin Class")) return "FinancialClass";
    if (subtype.includes("Account Group")) return "Account Group";
    if (subtype.includes("Primary Ins")) return "PrimaryInsurance";
    return "MonthYear";
  };

  const getXAxisDataKey = () => {
    // Handle case variations for certain subtypes
    if (subtype === "Cost To Collect By Entity 01" || subtype === "Cost to Collect By Entity 01") {
      return "EntityName";
    }
    
    switch (subtype) {
      case QUERY_BY_ENTITY_01:
        return "EntityName";
      case QUERY_BY_INSURANCE_01:
        return "CarrierName";
      case QUERY_BY_VISIT_TYPE_01:
        return "VisitType";
      case QUERY_BY_DENIAL_CODE_01:
        return "DenialCode";
      case QUERY_BY_ENTITY_BE:
        return "EntityName";
      case QUERY_BY_INS_BE:
        return "CarrierName";
      case QUERY_BY_VISIT_TYPE_BE:
        return "VisitType";
      case QUERY_BY_BE_TYPE_BE:
        return "BillingEditType";
      case "AR Days By Entity 01":
        return "EntityName";
      case "AR Days By Financial Class 01":
        return "FinancialClass";
      case "AR Days By Account Group 01":
        return "Account Group";
      case "AR Days By Primary Ins 01":
        return "PrimaryInsurance";
      case "Aged AR By Entity 01":
        return "EntityName";
      case "Aged AR By Financial Class 01":
        return "FinancialClass";
      case "Aged AR By Account Group 01":
        return "Account Group";
      case "Aged AR By Service Area 01":
        return "ServiceArea";
      case "Days Dis By Entity 01":
        return "EntityName";
      case "Days Dis By Fin Class 01":
        return "FinancialClass";
      case "Days Dis By Visit Type 01":
        return "VisitType";
      case "Days Dis By Service Area 01":
        return "ServiceArea";
      case "Bad Debt By Entity 01":
        return "EntityName";
      case "Bad Debt By Fin Class 01":
        return "FinancialClass";
      case "Bad Debt By Visit Type 01":
        return "VisitType";
      case "Bad Debt By Service Area 01":
        return "ServiceArea";
      case "POS Cash By Entity 01":
        return "EntityName";
      case "POS Cash By Visit Type 01":
        return "VisitType";
      case "POS Cash By Service Area 01":
        return "ServiceArea";
      case "POS Cash By Payment Code 01":
        return "PaymentCode";

      case "Cash Collected By Entity 01":
        return "EntityName";
      case "Cash Collected By Acc Grp 01":  // Updated this case to match your subtype
        return "AccGrp";
      case "Cash Collected By PC 01":
        return "PaymentCode";
      case "Charity Care By Entity 01":
        return "EntityName";
      case "Charity Care By Visit Type 01":
        return "VisitType";
      case "Charity Care By Serv Area 01":
        return "ServiceArea";
      case "Charity Care By AC 01":
        return "AdjustmentCode";
      case "Cost To Collect By Entity 01":
        return "EntityName";
      default:
        return "MonthYear";
    }
  };

  // Calendar rendering for Transactions By Day
  const renderCalendar = (calendarData = null, calendarMetrics = null) => {
    // Use provided data or fallback to global data
    const dataToUse = calendarData || filteredData;
    const metricsToUse = calendarMetrics || metricOptions;

    if (!selectedSubtypes.length) {
      return <p>No dashboard subtype is selected</p>;
    }

    if (!dataToUse.length) {
      return <p>No data available for this selection</p>;
    }

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay())); // End on Saturday

    // Group data by date for all metrics
    const dataByDate = {};
    dataToUse.forEach(item => {
      const date = new Date(item.dateValue);
      const dateKey = date.toISOString().slice(0, 10);
      if (!dataByDate[dateKey]) {
        dataByDate[dateKey] = {};
      }
      metricsToUse.forEach(m => {
        if (!dataByDate[dateKey][m]) {
          dataByDate[dateKey][m] = 0;
        }
        dataByDate[dateKey][m] += Number(item[m] || 0);
      });
    });

    // Generate calendar days
    const days = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateKey = current.toISOString().slice(0, 10);
      const isCurrentMonth = current.getMonth() === month;
      const value = dataByDate[dateKey] || {};
      days.push({
        date: new Date(current),
        dateKey,
        isCurrentMonth,
        value
      });
      current.setDate(current.getDate() + 1);
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    return (
      <div className="calendar-container">
        {/* Calendar Header */}
        <div className="calendar-header">
          <button
            onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
            className="calendar-nav-button"
          >
            ‹
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setCalendarDate(new Date(year - 1, month, 1))}
              className="calendar-nav-button-small"
            >
              ‹‹
            </button>
            <h3 className="calendar-month-year">
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={() => setCalendarDate(new Date(year + 1, month, 1))}
              className="calendar-nav-button-small"
            >
              ››
            </button>
          </div>
          <button
            onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
            className="calendar-nav-button"
          >
            ›
          </button>
        </div>

        {/* Days of week header */}
        <div className="calendar-days-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-name">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
          {days.map((day, index) => {
            const handleMouseEnter = (e) => {
              if (Object.keys(day.value).length > 0) {
                const rect = e.target.getBoundingClientRect();
                setTooltipPosition({
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10
                });

                // Calculate total, highest, and lowest for the day
                let total = 0;
                let highest = 0;
                let lowest = Number.MAX_SAFE_INTEGER;
                let highestMetric = '';
                let lowestMetric = '';

                Object.entries(day.value).forEach(([metric, value]) => {
                  const numValue = Number(value) || 0;
                  total += numValue;
                  if (numValue > highest) {
                    highest = numValue;
                    highestMetric = metric;
                  }
                  if (numValue > 0 && numValue < lowest) {
                    lowest = numValue;
                    lowestMetric = metric;
                  }
                });

                if (lowest === Number.MAX_SAFE_INTEGER) lowest = 0;

                setHoveredDayData({
                  date: day.date,
                  total,
                  highest,
                  lowest,
                  highestMetric,
                  lowestMetric,
                  metrics: day.value
                });
                setShowTooltip(true);
                setIsHoveringDay(true);
              }
            };

            const handleMouseLeave = () => {
              setShowTooltip(false);
              setIsHoveringDay(false);
              setHoveredDayData(null);
            };

            return (
              <div
                key={index}
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="calendar-day-number">
                  {day.date.getDate()}
                </div>
                {Object.keys(day.value).map(m => {
                  const absValue = Math.abs(day.value[m]);
                  const formattedAbs = absValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
                  const sign = day.value[m] < 0 ? '-' : '';
                  const displayValue = day.value[m] !== 0 ? `${sign}$${formattedAbs}` : '$0';
                  const titleValue = day.value[m] !== 0 ? `${sign}${formattedAbs}` : '0';
                  return (
                    <div key={m} className="calendar-metric">
                      <span className={`calendar-metric-name ${getMetricClass(m)}`}>{m}:</span>
                      <span className="calendar-metric-value" title={titleValue}>
                        {displayValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Tooltip */}
        {showTooltip && hoveredDayData && (
          <div
            className="calendar-tooltip"
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translate(-50%, -100%)',
              zIndex: 1000
            }}
          >
            <div className="tooltip-header">
              {hoveredDayData.date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="tooltip-content">
              {Object.entries(hoveredDayData.metrics).map(([metric, value]) => {
                const absValue = Math.abs(value);
                const formattedAbs = absValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
                const sign = value < 0 ? '-' : '';
                const displayValue = value !== 0 ? `${sign}$${formattedAbs}` : '$0';
                return (
                  <div key={metric} className="tooltip-metric">
                    <span className={`tooltip-metric-name ${getMetricClass(metric)}`}>{metric}:</span>
                    <span className="tooltip-metric-value">{displayValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderChart = () => {
    // Special case for Transactions By Day - render calendar
    if (subtype === "Transactions By Day 01") {
      return renderCalendar();
    }

    if (!selectedSubtypes.length) {
      return <p>No dashboard subtype is selected</p>;
    }

    if (isLoading) {
      return <div>Loading chart data...</div>;
    }

    if (!hierarchicalFilteredData.length) {
      return <p>No data available for this selection</p>;
    }
    
    

    // Get the appropriate x-axis data key based on the current subtype
    const xAxisDataKey = getXAxisDataKey();
    
    // Special handling for Cost to Collect dashboard
    // Generate a unique identifier to ensure no duplicate x-axis labels
    if (subtype && subtype.includes("By Entity 01") && selectedEntity) {
      // If we have multiple data points with the same entity name, we need to ensure uniqueness
      // by modifying the data to have only one entry for the selected entity
      if (hierarchicalFilteredData.length > 1 && hierarchicalFilteredData.every(d => d.EntityName === selectedEntity)) {
        // Create a new aggregate data point that combines all metrics
        const totalsByMetric = {};
        metricOptions.forEach(metric => {
          totalsByMetric[metric] = 0;
        });
        
        // Sum up all values for each metric
        hierarchicalFilteredData.forEach(item => {
          metricOptions.forEach(metric => {
            totalsByMetric[metric] += Number(item[metric] || 0);
          });
        });
        
        // Replace the filtered data with a single aggregated entry
        hierarchicalFilteredData = [{
          EntityName: selectedEntity,
          ...totalsByMetric
        }];
      }
      
    }

    if (chartType === "Pie") {
      if (!metricOptions.length) {
        return <p>No metrics available for pie chart</p>;
      }
      const pieData = metricOptions.map((metricName, originalIndex) => {
        const totalValue = hierarchicalFilteredData.reduce((sum, item) => sum + (parseFloat(item[metricName]) || 0), 0);
        return {
          name: metricName,
          value: totalValue,
          colorIndex: originalIndex
        };
      });
      if (pieData.length === 0) {
        return <p>No data available for pie chart</p>;
      }
      return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.colorIndex % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [name, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="custom-pie-legend">
            {pieData.map((entry, index) => {
              const color = COLORS[entry.colorIndex % COLORS.length];
              const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);
              const percent = totalValue > 0 ? (entry.value / totalValue * 100).toFixed(0) : 0;

              return (
                <div className="pie-legend-item" key={`legend-${index}`}>
                  <div className="pie-legend-color" style={{ backgroundColor: color }} />
                  <div className="pie-legend-text">
                    <span className="pie-legend-name">{entry.name}</span>
                    <span className="pie-legend-percentage">{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const isLineChart = chartType === "Line";
    const isHorizontalBar = chartType === "BarHorizontal";
    
    
    // For horizontal bar chart, show only a few labels if there are many bars
    let yAxisTickProps = { fill: theme === 'light' ? '#000000' : '#d5ecafff', fontWeight: 'bold', fontSize: 14 };
    let yAxisInterval = 0;
    let yAxisWidth = 180;
    if (isHorizontalBar) {
      const barCount = hierarchicalFilteredData.length;
      const LABEL_THRESHOLD = 10;
      if (barCount > LABEL_THRESHOLD) {
        yAxisInterval = Math.ceil(barCount / LABEL_THRESHOLD);
      } else {
        yAxisInterval = 0; // Show all labels
      }
    }

    const ChartComponent = isLineChart ? LineChart : BarChart;
    const ChartElement = isLineChart ? Line : Bar;

    // Set label color for chart types
    let axisTickColor = getAxisTickColor();
    if (isLineChart) axisTickColor = getAxisTickColor();
    if (!isLineChart && !isHorizontalBar) axisTickColor = getAxisTickColor();

    // Helper function to format large numbers with commas and abbreviations
    const formatYAxisTick = (value) => {
      if (value === 0) return '0';
      const absValue = Math.abs(value);
      if (absValue >= 1.0e+9) {
        return (value / 1.0e+9).toFixed(1) + "B";
      } else if (absValue >= 1.0e+6) {
        return (value / 1.0e+6).toFixed(1) + "M";
      } else if (absValue >= 1.0e+3) {
        return (value / 1.0e+3).toFixed(1) + "K";
      } else {
        return value.toLocaleString();
      }
    };

    // Calculate dynamic width for YAxis based on max label length
    const getYAxisWidth = () => {
      if (!hierarchicalFilteredData.length) return 60;
      const maxVal = Math.max(...metricOptions.flatMap(m => hierarchicalFilteredData.map(d => Number(d[m]) || 0)));
      const formattedMax = formatYAxisTick(maxVal);
      // Approximate width: 10px per character + padding
      return Math.min(Math.max(formattedMax.length * 10 + 20, 60), 120);
    };

    // Calculate interval for YAxis ticks to avoid overlap
    const getYAxisInterval = () => {
      if (!hierarchicalFilteredData.length) return 0;
      const maxVal = Math.max(...metricOptions.flatMap(m => hierarchicalFilteredData.map(d => Number(d[m]) || 0)));
      if (maxVal > 1000000) return 1;
      if (maxVal > 100000) return 0;
      return 0;
    };

    return (
      <ResponsiveContainer width="100%" height={selectedSubtypes.length > 0 ? "100%" : 350}>
        <ChartComponent data={hierarchicalFilteredData} layout={isHorizontalBar ? "vertical" : "horizontal"}>
          {isHorizontalBar ? (
            <XAxis type="number" />
          ) : (
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={{ fill: axisTickColor, fontWeight: 'bold', fontSize: 14 }}
              tickFormatter={(value, index) => {
                // Special handling for Cost to Collect dashboard to prevent duplicate entity names

                return value;
              }}
            />
          )}
          {isHorizontalBar ? (
            <YAxis dataKey={xAxisDataKey} type="category" tick={yAxisTickProps} interval={yAxisInterval} width={yAxisWidth} />
          ) : (
            <YAxis
              tick={{ fill: axisTickColor, fontWeight: 'bold', fontSize: 14 }}
              interval={getYAxisInterval()}
              width={getYAxisWidth()}
              tickFormatter={formatYAxisTick}
            />
          )}
          <Tooltip content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              // Detailed logging for dashboard
              console.log('\n=== Detailed Tooltip Data ===');
              console.log('Subtype:', subtype);
              // Get the appropriate data key and handle special cases
              const xAxisKey = getXAxisDataKey();
              let labelValue = label;
              
              // If label is not provided or is undefined, try to get it from the payload
              if (!labelValue && payload[0].payload) {
                if (xAxisKey === 'PC' && !payload[0].payload['PC']) {
                  labelValue = payload[0].payload['PaymentCode'];
                } else if (subtype === "Charity Care By AC 01") {
                  labelValue = payload[0].payload['AdjustmentCode'];
                } else {
                  labelValue = payload[0].payload[xAxisKey];
                }
              }
              
              console.log('Label:', labelValue);
              
              // Log hierarchy level based on dashboard type
              if (isDenialsDashboard) {
                console.log('Denial Hierarchy Level:', denialHierarchyLevel);
              } else if (isBillingEditDashboard) {
                console.log('Billing Edit Hierarchy Level:', billingEditHierarchyLevel);
              } else if (isArDaysDashboard) {
                console.log('AR Days Hierarchy Level:', arDaysHierarchyLevel);
              } else if (isAgedArDaysDashboard) {
                console.log('Aged AR Days Hierarchy Level:', agedArDaysHierarchyLevel);
              } else if (isDaysDischargedDashboard) {
                console.log('Days Discharged Hierarchy Level:', daysDischargedHierarchyLevel);
              } else if (isBadDebtDashboard) {
                console.log('Bad Debt Hierarchy Level:', badDebtHierarchyLevel);
              } else if (isPosCashDashboard) {
                console.log('POS Cash Hierarchy Level:', posCashHierarchyLevel);
              } else if (isCashCollectedDashboard) {
                console.log('Cash Collected Hierarchy Level:', cashCollectedHierarchyLevel);
              } else if (isCharityCareDashboard) {
                console.log('Charity Care Hierarchy Level:', charityCareHierarchyLevel);
              }
              
              // Log first payload item's complete data structure
              const samplePayload = payload[0].payload;
              console.log('\nComplete Data Structure:', samplePayload);
              console.log('Available Keys:', Object.keys(samplePayload));
              
              // Log individual metrics
              console.log('\nMetrics Details:');
              payload.forEach((item, index) => {
                console.log(`\nMetric ${index + 1}:`, {
                  name: item.name,
                  value: item.value,
                  dataKey: item.dataKey,
                  accountGroup: item.payload.AccountGroup,
                  entityName: item.payload.EntityName,
                  accountingPeriod: item.payload.AccountingYearPeriod
                });
              });
              
              const isDenialsHierarchical = DENIALS_HIERARCHY.includes(subtype) && denialHierarchyLevel < 3;
              const isBillingEditHierarchical = BILLING_EDIT_HIERARCHY.includes(subtype) && billingEditHierarchyLevel < 3;
              const isArDaysHierarchical = AR_DAYS_HIERARCHY.includes(subtype) && arDaysHierarchyLevel < 3;
              const isAgedArHierarchical = AGED_AR_DAYS_HIERARCHY.includes(subtype) && agedArDaysHierarchyLevel < 3;
              const isDaysDischargedHierarchical = DAYS_DISCHARGED_HIERARCHY.includes(subtype) && daysDischargedHierarchyLevel < 3;
              const isBadDebtHierarchical = BAD_DEBT_HIERARCHY.includes(subtype) && badDebtHierarchyLevel < 3;
              const isPosCashHierarchical = POS_CASH_HIERARCHY.includes(subtype) && posCashHierarchyLevel < 3;
              const isCharityCareHierarchical = CHARITY_CARE_HIERARCHY.includes(subtype) && charityCareHierarchyLevel < 3;
              
              const isBarChart = chartType === "Bar";
              const isLineChart = chartType === "Line";
              const showDrillDown = (
                isDenialsHierarchical || 
                isBillingEditHierarchical || 
                isArDaysHierarchical || 
                isAgedArHierarchical ||
                isDaysDischargedHierarchical ||
                isBadDebtHierarchical ||
                isPosCashHierarchical ||
                isCharityCareHierarchical
              ) && (isBarChart || isLineChart);

              // Define distinct colors for light theme for metric names
              const lightThemeColors = ["#6366f1", "#22c55e", "#f97316", "#d946ef", "#0ea5e9", "#facc15"];

              // Get a displayable label
              const displayLabel = labelValue || label || "N/A";
              
              return (
                <div className="custom-tooltip" style={{ backgroundColor: theme === 'dark' ? '#333' : '#f9f9f9', padding: '10px', border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`, color: theme === 'dark' ? '#eee' : '#333' }}>
                  <p className="label" style={{ fontWeight: 'bold', marginBottom: '8px' }}>{displayLabel}</p>
                  {payload.map((entry, index) => {
                    const color = theme === 'light' ? lightThemeColors[index % lightThemeColors.length] : entry.color;
                    const formattedValue = typeof entry.value === 'number'
                      ? entry.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : entry.value;
                    
                    return (
                      <p key={`item-${index}`} style={{ color: color, margin: '4px 0' }}>
                        {entry.name}: {formattedValue}
                      </p>
                    );
                  })}
                  {showDrillDown && (
                    <p style={{ marginTop: '8px', fontStyle: 'italic', color: theme === 'dark' ? '#aaa' : '#555' }}>
                      {isBarChart ? 'Click on bar to drill down into hierarchy' : 'Click on line/data point to drill down into hierarchy'}
                      {isDenialsDashboard && <span> for Denials</span>}
                      {isBillingEditDashboard && <span> for Billing Edits</span>}
                      {isArDaysDashboard && <span> for AR Days</span>}
                      {isAgedArDaysDashboard && <span> for Aged AR Days</span>}
                      {isDaysDischargedDashboard && <span> for Days Discharged</span>}
                      {isBadDebtDashboard && <span> for Bad Debt</span>}
                      {isPosCashDashboard && <span> for POS Cash</span>}
                      {isCharityCareDashboard && <span> for Charity Care</span>}
                    </p>
                  )}
                </div>
              );
            }
            return null;
          }} />
          {metricOptions.map((m, index) => {
            const color = COLORS[index % COLORS.length];
            return isLineChart ? (
              <Line
                key={m}
                type="monotone"
                dataKey={m}
                stroke={color}
                fill={color}
                strokeWidth={3}  // increased stroke width for better visibility
                name={m}
                activeDot={{ onClick: (e, payload) => handleBarClickForApp(payload.payload) }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    handleBarClickForApp(e.activePayload[0].payload);
                  }
                }}
              />
            ) : (
              <Bar
                key={m}
                dataKey={m}
                stroke={color}
                fill={color}
                strokeWidth={1}  // added stroke width for bar border visibility
                name={m}
                onClick={handleBarClickForApp}
              />
            );
          })}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  // Helper function to render performance speedometer with color coding
  const renderPerformanceSpeedometer = () => {
    if (!hierarchicalFilteredData.length || !metricOptions.length) {
      return <div className="performance-indicator no-data">No data available</div>;
    }

    // Calculate total performance value across all metrics
    let totalValue = 0;
    let metricCount = 0;

    // Sum up values across all metrics for the selected entity
    hierarchicalFilteredData.forEach(d => {
      metricOptions.forEach(metric => {
        const val = parseFloat(d[metric]) || 0;
        totalValue += val;
        metricCount++;
      });
    });

    // Calculate average value
    const avgValue = metricCount > 0 ? totalValue / metricCount : 0;

    // Find max value across all entries and metrics
    let maxValue = 0;
    hierarchicalFilteredData.forEach(d => {
      metricOptions.forEach(metric => {
        const val = parseFloat(d[metric]) || 0;
        if (val > maxValue) maxValue = val;
      });
    });

    // Find min value across all entries and metrics (for non-zero values)
    let minValue = Number.MAX_SAFE_INTEGER;
    hierarchicalFilteredData.forEach(d => {
      metricOptions.forEach(metric => {
        const val = parseFloat(d[metric]) || 0;
        if (val > 0 && val < minValue) minValue = val;
      });
    });
    if (minValue === Number.MAX_SAFE_INTEGER) minValue = 0;

    // Determine performance level, color, and percentage for meter
    let performanceLevel, color, message, percentage;

    if (dashboardType === "Denials") {
      // For denials: lower is better (inverted scale)
      // Define thresholds based on actual data range
      const lowThreshold = minValue + (maxValue - minValue) * 0.3;
      const highThreshold = minValue + (maxValue - minValue) * 0.7;

      if (avgValue <= lowThreshold) {
        performanceLevel = "Excellent";
        color = "#22c55e"; // Green
        message = "Low Denials";
        // Convert to percentage (lower denials = higher percentage)
        percentage = Math.max(10, 100 - ((avgValue - minValue) / (maxValue - minValue)) * 100);
      } else if (avgValue <= highThreshold) {
        performanceLevel = "Average";
        color = "#f97316"; // Orange
        message = "Monitor Closely";
        percentage = Math.max(10, 100 - ((avgValue - minValue) / (maxValue - minValue)) * 100);
      } else {
        performanceLevel = "Poor";
        color = "#ef4444"; // Red
        message = "Action Required";
        percentage = Math.max(10, 100 - ((avgValue - minValue) / (maxValue - minValue)) * 100);
      }
    } else {
      // For transactions: higher is better (normal scale)
      // Define thresholds based on actual data range
      const lowThreshold = minValue + (maxValue - minValue) * 0.3;
      const highThreshold = minValue + (maxValue - minValue) * 0.7;

      if (avgValue >= highThreshold) {
        performanceLevel = "Excellent";
        color = "#22c55e"; // Green
        message = "High Performance";
        // Convert to percentage (higher transactions = higher percentage)
        percentage = Math.min(90, ((avgValue - minValue) / (maxValue - minValue)) * 100);
      } else if (avgValue >= lowThreshold) {
        performanceLevel = "Average";
        color = "#f97316"; // Orange
        message = "Average Performance";
        percentage = Math.min(90, ((avgValue - minValue) / (maxValue - minValue)) * 100);
      } else {
        performanceLevel = "Poor";
        color = "#ef4444"; // Red
        message = "Needs Attention";
        percentage = Math.min(90, ((avgValue - minValue) / (maxValue - minValue)) * 100);
      }
    }

    // Check for NaN or invalid values
    const isDataValid = !isNaN(percentage) && !isNaN(avgValue) && avgValue !== 0;

    // Ensure percentage is within bounds
    percentage = isDataValid ? Math.max(5, Math.min(95, percentage)) : 0;

    return (
      <div className="performance-meter">
        {isDataValid ? (
          <div className="meter-container">
            <svg width="100" height="120" viewBox="0 0 100 120">
              {/* Meter background arc */}
              <path
                d="M 15 90 A 35 35 0 0 1 85 90"
                stroke="#e5e7eb"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              {/* Meter progress arc */}
              <path
                d="M 15 90 A 35 35 0 0 1 85 90"
                stroke={color}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 110} 110`}
                className="meter-progress"
              />
              {/* Needle */}
              <g transform={`rotate(${(percentage / 100) * 180 - 90} 50 90)`}>
                <line
                  x1="50"
                  y1="90"
                  x2="50"
                  y2="65"
                  stroke="#374151"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="45" r="3" fill="#374151" />
              </g>
            </svg>

            <div className="meter-labels">
              <div className="meter-value" style={{ color: color }}>
                {Math.round(percentage)}%
              </div>
              <div className="meter-level" style={{ color: color }}>
                {performanceLevel}
              </div>
              <div className="meter-message">
                {message}
              </div>
              <div className="meter-avg-value">
                Avg: {avgValue.toFixed(1)}
              </div>
            </div>
          </div>
        ) : (
          <div className="meter-container">
            <div className="meter-labels">
              <div className="meter-value" style={{ fontSize: '16px', fontWeight: 'normal' }}>
                No data available
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper function to render mini charts
  const renderMiniChart = (chartType, data) => {
    if (!data || data.length === 0 || !metricOptions.length) return <div className="no-data">No data available</div>;

    const miniData = data.slice(-5); // Show last 5 data points for mini view
    const firstMetric = metricOptions[0];

    switch (chartType) {
      case 'Line':
        return (
          <LineChart width={280} height={120} data={miniData}>
            <Line type="monotone" dataKey={firstMetric} stroke="#3b82f6" strokeWidth={2} dot={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide />
          </LineChart>
        );
      case 'Bar':
        return (
          <BarChart width={280} height={120} data={miniData}>
            <Bar dataKey={firstMetric} fill="#3b82f6" fillOpacity={1} />
            <XAxis dataKey="time" hide />
            <YAxis hide />
          </BarChart>
        );
      default:
        return <div className="mini-chart-placeholder">Chart Preview</div>;
    }
  };

  // Helper function to render speedometer
  const renderSpeedometer = () => {
    if (!hierarchicalFilteredData.length || !metricOptions.length) {
      return <div className="performance-meter"><div className="meter-container"><div className="meter-labels"><div className="meter-value" style={{ fontSize: '16px', fontWeight: 'normal' }}>No data available</div></div></div></div>;
    }

    // Calculate total value and count total metrics
    let totalValue = 0;
    let metricCount = 0;

    // Calculate current performance based on hierarchical data
    hierarchicalFilteredData.forEach(d => {
      metricOptions.forEach(metric => {
        const val = parseFloat(d[metric]) || 0;
        totalValue += val;
        metricCount++;
      });
    });

    // Calculate average value
    const performanceValue = metricCount > 0 ? totalValue / metricCount : 0;

    // Find max value across all entries and metrics
    let maxValue = 0;
    hierarchicalFilteredData.forEach(d => {
      metricOptions.forEach(metric => {
        const val = parseFloat(d[metric]) || 0;
        if (val > maxValue) maxValue = val;
      });
    });

    const percentage = maxValue > 0 ? Math.min((performanceValue / maxValue) * 100, 100) : 0;
    const isDataValid = !isNaN(percentage) && percentage !== 0;

    return (
      <div className="speedometer-container">
        <div className="speedometer-title">Performance</div>
        <div className="speedometer">
          {isDataValid ? (
            <>
              <div className="speedometer-arc">
                <div
                  className="speedometer-needle"
                  style={{ transform: `rotate(${(percentage / 100) * 180 - 90}deg)` }}
                />
              </div>
              <div className="speedometer-value">{percentage.toFixed(1)}%</div>
            </>
          ) : (
            <div className="speedometer-value" style={{ fontSize: '16px', fontWeight: 'normal' }}>No data available</div>
          )}
        </div>
      </div>
    );
  };

  // Helper function to handle month-based chart views
  const renderMonthBasedChart = (subtypeValue) => {
    // Get data for this specific subtype
    const subtypeData = subtypeDataMap[subtypeValue] || [];

    // Filter data by selected entity and date range
    const filteredSubtypeData = subtypeData.filter(d => {
      if (selectedEntity && d.EntityName !== selectedEntity) return false;
      const date = new Date(d.dateValue);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return !isNaN(date) && date >= from && date <= to;
    });

    // Extract metrics for this subtype
    let subtypeMetrics = [];
    if (filteredSubtypeData.length > 0) {
      const firstRow = filteredSubtypeData[0];
      const excluded = ["EntityName", "Day", "AccountingYearPeriod", "MonthYear", "dateValue", "CarrierName", "VisitType", "DenialCode", "InsuranceName", "Ins", "BillingEditType", "ServiceArea", "FinancialClass", "AccountGroup", "PrimaryInsurance","PaymentCode","Acc Grp","PC","VisitType","AdjustmentCode"];
      subtypeMetrics = Object.keys(firstRow).filter(k => !excluded.includes(k));
    }

    // Group data by month to avoid duplicates
    const groupedByMonth = {};
    filteredSubtypeData.forEach(d => {
      const monthYear = d.MonthYear;
      if (!groupedByMonth[monthYear]) {
        groupedByMonth[monthYear] = {
          ...d,
          MonthYear: monthYear
        };

        // Initialize metrics
        subtypeMetrics.forEach(metric => {
          groupedByMonth[monthYear][metric] = 0;
        });
      }

      // Aggregate metric values for each month
      subtypeMetrics.forEach(metric => {
        groupedByMonth[monthYear][metric] += parseFloat(d[metric]) || 0;
      });
    });

    // Convert to array and sort by date
    const chartData = Object.values(groupedByMonth);
    chartData.sort((a, b) => {
      const dateA = new Date(a.dateValue);
      const dateB = new Date(b.dateValue);
      return dateA - dateB;
    });

    // Prepare the chart
    const xAxisDataKey = "MonthYear";
    const isLineChart = chartType === "Line";
    const ChartComponent = isLineChart ? LineChart : BarChart;
    const ChartElement = isLineChart ? Line : Bar;
    const axisTickColor = getAxisTickColor();

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={chartData} layout="horizontal">
          <XAxis dataKey={xAxisDataKey} tick={{ fill: axisTickColor, fontWeight: 'bold', fontSize: 14 }} />
          <YAxis
            tick={{ fill: axisTickColor, fontWeight: 'bold', fontSize: 14 }}
            tickFormatter={formatYAxisTick}
          />
          <Tooltip />
          {subtypeMetrics.map((m, index) => {
            const color = COLORS[index % COLORS.length];
            return isLineChart ? (
              <Line key={m} type="monotone" dataKey={m} stroke={color} fill={color} name={m} />
            ) : (
              <Bar key={m} dataKey={m} stroke={color} fill={color} name={m} />
            );
          })}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  // Helper function to render chart for specific subtype
  const renderChartForSubtype = (subtypeValue) => {
    // Handle all month-based views
    if (subtypeValue === "Transactions By Month 01" ||
      subtypeValue === "Denials By Month 01" ||
      subtypeValue === "Billing Edit By Month 01" ||
      subtypeValue === "AR Days By Month 01" ||
      subtypeValue === "Aged AR By Month 01" ||
      subtypeValue === "Days Dis By Month 01" ||
      subtypeValue === "Bad Debt By Month 01" ||
      subtypeValue === "POS Cash By Month 01" ||
      subtypeValue === "Cost To Collect By Month 01" ||
      subtypeValue === "Cash Collected By Month 01" ||
      subtypeValue === "Charity Care By Month 01") {
      return renderMonthBasedChart(subtypeValue);
    }

    // Special case for Transactions By Day - render calendar
    if (subtypeValue === "Transactions By Day 01") {
      // Get data for this specific subtype
      const subtypeData = subtypeDataMap[subtypeValue] || [];

      // Filter data by selected entity and date range for this subtype
      const filteredSubtypeData = subtypeData.filter(d => {
        if (selectedEntity && d.EntityName !== selectedEntity) return false;
        const date = new Date(d.dateValue);
        const from = new Date(fromDate);
        const to = new Date(toDate);
        return !isNaN(date) && date >= from && date <= to;
      });

      // Extract metrics for this subtype
      let subtypeMetrics = [];
      if (filteredSubtypeData.length > 0) {
        const firstRow = filteredSubtypeData[0];
        const excluded = ["EntityName", "Day", "AccountingYearPeriod", "MonthYear", "dateValue", "CarrierName", "VisitType", "DenialCode", "InsuranceName", "Ins", "BillingEditType", "ServiceArea","PaymentCode","Acc Grp","PC","VisitType","AdjustmentCode"];
        subtypeMetrics = Object.keys(firstRow).filter(k => !excluded.includes(k));
      }

      return renderCalendar(filteredSubtypeData, subtypeMetrics);
    }

    // Get data for this specific subtype
    const subtypeData = subtypeDataMap[subtypeValue] || [];

    if (isLoading) {
      return <div>Loading chart data...</div>;
    }

    if (!subtypeData.length) {
      return (
        <div className="no-data-message">
          <p>No data available for {subtypeValue}</p>
        </div>
      );
    }

    // Filter data by selected entity and date range for this subtype
    const filteredSubtypeData = subtypeData.filter(d => {
      if (selectedEntity && d.EntityName !== selectedEntity) return false;
      const date = new Date(d.dateValue);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return !isNaN(date) && date >= from && date <= to;
    });

    // Extract metrics for this subtype
    let subtypeMetrics = [];
    if (filteredSubtypeData.length > 0) {
      const firstRow = filteredSubtypeData[0];
      const excluded = ["EntityName", "Day", "AccountingYearPeriod", "MonthYear", "dateValue", "CarrierName", "VisitType", "DenialCode", "InsuranceName", "Ins", "BillingEditType", "ServiceArea","PaymentCode","Acc Grp","PC","VisitType","AdjustmentCode"];
      subtypeMetrics = Object.keys(firstRow).filter(k => !excluded.includes(k));
    }

    // Get hierarchical filtered data for this subtype
    const getSubtypeHierarchicalData = () => {
      return processSubtypeData({
        dashboardType,
        subtypeValue,
        filteredSubtypeData,
        subtypeMetrics,
        selectedEntity,
        QUERY_BY_ENTITY_BE,
        QUERY_BY_INS_BE,
        QUERY_BY_VISIT_TYPE_BE,
        QUERY_BY_BE_TYPE_BE
      });
    };

    const hierarchicalData = getSubtypeHierarchicalData();

    if (!hierarchicalData.length) {
      return (
        <div className="no-data-message">
          <p>No data available for {subtypeValue}</p>
        </div>
      );
    }

    const isHorizontalBar = chartType === "BarHorizontal";
    const ChartComponent = chartType === "Line" ? LineChart : BarChart;

    return (
      <ResponsiveContainer width="100%" height={selectedSubtypes.length > 1 ? "100%" : 200}>
        <ChartComponent data={hierarchicalData} layout={isHorizontalBar ? "vertical" : "horizontal"}>
          {chartType === "Line" ? (
            subtypeMetrics.map((metric, index) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={getChartColors()[index % getChartColors().length]}
                strokeWidth={2}
                dot={{ fill: getChartColors()[index % getChartColors().length], strokeWidth: 2, r: 3 }}
              />
            ))
          ) : (
            subtypeMetrics.map((metric, index) => (
              <Bar
                key={metric}
                dataKey={metric}
                fill={getChartColors()[index % getChartColors().length]}
              />
            ))
          )}
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#444' : '#e0e0e0'} />
          {isHorizontalBar ? (
            <>
              <XAxis type="number" tick={{ fontSize: 10, fill: getAxisTickColor() }} />
              <YAxis type="category" 
                     dataKey={subtypeValue === "Cost To Collect By Entity 01" ? "EntityName" : getDisplayKey(subtypeValue)} 
                     tick={{ fontSize: 10, fill: getAxisTickColor() }} 
                     width={80} />
            </>
          ) : (
            <>
              <XAxis 
                dataKey={subtypeValue === "Cost To Collect By Entity 01" ? "EntityName" : getDisplayKey(subtypeValue)} 
                tick={{ fontSize: 10, fill: getAxisTickColor() }}
                tickFormatter={(value, index) => {
                  // Special handling for Cost to Collect dashboard to prevent duplicate entity names
                
                  return value;
                }}
              />
              <YAxis tick={{ fontSize: 10, fill: getAxisTickColor() }} />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              border: `1px solid ${theme === 'dark' ? '#555' : '#ccc'}`,
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
        </ChartComponent>
      </ResponsiveContainer>
    );
  };


  const renderAggregatedPie = () => {
    let allHierarchicalData = [];
    let allMetrics = new Set();

    selectedSubtypes.forEach(subtypeValue => {
      const subtypeData = subtypeDataMap[subtypeValue] || [];
      if (!subtypeData.length) return;

      const filteredSubtypeData = subtypeData.filter(d => {
        if (selectedEntity && d.EntityName !== selectedEntity) return false;
        const date = new Date(d.dateValue);
        const from = new Date(fromDate);
        const to = new Date(toDate);
        return !isNaN(date) && date >= from && date <= to;
      });

      let subtypeMetrics = [];
      if (filteredSubtypeData.length > 0) {
        const firstRow = filteredSubtypeData[0];
        const excluded = ["EntityName", "Day", "AccountingYearPeriod", "MonthYear", "dateValue", "CarrierName", "VisitType", "DenialCode", "InsuranceName", "Ins", "BillingEditType"];
        subtypeMetrics = Object.keys(firstRow).filter(k => !excluded.includes(k));
      }

      subtypeMetrics.forEach(m => allMetrics.add(m));

      const getSubtypeHierarchicalData = () => {
        if (dashboardType === "Denials") {
          if (subtypeValue.includes("Month")) {
            return filteredSubtypeData.map(d => ({
              ...d,
              [getDisplayKey(subtypeValue)]: d.MonthYear
            }));
          } else if (subtypeValue.includes("Entity")) {
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
            return Object.values(groupedData);
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
            return Object.values(groupedData);
          }
        }
        return filteredSubtypeData;
      };

      const hierarchicalData = getSubtypeHierarchicalData();
      allHierarchicalData = allHierarchicalData.concat(hierarchicalData);
    });

    if (allHierarchicalData.length === 0) {
      return <p>No data available for pie chart</p>;
    }

    const pieData = Array.from(allMetrics).map(metricName => {
      const totalValue = allHierarchicalData.reduce((sum, item) => sum + (parseFloat(item[metricName]) || 0), 0);
      return {
        name: metricName,
        value: totalValue
      };
    }).filter(item => item.value > 0);

    if (pieData.length === 0) {
      return <p>No data available for pie chart</p>;
    }

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [name, '']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="custom-pie-legend">
          {pieData.map((entry, index) => {
            const color = COLORS[index % COLORS.length];
            const percent = (entry.value / pieData.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(0);
            
            return (
              <div className="pie-legend-item" key={`legend-${index}`}>
                <div className="pie-legend-color" style={{ backgroundColor: color }} />
                <div className="pie-legend-text">
                  <span className="pie-legend-name">{entry.name}</span>
                  <span className="pie-legend-percentage">{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">PFM Dashboard</h1>
        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-left">
          <label>
            Namespace
            <select className="namespace-dropdown"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
            >
              <option value="">Select Namespace</option>
              {namespaces.map((ns) => (
                <option key={ns} value={ns}>
                  {ns}
                </option>
              ))}
            </select>
          </label>

          <label>
            Dashboard Type
            <select
              value={dashboardType}
              onChange={(e) => {
                setDashboardType(e.target.value);
                if (e.target.value && DASHBOARD_OPTIONS[e.target.value] && DASHBOARD_OPTIONS[e.target.value].length > 0) {
                  setSubtype(DASHBOARD_OPTIONS[e.target.value][0]);
                } else {
                  setSubtype("");
                }
              }}
            >
              <option value="">Select Dashboard Type</option>
              {Object.keys(DASHBOARD_OPTIONS).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="filter-right">
          <label>
            From
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>

          <label>
            To
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Main Dashboard Layout - Two Columns */}
      <div className="dashboard-main-layout">

        {/* Left Column: Controls and Status Cards */}
        <div className="left-column">
          {/* Dropdown Controls */}
          <div className="controls-section">
            <div className="controls-group">
              <div className="form-group">
                <label id="subtypeLabel">Dashboard Subtype (Max 2)</label>
                <div
                  className="multi-select-dropdown"
                  role="combobox"
                  aria-labelledby="subtypeLabel"
                >
                  <div
                    className="multi-select-trigger"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSubtypeDropdownOpen(prev => !prev);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    style={{ userSelect: 'none', cursor: 'pointer' }}
                  >
                    <span
                      className="selected-count"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      {selectedSubtypes.length} selected
                    </span>
                    <span
                      className="dropdown-arrow"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSubtypeDropdownOpen(prev => !prev);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {subtypeDropdownOpen ? '▲' : '▼'}
                    </span>
                  </div>
                  {subtypeDropdownOpen && (
                    <div
                      className="multi-select-options"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {getSubtypeOptionsForApp().map(st => (
                        <div
                          key={st.value}
                          className={`multi-select-option ${st.disabled ? 'disabled' : ''}`}
                          style={{ paddingLeft: `${(st.label ? st.label.match(/^ */)[0].length : 0) * 10 + 8}px` }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label
                            className="checkbox-label"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={selectedSubtypes.includes(st.value)}
                              onChange={(e) => handleSubtypeToggle(st.value, e)}
                              onClick={(e) => e.stopPropagation()}
                              disabled={st.disabled || (selectedSubtypes.length >= 2 && !selectedSubtypes.includes(st.value))}
                            />
                            <span className="checkbox-text">
                              {st.label ? st.label.trimStart() : st.value}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="entitySelect">Entity</label>
                <select
                  id="entitySelect"
                  name="entitySelect"
                  className="control-dropdown"
                  value={selectedEntity}
                  onChange={e => setSelectedEntity(e.target.value)}
                  disabled={
                    // Check if we have any "By Entity 01" subtype selected
                    !selectedSubtypes.some(st => st.includes("By Entity 01")) && (
                      (isDenialsDashboard && denialHierarchyLevel > 0 && denialHierarchyLevel <= 3 && !selectedSubtypes.some(st => st.includes("Month"))) ||
                      (isBillingEditDashboard && billingEditHierarchyLevel > 0 && billingEditHierarchyLevel <= 3 && !selectedSubtypes.some(st => st.includes("Month"))) ||
                      (isArDaysDashboard && arDaysHierarchyLevel > 0 && arDaysHierarchyLevel <= 3 && !selectedSubtypes.some(st => st.includes("Month"))) ||
                      (isAgedArDaysDashboard && agedArDaysHierarchyLevel > 0 && agedArDaysHierarchyLevel <= 3 && !selectedSubtypes.some(st => st.includes("Month")))
                    )
                  }
                >
                  {entityOptions.map(entity => (
                    <option key={entity} value={entity}>{entity}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Status Cards (Flash Cards) */}
          <div className="status-cards-vertical">
            {(() => {
              // Define labels and values dynamically based on dashboardType and subtype
              let card1Label = "Total Transaction";
              let card2Label = "Highest Transaction of Month";
              let card3Label = "Lowest Transaction of Month";

              let card1Value = "-";
              let card2Value = "-";
              let card3Value = "-";

              // Special case for Transactions By Day with hover
              if (subtype === "Transactions By Day 01" && isHoveringDay && hoveredDayData) {
                const formatAmount = (value) => {
                  const absValue = Math.abs(value);
                  const formattedAbs = absValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
                  const sign = value < 0 ? '-' : '';
                  return value !== 0 ? `${sign}$${formattedAbs}` : "$0";
                };
                // Using short date format to avoid text size issues
                const shortDate = hoveredDayData.date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
                card1Label = `Total for ${shortDate}`;
                card1Value = formatAmount(hoveredDayData.total);
                card2Label = `Highest for ${shortDate}`;
                card2Value = formatAmount(hoveredDayData.highest);
                card3Label = `Lowest for ${shortDate}`;
                card3Value = hoveredDayData.lowest !== 0 ? formatAmount(hoveredDayData.lowest) : "$0";
              } else if (hierarchicalFilteredData.length && metricOptions.length > 0) {
                const category = getCategory(subtype);
                const displayKey = getDisplayKey(subtype);

                if (dashboardType === "Transactions") {
                  // Calculate total transaction as sum of all metrics
                  let totalTransaction = 0;
                  metricOptions.forEach(metric => {
                    totalTransaction += hierarchicalFilteredData.reduce((sum, d) => sum + (parseFloat(d[metric]) || 0), 0);
                  });
                  card1Label = "Total";
                  card1Value = totalTransaction.toLocaleString(undefined, { maximumFractionDigits: 2 });

                  // Find the highest transaction value among all months and metrics
                  let highestValue = 0;
                  let highestMetric = null;
                  let highestMonth = null;
                  hierarchicalFilteredData.forEach(d => {
                    metricOptions.forEach(metric => {
                      const val = parseFloat(d[metric]) || 0;
                      if (val > highestValue) {
                        highestValue = val;
                        highestMetric = metric;
                        highestMonth = d[displayKey];
                      }
                    });
                  });
                  if (highestMetric && highestMonth) {
                    card2Label = `Highest by Month`;
                    card2Value = `${highestMonth} (${highestValue.toLocaleString(undefined, { maximumFractionDigits: 2 })})`;
                  } else {
                    card2Label = "Highest by Month";
                    card2Value = "-";
                  }

                  // Find the lowest non-zero transaction value among all months and metrics
                  let lowestValue = Number.MAX_SAFE_INTEGER;
                  let lowestMetric = null;
                  let lowestMonth = null;
                  hierarchicalFilteredData.forEach(d => {
                    metricOptions.forEach(metric => {
                      const val = parseFloat(d[metric]) || 0;
                      if (val > 0 && val < lowestValue) {
                        lowestValue = val;
                        lowestMetric = metric;
                        lowestMonth = d[displayKey];
                      }
                    });
                  });
                  if (lowestMetric && lowestMonth) {
                    card3Label = `Lowest by Month`;
                    card3Value = `${lowestMonth} (${lowestValue.toLocaleString(undefined, { maximumFractionDigits: 2 })})`;
                  } else {
                    card3Label = "Lowest by Month";
                    card3Value = "-";
                  }
                } else {
                  if (metricOptions.length > 0) {
                    card1Label = `Total`;
                    card2Label = `Highest by Month`;
                    card3Label = `Lowest by Month`;

                    card1Value = hierarchicalFilteredData.reduce((sum, d) => sum + (parseFloat(d[metricOptions[0]]) || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

                    const maxObj = hierarchicalFilteredData.reduce((max, d) => {
                      const dVal = parseFloat(d[metricOptions[0]]) || 0;
                      const maxVal = parseFloat(max[metricOptions[0]]) || 0;
                      return dVal > maxVal ? d : max;
                    }, hierarchicalFilteredData[0]);
                    card2Value = maxObj && maxObj[displayKey] ? `${maxObj[displayKey]} (${parseFloat(maxObj[metricOptions[0]]).toLocaleString(undefined, { maximumFractionDigits: 2 })})` : "-";

                    // Find lowest non-zero value
                    const positiveData = hierarchicalFilteredData.filter(d => (parseFloat(d[metricOptions[0]]) || 0) > 0);
                    if (positiveData.length > 0) {
                      const minObj = positiveData.reduce((min, d) => {
                        const dVal = parseFloat(d[metricOptions[0]]);
                        const minVal = parseFloat(min[metricOptions[0]]);
                        return dVal < minVal ? d : min;
                      });
                      card3Value = `${minObj[displayKey]} (${parseFloat(minObj[metricOptions[0]]).toLocaleString(undefined, { maximumFractionDigits: 2 })})`
                    } else {
                      card3Value = "-";
                    }
                  } else {
                    card1Label = "Total";
                    card2Label = "Highest";
                    card3Label = "Lowest";
                    card1Value = "-";
                    card2Value = "-";
                    card3Value = "-";
                  }
                }
              }

              return (
                <>
                  <div className="flash-card">
                    <div className="flash-card-icon">
                      <FaChartBar />
                    </div>
                    <div className="flash-card-content">
                      <h5>{card1Label}</h5>
                      <p>{card1Value}</p>
                    </div>
                  </div>
                  <div className="flash-card">
                    <div className="flash-card-icon">
                      <FaFileInvoice />
                    </div>
                    <div className="flash-card-content">
                      <h5>{card2Label}</h5>
                      <p>{card2Value}</p>
                    </div>
                  </div>
                  <div className="flash-card">
                    <div className="flash-card-icon">
                      <FaHospital />
                    </div>
                    <div className="flash-card-content">
                      <h5>{card3Label}</h5>
                      <p>{card3Value}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Performance Speedometer */}
          <div className="performance-speedometer-section">
            <h4>Performance Level</h4>
            {renderPerformanceSpeedometer()}
          </div>
        </div>

        {/* Right Column: Main Chart(s) */}
        <div className="main-chart-section">
          <div className="main-chart-header">
            <h3 className="main-chart-title">
              {dashboardType} - {selectedSubtypes.length > 1 ? 'Multiple Views' : (subtype === "Transactions By Day 01" ? "Calendar View" : subtype)}
            </h3>
            {(!selectedSubtypes.every(st => st === "Transactions By Day 01")) && (
              <div className="chart-type-selector">
                <button
                  className={`chart-type-btn ${chartType === "Line" ? "active" : ""}`}
                  onClick={() => setChartType("Line")}
                >
                  Line
                </button>
                <button
                  className={`chart-type-btn ${chartType === "Bar" ? "active" : ""}`}
                  onClick={() => setChartType("Bar")}
                >
                  Bar
                </button>
                {selectedSubtypes.length === 1 && (
                  <button
                    className={`chart-type-btn ${chartType === "Pie" ? "active" : ""}`}
                    onClick={() => setChartType("Pie")}
                  >
                    Pie
                  </button>
                )}

                {/* Download Button */}
                {hierarchicalFilteredData && hierarchicalFilteredData.length > 0 && (
                  <button
                    className="chart-type-btn"
                    style={{
                      marginLeft: '10px',
                      backgroundColor: theme === 'dark' ? '#4a5568' : '#3182ce',
                      color: 'white',
                    }}
                    onClick={() => {
                      const currentDate = new Date().toISOString().split('T')[0];
                      
                      // Function to download data as CSV
                      const downloadCSV = (data, filename) => {
                        // Convert data to CSV format
                        const keys = Array.from(
                          new Set(
                            data.flatMap(item => Object.keys(item))
                          )
                        );

                        // Create CSV header
                        const header = keys.join(',');

                        // Create CSV rows
                        const rows = data.map(item => {
                          return keys.map(key => {
                            const value = item[key];
                            if (value === undefined || value === null) return '';
                            const stringValue = String(value);
                            return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
                          }).join(',');
                        });

                        // Combine header and rows
                        const csvContent = [header, ...rows].join('\n');
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', filename);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      };
                      
                      // If multiple subtypes are selected, download separate files
                      if (selectedSubtypes.length > 1) {
                        selectedSubtypes.forEach(subtypeValue => {
                          const subtypeData = subtypeDataMap[subtypeValue] || [];
                          if (subtypeData.length > 0) {
                            const subtypeName = subtypeValue.toLowerCase().replace(/\s+/g, '-');
                            const filename = `dashboard-data-${dashboardType.toLowerCase().replace(/\s+/g, '-')}-${subtypeName}-${currentDate}.csv`;
                            downloadCSV(subtypeData, filename);
                          }
                        });
                      } else {
                        // Single view - download hierarchicalFilteredData
                        const filename = `dashboard-data-${dashboardType.toLowerCase().replace(/\s+/g, '-')}-${currentDate}.csv`;
                        downloadCSV(hierarchicalFilteredData, filename);
                      }
                    }}
                  >
                    {selectedSubtypes.length > 1 ? 'Download All Views' : 'Download'}
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="main-chart-container">
            {selectedSubtypes.length > 1 ? (
              <div className="multi-chart-container">
                {selectedSubtypes.map((selectedSubtype, index) => (
                  <div key={selectedSubtype} className={`chart-item ${selectedSubtype === "Transactions By Day 01" ? "chart-item-calendar" : ""}`}>
                    <h4 className="chart-item-title">{selectedSubtype}</h4>
                    <div className="chart-item-content">
                      {renderChartForSubtype(selectedSubtype)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              renderChart()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
