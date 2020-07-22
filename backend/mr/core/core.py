# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function


from .corebase import CoreBase
from .auth import Auth


class Core(CoreBase):

    """Docstring for Core. """

    def __init__(self, session, conf):
        """TODO: to be defined1.

        :session: TODO
        :conf: TODO

        """
        super(Core, self).__init__(session, conf)
        self.auth = Auth(session, conf)
