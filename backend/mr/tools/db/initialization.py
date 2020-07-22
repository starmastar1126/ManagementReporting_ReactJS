# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function


from sqlalchemy import create_engine
from mr.core.models.base import Base


def init_db(db_url, echo=False):
    engine = create_engine(db_url, echo=echo)
    Base.metadata.create_all(engine)
