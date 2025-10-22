// Utility to format Month-Year from any date string
export function formatMonthYear(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);
  return `${month}-${year}`;
}

export function getMetricClass(metricName) {
  const lower = metricName.toLowerCase().replace(/\s+/g, '');
  if (lower.includes('adjustment')) return 'adjustment';
  if (lower.includes('payment')) return 'payment';
  if (lower.includes('charge')) return 'charge';
  if (lower.includes('room')) return 'room';
  if (lower.includes('transaction') && lower.includes('amount')) return 'transactionamount';
  return ''; // default
}

export function getChartColors(theme) {
  if (theme === 'dark') {
    return ["#8ab4f8", "#4ade80", "#fb923c", "#c084fc", "#38bdf8", "#fde68a"];
  }
  return ["#6366f1", "#22c55e", "#f97316", "#d946ef", "#0ea5e9", "#facc15"];
}

export function getAxisTickColor(theme) {
  return theme === 'dark' ? '#d4d4d4' : '#333333';
}

// Helper function to get category from subtype
export function getCategory(subtype) {
  if (subtype.includes("Month")) return "Month";
  if (subtype.includes("Entity")) return "Entity";
  if (subtype.includes("Insurance") || subtype.includes("Ins")) return "Insurance";
  if (subtype.includes("Visit Type")) return "Visit Type";
  if (subtype.includes("Denial Code")) return "Denial Code";
  if (subtype.includes("BE Type")) return "BE Type";
  if (subtype.includes("Financial Class")) return "Financial Class";
  if (subtype.includes("Account Group")) return "Account Group";
  if (subtype.includes("Primary Insurance")) return "Primary Insurance";
  return "Item";
}

// Helper function to get display key for highest/lowest
export function getDisplayKey(subtype) {
  if (subtype.includes("Month")) return "MonthYear";
  if (subtype.includes("Entity")) return "EntityName";
  if (subtype.includes("Insurance") || subtype.includes("Ins")) return "CarrierName";
  if (subtype.includes("Visit Type")) return "VisitType";
  if (subtype.includes("Denial Code")) return "DenialCode";
  if (subtype.includes("BE Type")) return "BillingEditType";
  if (subtype.includes("Financial Class")) return "FinancialClass";
  if (subtype.includes("Account Group")) return "AccountGroup";
  if (subtype.includes("Primary Ins")) return "PrimaryInsurance";
  return "MonthYear";
}

export function getXAxisDataKey(subtype) {
  switch (subtype) {
    case "Denials By Entity 01":
      return "EntityName";
    case "Denials By Insurance 01":
      return "CarrierName";
    case "Denials By Visit Type 01":
      return "VisitType";
    case "Denials By Denial Code 01":
      return "DenialCode";
    case "Billing Edit By Entity 01":
      return "EntityName";
    case "Billing Edit By Ins 01":
      return "CarrierName";
    case "Billing Edit By Visit Type 01":
      return "VisitType";
    case "Billing Edit By BE Type 01":
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
       console.log("Financial Group has been called");
      return "FinancialClass";
    case "Aged AR By Account Group 01":
    console.log("Account Group has been called");
      return "AccountGroup";
    case "Aged AR By Service Area 01":
      return "ServiceArea";
    case "POS Cash By Entity 01":
      return "EntityName";
    case "POS Cash By Visit Type 01":
      return "VisitType";
    case "POS Cash By Service Area 01":
      return "ServiceArea";
    case "POS Cash By Payment Code 01":
      return "PaymentCode";
    case "Days Dis By Entity 01":
      return "EntityName";
    case "Days Dis By Fin Class 01":
      return "FinancialClass";
    case "Days Dis By Visit Type 01":
      return "VisitType";
    case "Days Dis By Service Area 01":
      return "ServiceArea";
    case "Cost To Collect By Entity 01":
      return "EntityName";
    default:
      return "MonthYear";
  }
}

// Helper function to format large numbers with commas and abbreviations
export function formatYAxisTick(value) {
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
}

// Calculate dynamic width for YAxis based on max label length
export function getYAxisWidth(data, metricOptions) {
  if (!data.length) return 60;
  const maxVal = Math.max(...metricOptions.flatMap(m => data.map(d => Number(d[m]) || 0)));
  const formattedMax = formatYAxisTick(maxVal);
  // Approximate width: 10px per character + padding
  return Math.min(Math.max(formattedMax.length * 10 + 20, 60), 120);
}

// Calculate interval for YAxis ticks to avoid overlap
export function getYAxisInterval(data, metricOptions) {
  if (!data.length) return 0;
  const maxVal = Math.max(...metricOptions.flatMap(m => data.map(d => Number(d[m]) || 0)));
  if (maxVal > 1000000) return 1;
  if (maxVal > 100000) return 0;
  return 0;
}
