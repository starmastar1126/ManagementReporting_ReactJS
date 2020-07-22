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


class DimProject(Base):

    """Docstring for DimProject. """

    __tablename__ = 'DimProject'

    DimProjectKey = Column(Integer, primary_key=True, autoincrement=True)
    ProjectId = Column(Unicode(50), nullable=False)
    ProjectName = Column(Unicode(255))
    ProjectStatus = Column(Unicode(50))
    IsActive = Column(BIT)
    CreateDate = Column(DateTime, default=datetime.utcnow)
    ModDate = Column(DateTime, onupdate=datetime.utcnow, default=datetime.utcnow)

    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'DimProject({})'.format(self.DimProjectKey)
