export const QUERY_BY_ENTITY_01 = "Denials By Entity 01";
export const QUERY_BY_INSURANCE_01 = "Denials By Insurance 01";
export const QUERY_BY_VISIT_TYPE_01 = "Denials By Visit Type 01";
export const QUERY_BY_DENIAL_CODE_01 = "Denials By Denial Code 01";
export const QUERY_BY_MONTH_01 = "Denials By Month 01";
export const QUERY_BY_MONTH_C01 = "Denials By Month C01";
export const QUERY_BY_ENTITY_BE = "Billing Edit By Entity 01";
export const QUERY_BY_INS_BE = "Billing Edit By Ins 01";
export const QUERY_BY_VISIT_TYPE_BE = "Billing Edit By Visit Type 01";
export const QUERY_BY_BE_TYPE_BE = "Billing Edit By BE Type 01";

export const DASHBOARD_OPTIONS = {
  Transactions: ["Transactions By Month 01", "Transactions By Day 01"],
  Denials: [
    "Denials By Month 01",
    "Denials By Month C01",
    "Denials By Entity 01",
    "Denials By Insurance 01",
    "Denials By Visit Type 01",
    "Denials By Denial Code 01",
  ],
  "Billing Edit": [
    "Billing Edit By Month 01",
    "Billing Edit By Month C01",
    "Billing Edit By Entity 01",
    "Billing Edit By Ins 01",
    "Billing Edit By Visit Type 01",
    "Billing Edit By BE Type 01"
  ],
  "AR Days": [
    "AR Days By Month 01",
    "AR Days By Month C01",
    "AR Days By Entity 01",
    "AR Days By Financial Class 01",
    "AR Days By Account Group 01",
    "AR Days By Primary Ins 01",
  ],
  "Aged AR Days": [
    "Aged AR By Month 01",
    "Aged AR By Month C01",
    "Aged AR By Entity 01",
    "Aged AR By Financial Class 01",
    "Aged AR By Account Group 01",
    "Aged AR By Service Area 01",
  ],
  "Days Discharged": [
    "Days Dis By Month 01",
    "Days Dis By Month C01",
    "Days Dis By Entity 01",
    "Days Dis By Fin Class 01",
    "Days Dis By Visit Type 01",
    "Days Dis By Service Area 01"
  ],
  "Bad Debt": [
    "Bad Debt By Month 01",
    "Bad Debt By Month C01",
    "Bad Debt By Entity 01",
    "Bad Debt By Fin Class 01",
    "Bad Debt By Visit Type 01",
    "Bad Debt By Service Area 01",
  ],
  "POS Cash": [
    "POS Cash By Month 01",
    "POS Cash By Month C01",
    "POS Cash By Entity 01",
    "POS Cash By Payment Code 01",
    "POS Cash By Visit Type 01",
    "POS Cash By Service Area 01",
  ],
  "Cost to Collect": [
    "Cost To Collect By Month 01",
    "Cost To Collect By Month C01",
    "Cost To Collect By Entity 01",
  ],
  "Cash Collected": [
    "Cash Collected By Month 01",
    "Cash Collected By Month C01",
    "Cash Collected By Entity 01",
    "Cash Collected By Acc Grp 01",
    "Cash Collected By PC 01"
  ],
  "Charity Care": [
    "Charity Care By Month 01",
    "Charity Care By Month C01",
    "Charity Care By Entity 01",
    "Charity Care By Visit Type 01",
    "Charity Care By AC 01",
    "Charity Care By Serv Area 01",
  ],
};

export const DENIALS_HIERARCHY = [
  QUERY_BY_ENTITY_01,
  QUERY_BY_INSURANCE_01,
  QUERY_BY_VISIT_TYPE_01,
  QUERY_BY_DENIAL_CODE_01
];

export const BILLING_EDIT_HIERARCHY = [
  QUERY_BY_ENTITY_BE,
  QUERY_BY_INS_BE,
  QUERY_BY_VISIT_TYPE_BE,
  QUERY_BY_BE_TYPE_BE
];

export const AR_DAYS_HIERARCHY = [
  "AR Days By Entity 01",
  "AR Days By Financial Class 01",
  "AR Days By Account Group 01",
  "AR Days By Primary Ins 01",
];

export const AGED_AR_DAYS_HIERARCHY = [
  "Aged AR By Entity 01",
  "Aged AR By Financial Class 01",
  "Aged AR By Account Group 01",
  "Aged AR By Service Area 01",
];

export const DAYS_DISCHARGED_HIERARCHY = [
  "Days Dis By Entity 01",
  "Days Dis By Fin Class 01",
  "Days Dis By Visit Type 01",
  "Days Dis By Service Area 01"
];

export const BAD_DEBT_HIERARCHY = [
  "Bad Debt By Entity 01",
  "Bad Debt By Fin Class 01",
  "Bad Debt By Visit Type 01",
  "Bad Debt By Service Area 01"
];

export const CASH_COLLECTED_HIERARCHY = [
  "Cash Collected By Entity 01",
  "Cash Collected By Acc Grp 01",
  "Cash Collected By PC 01"
];

export const POS_CASH_HIERARCHY = [
  "POS Cash By Entity 01",
  "POS Cash By Visit Type 01",
  "POS Cash By Service Area 01",
  "POS Cash By Payment Code 01"
];

export const CHARITY_CARE_HIERARCHY = [
  "Charity Care By Entity 01",
  "Charity Care By Visit Type 01",
  "Charity Care By AC 01",
  "Charity Care By Serv Area 01"
];
