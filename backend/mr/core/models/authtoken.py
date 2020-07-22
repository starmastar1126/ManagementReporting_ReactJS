# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from datetime import datetime
from sqlalchemy import Column, Integer, DateTime, ForeignKey

from .base import Base


class AuthToken(Base):
    """Docstring for AuthToken. """

    __tablename__ = 'AuthToken'

    AuthTokenKey = Column(Integer, primary_key=True, autoincrement=True)
    ExpireTime = Column(DateTime, nullable=False)
    UpdateTime = Column(DateTime, nullable=False, onupdate=datetime.utcnow, default=datetime.utcnow)
    CreateTime = Column(DateTime, nullable=False, default=datetime.utcnow)
    User_Key = Column(Integer, ForeignKey('User.User_Key'), nullable=False)
