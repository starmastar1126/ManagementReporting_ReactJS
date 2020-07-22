# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from sqlalchemy import Column, Integer, Unicode, Date, func, text, case
from sqlalchemy.dialects.postgresql import BIT, SMALLINT
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method
from .base import Base


class DimDate(Base):

    """Docstring for DimDate. """

    __tablename__ = 'DimDate'

    DimDateKey = Column(Integer, primary_key=True, autoincrement=True)
    DimDate = Column(Date, nullable=False)
    Day = Column(SMALLINT, nullable=False)
    DaySuffix = Column(Unicode(2), nullable=False)
    Weekday = Column(SMALLINT, nullable=False)
    WeekDayName = Column(Unicode(10), nullable=False)
    IsWeekend = Column(BIT, nullable=False)
    IsHoliday = Column(BIT, nullable=False)
    DOWInMonth = Column(SMALLINT, nullable=False)
    DayOfYear = Column(SMALLINT, nullable=False)
    WeekOfMonth = Column(SMALLINT, nullable=False)
    WeekOfYear = Column(SMALLINT, nullable=False)
    ISOWeekOfYear = Column(SMALLINT, nullable=False)
    Month = Column(SMALLINT, nullable=False)
    MonthName = Column(Unicode(10), nullable=False)
    Quarter = Column(SMALLINT, nullable=False)
    QuarterName = Column(Unicode(6), nullable=False)
    Year = Column(Integer, nullable=False)
    MMYYYY = Column(Unicode(6), nullable=False)
    MonthYear = Column(Unicode(30), nullable=False)
    FirstDayOfMonth = Column(Date, nullable=False)
    LastDayOfMonth = Column(Date, nullable=False)
    FirstDayOfQuarter = Column(Date, nullable=False)
    LastDayOfQuarter = Column(Date, nullable=False)
    FirstDayOfYear = Column(Date, nullable=False)
    LastDayOfYear = Column(Date, nullable=False)
    FirstDayOfNextMonth = Column(Date, nullable=False)
    FirstDayOfNextYear = Column(Date, nullable=False)

    @hybrid_property
    def FY(self):
        return self.Year + case([(self.Month > 6, 1)], else_=0)

    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'DimDate({})'.format(self.DimDateKey)
