# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

try:
    from UserDict import UserDict
except ImportError:
    from collections import UserDict


class ApiData(UserDict):

    """Docstring for ApiData. """

    def __getattr__(self, name):
        if name in self.data:
            return self.data[name]
        raise AttributeError("object has no attribute '{}'".format(name))

    def __setattr__(self, name, value):
        if name == 'data':
            self.__dict__[name] = value
        else:
            self.data[name] = value
