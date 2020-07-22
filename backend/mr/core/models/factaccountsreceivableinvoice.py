# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from sqlalchemy import Column, Integer, Unicode, DateTime, Date, Numeric, ForeignKey
from datetime import datetime
from sqlalchemy.dialects.postgresql import BIT
from sqlalchemy.orm import relationship

from .base import Base


class FactAccountsReceivableInvoice(Base):

    """Docstring for FactAccountsReceivableInvoice. """

    __tablename__ = 'FactAccountsReceivableInvoice'

    FactAccountsReceivableInvoiceKey = Column(Integer, primary_key=True, autoincrement=True)
    DimCompanyKey = Column(Integer, ForeignKey('DimCompany.DimCompanyKey'))
    DimOrganisationKey = Column(Integer, ForeignKey('DimOrganisation.DimOrganisationKey'))
    DimDateKey = Column(Integer, ForeignKey('DimDate.DimDateKey'))
    DimProjectKey = Column(Integer, ForeignKey('DimProject.DimProjectKey'))
    DimClientKey = Column(Integer, ForeignKey('DimClient.DimClientKey'))
    DimProjectTypeKey = Column(Integer, ForeignKey('DimProjectType.DimProjectTypeKey'))
    DimProjectSubTypeKey = Column(Integer, ForeignKey('DimProjectSubType.DimProjectSubTypeKey'))
    DimEmployeeDirectorKey = Column(Integer, ForeignKey('DimEmployee.DimEmployeeKey'))
    DimEmployeeProjectManagerKey = Column(Integer, ForeignKey('DimEmployee.DimEmployeeKey'))
    DimEmployeeSupervisorKey = Column(Integer, ForeignKey('DimEmployee.DimEmployeeKey'))
    DimEmployeeProjectSourceOneKey = Column(Integer)
    DimEmployeeProjectSourceTwoKey = Column(Integer)
    InvoiceNumber = Column(Unicode(50))
    InvoiceDate = Column(Date)
    InvoiceAmount = Column(Numeric(precision=12, scale=2))
    OutstandingAmount = Column(Numeric(precision=12, scale=2))
    Outstanding30Days = Column(Numeric(precision=12, scale=2))
    Outstanding60Days = Column(Numeric(precision=12, scale=2))
    Outstanding90Days = Column(Numeric(precision=12, scale=2))
    Outstanding120Days = Column(Numeric(precision=12, scale=2))
    Outstanding120PlusDays = Column(Numeric(precision=12, scale=2))
    IsActive = Column(BIT)
    CreateDate = Column(DateTime, default=datetime.utcnow)
    ModDate = Column(DateTime, onupdate=datetime.utcnow, default=datetime.utcnow)

    _ProjectManager = relationship('DimEmployee', foreign_keys=[DimEmployeeProjectManagerKey])
    _Director = relationship('DimEmployee', foreign_keys=[DimEmployeeDirectorKey])
    _Supervisor = relationship('DimEmployee', foreign_keys=[DimEmployeeSupervisorKey])

    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'FactAccountsReceivableInvoice({})'.format(self.FactAccountsReceivableInvoiceKey)
