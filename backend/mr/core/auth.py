# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from datetime import datetime, timedelta

from sqlalchemy.exc import IntegrityError
from .corebase import CoreBase
from mr.core import models as m


def is_password_complex_enough(password):
    if len(password) < 6:
        return False
    # if len(set(password)) < 3:
    #     return False
    # cats = set(unicodedata.category(c) for c in password)
    # if len(cats) < 3:
    #     return False
    return True


class Auth(CoreBase):

    """Docstring for Auth. """

    def signup_email(self, email, password=None):
        user = m.User(Email=email)
        if password:
            if not is_password_complex_enough(password):
                return None
            user.set_password(password)
        self.session.add(user)
        try:
            self.session.flush()
        except IntegrityError:
            self.session.rollback()
            return None
        return user

    def make_auth_token(self, user):
        """TODO: Docstring for make_auth_token.

        :user: TODO
        :returns: TODO

        """
        token = m.AuthToken(
            ExpireTime=datetime.utcnow() + timedelta(seconds=self.conf.AUTH_TOKEN_EXPIRE_TIME),
            User_Key=user.User_Key
        )
        self.session.add(token)
        self.session.flush()
        return token

    def set_password(self, user, password):
        if not is_password_complex_enough(password):
            return None
        user.set_password(password)
        return user
