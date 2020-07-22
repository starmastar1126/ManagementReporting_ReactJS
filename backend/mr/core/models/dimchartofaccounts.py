# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from sqlalchemy import Column, Integer, Unicode, DateTime
from datetime import datetime
from sqlalchemy.dialects.postgresql import BIT
from .base import Base


class DimChartOfAccounts(Base):

    """Docstring for DimChartOfAccounts. """

    __tablename__ = 'DimChartOfAccounts'

    DimChartOfAccountsKey = Column(Integer, primary_key=True, autoincrement=True)
    DimCompanyKey = Column(Integer)
    DimOrganisationKey = Column(Integer)
    AccountNumber = Column(Unicode(50))
    AccountName = Column(Unicode(100))
    AccountType = Column(Unicode(200))
    AccountSubType = Column(Unicode(200))
    CashFlowGroup = Column(Unicode(200))
    CashFlowCategory = Column(Unicode(200))
    IsActive = Column(BIT)
    CreateDate = Column(DateTime, default=datetime.utcnow)
    ModDate = Column(DateTime, onupdate=datetime.utcnow, default=datetime.utcnow)

    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'DimChartOfAccounts({})'.format(self.DimChartOfAccountsKey)
