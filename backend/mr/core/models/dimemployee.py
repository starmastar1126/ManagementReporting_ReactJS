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


class DimEmployee(Base):

    """Docstring for DimEmployee. """

    __tablename__ = 'DimEmployee'

    DimEmployeeKey = Column(Integer, primary_key=True, autoincrement=True)
    DimCompanyKey = Column(Integer)
    DimOrganisationkey = Column(Integer)
    EmployeeId = Column(Unicode(50))
    EmployeeName = Column(Unicode(255))
    EmployeeFirstName = Column(Unicode(100))
    EmployeeLastName = Column(Unicode(100))
    EmployeeInitials = Column(Unicode(20))
    IsActive = Column(BIT)
    CreateDate = Column(DateTime, default=datetime.utcnow)
    ModDate = Column(DateTime, onupdate=datetime.utcnow, default=datetime.utcnow)

    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'DimEmployee({})'.format(self.DimEmployeeKey)
