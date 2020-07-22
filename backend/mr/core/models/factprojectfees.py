# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from sqlalchemy import Column, Integer, Numeric, ForeignKey
from .base import Base
from sqlalchemy.orm import relationship


class FactProjectFees(Base):

    """Docstring for FactProjectFees. """

    __tablename__ = 'FactProjectFees'

    FactProjectFeesKey = Column(Integer, primary_key=True, autoincrement=True)
    DimProjectKey = Column(Integer, ForeignKey('DimProject.DimProjectKey'), nullable=False)
    DimCompanyKey = Column(Integer, ForeignKey('DimCompany.DimCompanyKey'), nullable=False)
    DimOrganisationKey = Column(Integer, ForeignKey('DimOrganisation.DimOrganisationKey'), nullable=False)
    DimClientKey = Column(Integer, ForeignKey('DimClient.DimClientKey'))
    DimEmployeeDirectorKey = Column(Integer, ForeignKey('DimEmployee.DimEmployeeKey'))
    DimEmployeeProjectManagerKey = Column(Integer, ForeignKey('DimEmployee.DimEmployeeKey'))
    DimEmployeeSupervisorKey = Column(Integer, ForeignKey('DimEmployee.DimEmployeeKey'))
    DimProjectTypeKey = Column(Integer, ForeignKey('DimProjectType.DimProjectTypeKey'))
    DimProjectSubTypeKey = Column(Integer, ForeignKey('DimProjectSubType.DimProjectSubTypeKey'))
    DimDateKey = Column(Integer, ForeignKey('DimDate.DimDateKey'), nullable=False)
    ActualFees = Column(Numeric(precision=12, scale=2))
    ForecastFees = Column(Numeric(precision=12, scale=2))

    _ProjectManager = relationship('DimEmployee', foreign_keys=[DimEmployeeProjectManagerKey])
    _Director = relationship('DimEmployee', foreign_keys=[DimEmployeeDirectorKey])
    _Supervisor = relationship('DimEmployee', foreign_keys=[DimEmployeeSupervisorKey])

    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'FactProjectFees({})'.format(self.FactProjectFeesKey)
