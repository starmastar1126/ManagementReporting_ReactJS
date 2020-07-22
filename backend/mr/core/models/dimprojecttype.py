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


class DimProjectType(Base):

    """Docstring for DimProjectType. """

    __tablename__ = 'DimProjectType'

    DimProjectTypeKey = Column(Integer, primary_key=True, autoincrement=True)
    ProjectTypeCode = Column(Unicode(50))
    ProjectTypeDescription = Column(Unicode(255))
    IsActive = Column(BIT)
    CreateDate = Column(DateTime, default=datetime.utcnow)
    ModDate = Column(DateTime, onupdate=datetime.utcnow, default=datetime.utcnow)

    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'DimProjectType({})'.format(self.DimProjectTypeKey)
