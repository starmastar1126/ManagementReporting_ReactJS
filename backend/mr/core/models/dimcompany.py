# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from sqlalchemy import Column, Integer, Unicode
from sqlalchemy.dialects.postgresql import BIT
from .base import Base


class DimCompany(Base):

    """Docstring for DimCompany. """

    __tablename__ = 'DimCompany'

    DimCompanyKey = Column(Integer, primary_key=True, autoincrement=True)
    CompanyCode = Column(Unicode(50))
    CompanyName = Column(Unicode(225))
    IsActive = Column(BIT)

    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'DimCompany({})'.format(self.DimCompanyKey)
