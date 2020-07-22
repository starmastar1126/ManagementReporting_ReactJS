# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from sqlalchemy import Column, Integer, Numeric, ForeignKey
from .base import Base


class FactFinancialMetric(Base):

    """Docstring for FactFinancialMetric. """

    __tablename__ = 'FactFinancialMetric'

    FactFinancialMetricKey = Column(Integer, primary_key=True, autoincrement=True)
    DimCompanyKey = Column(Integer, ForeignKey('DimCompany.DimCompanyKey'), nullable=False)
    DimOrganisationKey = Column(Integer, ForeignKey('DimOrganisation.DimOrganisationKey'), nullable=False)
    DimDateKey = Column(Integer, ForeignKey('DimDate.DimDateKey'), nullable=False)
    DebtorDays = Column(Integer)
    QuickRatio = Column(Numeric(precision=12, scale=2))
    CurrentRatio = Column(Numeric(precision=12, scale=2))
    Roi = Column(Numeric(precision=12, scale=2))
    TotalIncome = Column(Numeric(precision=12, scale=2))
    TotalExpense = Column(Numeric(precision=12, scale=2))
    Profit = Column(Numeric(precision=12, scale=2))
    PercentProfit = Column(Numeric(precision=12, scale=2))
    CashBalance = Column(Numeric(precision=12, scale=2))
    SafetyBankBalance = Column(Integer)
    AverageMonthlyRevenue = Column(Numeric(precision=12, scale=2))
    ProfitMargin = Column(Numeric(precision=12, scale=2))
    DebtToEquityRatio = Column(Numeric(precision=12, scale=2))

    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'FactFinancialMetric({})'.format(self.FactFinancialMetricKey)
