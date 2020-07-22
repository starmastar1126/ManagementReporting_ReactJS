# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function


from datetime import datetime
from sqlalchemy import Column, Integer, String, Unicode, DateTime, Boolean
from werkzeug.security import generate_password_hash, check_password_hash

from .base import Base


class User(Base):

    """Docstring for User. """

    __tablename__ = 'User'

    User_Key = Column(Integer, primary_key=True, autoincrement=True)
    FirstName = Column(Unicode(45), nullable=True)
    LastName = Column(Unicode(45), nullable=True)
    Email = Column(Unicode(45), unique=True, nullable=True, index=True)
    PasswordHash = Column(String(128))
    IsActive = Column(Boolean, default=True, nullable=False)

    UpdateTime = Column(DateTime, nullable=False, onupdate=datetime.utcnow, default=datetime.utcnow)
    CreateTime = Column(DateTime, nullable=False, default=datetime.utcnow)
    LoginTime = Column(DateTime, nullable=True)

    def __repr__(self):
        return 'User({})'.format(self.User_Key)

    def set_password(self, password):
        """TODO: Docstring for set_password.

        :password: TODO
        :returns: TODO

        """
        self.PasswordHash = generate_password_hash(password)

    def is_password(self, password):
        """TODO: Docstring for is_password.

        :password: TODO
        :returns: TODO

        """
        if not self.PasswordHash:
            return False
        return check_password_hash(self.PasswordHash, password)
