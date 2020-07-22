# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from mr.core import models as m

modelsmap = {
    m.User: [
        'UserKey',
        'FirstName',
        'LastName',
        'Email',
        'IsActive',
    ],
    m.DimClient: [
        'DimClientKey', 'DimCompanyKey', 'DimOrganisationKey', 'ClientId',
        'ClientName', 'IsActive', 'CreateDate', 'ModDate'
    ],
    m.DimCompany: ['DimCompanyKey', 'CompanyCode', 'CompanyName', 'IsActive'],
    m.DimDate: [
        'DimDateKey', 'Date', 'Day', 'DaySuffix', 'Weekday', 'WeekDayName', 'IsWeekend', 'IsHoliday',
        'DOWInMonth', 'DayOfYear', 'WeekOfMonth', 'WeekOfYear', 'ISOWeekOfYear', 'Month', 'MonthName', 'Quarter',
        'QuarterName', 'Year', 'MMYYYY', 'MonthYear', 'FirstDayOfMonth', 'LastDayOfMonth', 'FirstDayOfQuarter',
        'LastDayOfQuarter', 'FirstDayOfYear', 'LastDayOfYear', 'FirstDayOfNextMonth', 'FirstDayOfNextYear'
    ],
    m.DimEmployee: [
        'DimEmployeeKey', 'DimCompanyKey', 'DimOrganisationkey', 'EmployeeId', 'EmployeeName',
        'EmployeeFirstName', 'EmployeeLastName', 'EmployeeInitials', 'IsActive', 'CreateDate', 'ModDate'
    ],
    m.DimOrganisation: [
        'DimOrganisationKey', 'DimCompanyKey', 'OrgId', 'OrgName', 'IsActive', 'CreateDate', 'ModDate'
    ],
    m.DimProject: [
        'DimProjectKey', 'ProjectId', 'ProjectName', 'ProjectStatus', 'IsActive', 'CreateDate', 'ModDate'
    ],
    m.DimProjectSubType: [
        'DimProjectSubTypeKey', 'ProjectSubTypeCode', 'ProjectSubTypeDescription', 'IsActive', 'CreateDate', 'ModDate'
    ],
    m.DimProjectType: [
        'DimProjectTypeKey', 'ProjectTypeCode', 'ProjectTypeDescription', 'IsActive', 'CreateDate', 'ModDate'
    ],
    m.DimChartOfAccounts: [
        'DimChartOfAccountsKey', 'DimCompanyKey', 'DimOrganisationKey', 'AccountNumber', 'AccountName',
        'AccountType', 'AccountSubType', 'CashFlowGroup', 'CashFlowCategory', 'IsActive', 'CreateDate', 'ModDate'
    ],
    m.FactProjectFees: [
        'FactProjectFeesKey', 'DimProjectKey', 'DimCompanyKey', 'DimOrganisationKey', 'DimClientKey',
        'DimEmployeeDirectorKey', 'DimEmployeeProjectManagerKey', 'DimEmployeeSupervisorKey',
        'DimProjectTypeKey', 'DimProjectSubTypeKey', 'DimDateKey', 'ActualFees', 'ForecastFees'
    ],
    m.FactGeneralLedgerExpenses: [
        'FactGeneralLedgerExpensesKey', 'DimCompanyKey', 'DimOrganisationKey', 'DimDateKey',
        'DimChartOfAccountsKey', 'ActualExpenses', 'ForecastExpenses'
    ],
    m.FactAccountsReceivableInvoice: [
        'FactAccountsReceivableInvoiceKey', 'DimCompanyKey', 'DimOrganisationKey', 'DimDateKey', 'DimProjectKey',
        'DimClientKey', 'DimProjectTypeKey', 'DimProjectSubTypeKey', 'DimEmployeeDirectorKey',
        'DimEmployeeProjectManagerKey', 'DimEmployeeSupervisorKey', 'DimEmployeeProjectSourceOneKey',
        'DimEmployeeProjectSourceTwoKey', 'InvoiceNumber', 'InvoiceDate', 'InvoiceAmount', 'OutstandingAmount',
        'Outstanding30Days', 'Outstanding60Days', 'Outstanding90Days', 'Outstanding120Days', 'Outstanding120PlusDays',
        'IsActive', 'CreateDate', 'ModDate'
    ],
    m.FactFinancialMetric: [
        'FactFinancialMetricKey', 'DimCompanyKey', 'DimOrganisationKey', 'DimDateKey',
        'DebtorDays', 'QuickRatio', 'CurrentRatio', 'Roi', 'TotalIncome', 'TotalExpense',
        'Profit', 'PercentProfit', 'CashBalance', 'SafetyBankBalance', 'AverageMonthlyRevenue',
        'ProfitMargin', 'DebtToEquityRatio'
    ]
}
