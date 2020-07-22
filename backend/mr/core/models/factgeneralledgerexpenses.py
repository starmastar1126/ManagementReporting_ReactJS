# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from sqlalchemy import Column, Integer, Numeric
from .base import Base


class FactGeneralLedgerExpenses(Base):

    """Docstring for FactGeneralLedgerExpenses. """

    __tablename__ = 'FactGeneralLedgerExpenses'

    FactGeneralLedgerExpensesKey = Column(Integer, primary_key=True, autoincrement=True)
    DimCompanyKey = Column(Integer, nullable=False)
    DimOrganisationKey = Column(Integer, nullable=False)
    DimDateKey = Column(Integer, nullable=False)
    DimChartOfAccountsKey = Column(Integer, nullable=False)
    ActualExpenses = Column(Numeric(precision=12, scale=2))
    ForecastExpenses = Column(Numeric(precision=12, scale=2))

    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'FactGeneralLedgerExpenses({})'.format(self.FactGeneralLedgerExpensesKey)
