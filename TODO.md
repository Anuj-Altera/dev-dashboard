# TODO: Enable Hierarchy Drilling for Aged AR Days Dashboard

## Tasks
- [x] Import AgedArDaysDashboard component in App.js
- [x] Add AGED_AR_DAYS_HIERARCHY to imports from constants
- [x] Add hierarchy state variables for Aged AR Days (agedArDaysHierarchyLevel, selectedEntityBarAgedAR, selectedFinancialClassBarAgedAR, selectedAccountGroupBarAgedAR, selectedServiceAreaBarAgedAR)
- [x] Update useEffect to reset Aged AR Days hierarchy on dashboard type change
- [x] Update useEffect to notify parent of Aged AR Days hierarchy changes
- [x] Add isAgedArDaysDashboard boolean variable
- [x] Update getSubtypeOptions function to handle Aged AR Days hierarchy with indentation and disabling
- [x] Update handleBarClick function to handle Aged AR Days drill-down logic
- [x] Update renderChart function to use AgedArDaysDashboard component for Aged AR Days dashboard type
- [x] Update data fetching useEffect to include Aged AR Days hierarchy arguments in API calls
- [x] Update getHierarchicalFilteredData function to include Aged AR Days grouping logic
- [x] Test the changes to ensure Aged AR Days now supports hierarchy drilling like other dashboards
